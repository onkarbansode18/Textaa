const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const DEFAULT_DB_NAME = 'ai_pdf_retrieval';
const DEFAULT_COLLECTION_NAME = 'documents';
const LOCAL_DATA_FILE = path.join(__dirname, '../data/documents-index.json');

let client;
let db;
let localMode = false;
let localCollection;

function allowLocalJsonFallback() {
  const value = (process.env.ALLOW_LOCAL_JSON_FALLBACK || 'true').trim().toLowerCase();
  return value === 'true';
}

function getMongoUri() {
  const uri = (process.env.MONGODB_URI || '').trim();
  if (!uri) {
    throw new Error('MONGODB_URI is missing.');
  }
  return uri;
}

async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(getMongoUri());
    await client.connect();

    const dbName = (process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME).trim();
    db = client.db(dbName);

    const collectionName = (process.env.MONGODB_COLLECTION_NAME || DEFAULT_COLLECTION_NAME).trim();
    const documentsCollection = db.collection(collectionName);
    await documentsCollection.createIndex({ fileName: 1 }, { unique: true });

    localMode = false;
    return db;
  } catch (error) {
    if (!allowLocalJsonFallback()) {
      throw new Error(`MongoDB unavailable and local JSON fallback is disabled: ${error.message}`);
    }
    console.warn(`MongoDB unavailable, using local JSON store: ${error.message}`);
    localMode = true;
    db = { mode: 'local-json' };
    localCollection = createLocalCollection();
    return db;
  }
}

function getDocumentsCollection() {
  if (!db) {
    throw new Error('Database is not connected. Call connectToDatabase first.');
  }

  if (localMode) {
    return localCollection;
  }

  const collectionName = (process.env.MONGODB_COLLECTION_NAME || DEFAULT_COLLECTION_NAME).trim();
  return db.collection(collectionName);
}

function ensureLocalFile() {
  const dir = path.dirname(LOCAL_DATA_FILE);
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LOCAL_DATA_FILE)) {
    fs.writeFileSync(LOCAL_DATA_FILE, '[]', 'utf8');
  }
}

function readLocalDocs() {
  ensureLocalFile();
  try {
    const raw = fs.readFileSync(LOCAL_DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalDocs(docs) {
  ensureLocalFile();
  fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(docs, null, 2), 'utf8');
}

function applyProjection(doc, projection) {
  if (!projection || typeof projection !== 'object') {
    return { ...doc };
  }
  const keys = Object.keys(projection).filter((key) => key !== '_id');
  if (keys.length === 0) {
    return { ...doc };
  }

  const includeMode = keys.some((key) => projection[key]);
  if (!includeMode) {
    const clone = { ...doc };
    keys.forEach((key) => {
      if (projection[key] === 0) {
        delete clone[key];
      }
    });
    return clone;
  }

  const selected = {};
  keys.forEach((key) => {
    if (projection[key]) {
      selected[key] = doc[key];
    }
  });
  return selected;
}

function createLocalCollection() {
  return {
    async createIndex() {
      return null;
    },
    find(filter = {}, options = {}) {
      const docs = readLocalDocs();
      const filtered = docs.filter((doc) =>
        Object.entries(filter).every(([key, value]) => doc[key] === value)
      );
      const projected = filtered.map((doc) => applyProjection(doc, options.projection));
      return {
        async toArray() {
          return projected;
        }
      };
    },
    async findOne(filter = {}, options = {}) {
      const docs = readLocalDocs();
      const found = docs.find((doc) =>
        Object.entries(filter).every(([key, value]) => doc[key] === value)
      );
      return found ? applyProjection(found, options.projection) : null;
    },
    async updateOne(filter = {}, update = {}, options = {}) {
      const docs = readLocalDocs();
      const index = docs.findIndex((doc) =>
        Object.entries(filter).every(([key, value]) => doc[key] === value)
      );
      const setPayload = update.$set || {};

      if (index >= 0) {
        docs[index] = { ...docs[index], ...setPayload };
        writeLocalDocs(docs);
        return { matchedCount: 1, modifiedCount: 1, upsertedCount: 0 };
      }

      if (options.upsert) {
        const next = { ...filter, ...setPayload };
        docs.push(next);
        writeLocalDocs(docs);
        return { matchedCount: 0, modifiedCount: 0, upsertedCount: 1 };
      }

      return { matchedCount: 0, modifiedCount: 0, upsertedCount: 0 };
    },
    async deleteOne(filter = {}) {
      const docs = readLocalDocs();
      const before = docs.length;
      const next = docs.filter(
        (doc) => !Object.entries(filter).every(([key, value]) => doc[key] === value)
      );
      writeLocalDocs(next);
      return { deletedCount: before - next.length };
    }
  };
}

module.exports = {
  connectToDatabase,
  getDocumentsCollection
};
