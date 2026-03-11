const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MAX_RETRIEVED_CHUNKS = 14;
const DEFAULT_LOCAL_EMBED_URL = 'http://127.0.0.1:8000/embed';
const DEFAULT_LOCAL_ANSWER_URL = 'http://127.0.0.1:11434/api/generate';
const DEFAULT_LOCAL_ANSWER_MODEL = 'llama3.1:8b';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_GEMINI_EMBEDDING_MODEL = 'gemini-embedding-001';
const DEFAULT_GEMINI_ANSWER_MODEL = 'gemini-2.5-flash';
const DEFAULT_GEMINI_EMBED_CONCURRENCY = 2;
const DEFAULT_GEMINI_EMBED_RETRIES = 4;
const DEFAULT_GEMINI_EMBED_RETRY_BASE_MS = 1200;
const DEFAULT_EMBED_BATCH_SIZE = 64;
const EXACT_MATCH_SCORE_BOOST = 0.35;
const LEXICAL_SCORE_WEIGHT = 0.8;
const RECORD_MATCH_FIELD_BOOST = 0.75;
const MIN_RECORD_SCORE = 1.15;
const MAX_RECORD_MATCHES = 8;
const RECORD_QUERY_HINTS = [
  'roll', 'account', 'loan', 'customer', 'id', 'number', 'no', 'ifsc',
  'mobile', 'contact', 'phone', 'amount', 'prn',
  'pan', 'aadhaar', 'passport', 'registration'
];
const PERSON_LOOKUP_STOPWORDS = new Set([
  'what', 'is', 'the', 'of', 'for', 'a', 'an', 'please', 'give', 'me', 'tell',
  'student', 'person', 'customer', 'borrower', 'name', 'mobile', 'contact',
  'phone', 'loan', 'amount', 'number', 'no', 'details', 'prn', 'named',
  'boy', 'girl', 'ladka', 'ladke', 'ladki', 'naam', 'ka', 'ki', 'ke', 'hai',
  'kya', 'studento', 'vidyarthi', 'chhatra'
]);
const PERSON_FIELD_LOOKUPS = [
  {
    key: 'mobile',
    label: 'mobile number',
    hints: ['mobile', 'contact no', 'contact number', 'phone', 'phone number']
  },
  {
    key: 'email',
    label: 'email ID',
    hints: ['email', 'email id', 'mail', 'mail id']
  },
  {
    key: 'roll_no',
    label: 'roll number',
    hints: ['roll no', 'roll number']
  },
  {
    key: 'gr_no',
    label: 'GR number',
    hints: ['gr no', 'gr number', 'gr.no', 'grno']
  },
  {
    key: 'prn_no',
    label: 'PRN number',
    hints: ['prn no', 'prn number', 'prn']
  },
  {
    key: 'loan_amount',
    label: 'loan amount',
    hints: ['loan amount', 'loan amt', 'amount', 'sanction amount']
  }
];
const TOKEN_STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how',
  'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was',
  'were', 'what', 'when', 'where', 'which', 'with', 'you', 'your'
]);
const NO_ANSWER_MARKERS = [
  'i could not find this in the uploaded documents',
  'i could not find relevant content in the uploaded documents',
  'not found in the uploaded documents'
];
const SUBJECT_QUERY_HINTS = [
  'subject name',
  'name of subject',
  'subject title',
  'course name',
  'name of course'
];
const MULTILINGUAL_QUERY_REPLACEMENTS = [
  [/मोबाइल नंबर|मोबाइल नम्बर|मोबाइल no|मोबाइल no\./gi, ' mobile number '],
  [/मोबाइल/gi, ' mobile '],
  [/नंबर|नम्बर/gi, ' number '],
  [/नाम/gi, ' name '],
  [/छात्र|विद्यार्थी/gi, ' student '],
  [/लड़का|लड़के/gi, ' student '],
  [/क्या है|क्या h|क्या/gi, ' what is '],
  [/\bmobile no\b|\bmobile number\b/gi, ' mobile number '],
  [/\bnaam\b/gi, ' name '],
  [/\bladka\b|\bladke\b|\bladki\b/gi, ' student '],
  [/\bvidyarthi\b|\bchhatra\b/gi, ' student '],
  [/\bkya hai\b|\bkya h\b|\bkya\b/gi, ' what is '],
  [/\bkaun sa\b|\bkaunsa\b|\bkon sa\b/gi, ' which '],
  [/\bkitna\b|\bkitne\b/gi, ' how many '],
  [/\bka\b|\bki\b|\bke\b/gi, ' ']
];

function normalizeForMatch(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function getQuotedAndNumericTokens(query) {
  const raw = String(query || '');
  const quoted = [...raw.matchAll(/"([^"]+)"|'([^']+)'/g)]
    .map((match) => (match[1] || match[2] || '').trim())
    .filter(Boolean);
  const numeric = [...raw.matchAll(/\d{6,}/g)].map((match) => match[0]);
  return Array.from(new Set([...quoted, ...numeric]));
}

function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .match(/[a-z0-9]{2,}/g) || [];
}

function extractNumericTokens(value, minLength = 4) {
  const re = new RegExp(`\\d{${minLength},}`, 'g');
  return Array.from(new Set((String(value || '').match(re) || [])));
}

function toTimestamp(value) {
  const time = Date.parse(String(value || ''));
  return Number.isFinite(time) ? time : 0;
}

function compactSpaces(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function cleanSubjectName(value) {
  const normalized = compactSpaces(value);
  if (!normalized) {
    return '';
  }

  const stopLabels = [
    'COURSE PREREQUISITES',
    'COURSE OBJECTIVES',
    'COURSE RELEVANCE',
    'TEACHING SCHEME',
    'CREDITS',
    'SECTION'
  ];

  let cleaned = normalized;
  stopLabels.forEach((label) => {
    const index = cleaned.toUpperCase().indexOf(label);
    if (index > 0) {
      cleaned = cleaned.slice(0, index).trim();
    }
  });

  return compactSpaces(cleaned);
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildHintPattern(hint) {
  const normalizedHint = normalizeForMatch(hint);
  if (!normalizedHint) {
    return null;
  }

  const escapedHint = escapeRegExp(normalizedHint).replace(/\s+/g, '\\s+');
  return new RegExp(`(?:^|[^a-z0-9])${escapedHint}(?=$|[^a-z0-9])`, 'i');
}

function containsHint(text, hint) {
  const pattern = buildHintPattern(hint);
  if (!pattern) {
    return false;
  }

  return pattern.test(normalizeForMatch(text));
}

function toDisplayName(value) {
  return compactSpaces(value)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function normalizeQueryForRetrieval(query) {
  let normalized = normalizeForMatch(query);

  MULTILINGUAL_QUERY_REPLACEMENTS.forEach(([pattern, replacement]) => {
    normalized = normalized.replace(pattern, replacement);
  });

  return compactSpaces(normalized);
}

function buildRetrievalQuery(query) {
  const original = compactSpaces(query);
  const normalized = normalizeQueryForRetrieval(query);

  if (!normalized || normalized === normalizeForMatch(original)) {
    return original;
  }

  return `${original}\n${normalized}`;
}

class AIService {
  sortDocumentsByUploadOrder(documents) {
    return [...(Array.isArray(documents) ? documents : [])]
      .sort((a, b) => {
        const diff = toTimestamp(a?.uploadedAt) - toTimestamp(b?.uploadedAt);
        if (diff !== 0) {
          return diff;
        }
        return String(a?.fileName || '').localeCompare(String(b?.fileName || ''));
      });
  }

  isNoAnswerResponse(answer) {
    const normalized = normalizeForMatch(answer);
    return NO_ANSWER_MARKERS.some((marker) => normalized.includes(marker));
  }

  isSubjectNameQuery(query) {
    const normalized = normalizeQueryForRetrieval(query);
    return SUBJECT_QUERY_HINTS.some((hint) => containsHint(normalized, hint));
  }

  extractSubjectNameFromChunks(chunks) {
    for (const chunk of chunks || []) {
      const text = String(chunk?.text || '');
      const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

      for (const line of lines) {
        const normalizedLine = compactSpaces(line);

        const codeWithNameMatch = normalizedLine.match(/\b([A-Z]{2,}\s*\d{3,5}[A-Z]?)\s*[:\-]\s*([A-Z][A-Z\s&/()\-]{2,})/i);
        if (codeWithNameMatch && codeWithNameMatch[2]) {
          const cleanedName = cleanSubjectName(codeWithNameMatch[2]);
          if (!cleanedName) {
            continue;
          }

          return {
            subjectName: cleanedName,
            subjectCode: compactSpaces(codeWithNameMatch[1]),
            chunk
          };
        }

        const labeledSubjectMatch = normalizedLine.match(/\b(?:subject|course)\s*(?:name|title)?\s*[:\-]\s*([A-Z][A-Z\s&/()\-]{2,})/i);
        if (labeledSubjectMatch && labeledSubjectMatch[1]) {
          const cleanedName = cleanSubjectName(labeledSubjectMatch[1]);
          if (!cleanedName) {
            continue;
          }

          return {
            subjectName: cleanedName,
            subjectCode: '',
            chunk
          };
        }
      }
    }

    return null;
  }

  get embeddingProvider() {
    const provider = (process.env.EMBEDDING_PROVIDER || 'local').trim().toLowerCase();
    if (!['local', 'gemini'].includes(provider)) {
      throw new Error('Unsupported EMBEDDING_PROVIDER. Use "local" or "gemini".');
    }
    return provider;
  }

  get answerProvider() {
    const provider = (process.env.ANSWER_PROVIDER || 'gemini').trim().toLowerCase();
    if (!['local', 'gemini'].includes(provider)) {
      throw new Error('Unsupported ANSWER_PROVIDER. Use "local" or "gemini".');
    }
    return provider;
  }

  get localEmbeddingUrl() {
    return (process.env.LOCAL_EMBEDDING_URL || DEFAULT_LOCAL_EMBED_URL).trim();
  }

  get localAnswerUrl() {
    return (process.env.LOCAL_ANSWER_URL || DEFAULT_LOCAL_ANSWER_URL).trim();
  }

  get localAnswerModel() {
    return (process.env.LOCAL_ANSWER_MODEL || DEFAULT_LOCAL_ANSWER_MODEL).trim();
  }

  get geminiApiKey() {
    return (process.env.GEMINI_API_KEY || '').trim();
  }

  get geminiEmbeddingModel() {
    return (process.env.GEMINI_EMBEDDING_MODEL || DEFAULT_GEMINI_EMBEDDING_MODEL).trim();
  }

  get geminiAnswerModel() {
    return (process.env.GEMINI_ANSWER_MODEL || DEFAULT_GEMINI_ANSWER_MODEL).trim();
  }

  get geminiEmbedConcurrency() {
    const value = Number(process.env.GEMINI_EMBED_CONCURRENCY || DEFAULT_GEMINI_EMBED_CONCURRENCY);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_GEMINI_EMBED_CONCURRENCY;
  }

  get geminiEmbedRetries() {
    const value = Number(process.env.GEMINI_EMBED_RETRIES || DEFAULT_GEMINI_EMBED_RETRIES);
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : DEFAULT_GEMINI_EMBED_RETRIES;
  }

  get geminiEmbedRetryBaseMs() {
    const value = Number(process.env.GEMINI_EMBED_RETRY_BASE_MS || DEFAULT_GEMINI_EMBED_RETRY_BASE_MS);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_GEMINI_EMBED_RETRY_BASE_MS;
  }

  get embedBatchSize() {
    const value = Number(process.env.EMBED_BATCH_SIZE || DEFAULT_EMBED_BATCH_SIZE);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_EMBED_BATCH_SIZE;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async embedTextWithGeminiWithRetry(text) {
    let attempt = 0;

    while (true) {
      try {
        const response = await axios.post(
          this.getGeminiEmbedUrl(),
          {
            content: {
              parts: [{ text }]
            }
          },
          {
            params: { key: this.geminiApiKey },
            headers: { 'Content-Type': 'application/json' }
          }
        );

        return response.data?.embedding?.values || [];
      } catch (error) {
        const status = error.response?.status;
        const retryable = status === 429 || status === 500 || status === 503;
        if (!retryable || attempt >= this.geminiEmbedRetries) {
          throw error;
        }

        const delayMs = this.geminiEmbedRetryBaseMs * Math.pow(2, attempt);
        attempt += 1;
        await this.sleep(delayMs);
      }
    }
  }

  requireGeminiApiKey() {
    const key = this.geminiApiKey;
    const looksPlaceholder = /^your[_-]?gemini[_-]?api[_-]?key/i.test(key) || /replace|placeholder|example/i.test(key);
    if (!key || looksPlaceholder) {
      throw new Error('Set a valid GEMINI_API_KEY in backend/.env when provider is "gemini".');
    }
  }

  formatAxiosError(error) {
    if (!error) {
      return 'Unknown request error';
    }

    const status = error.response?.status;
    const payload = error.response?.data;
    const message = error.message || 'Request failed';

    if (!status) {
      return message;
    }

    if (typeof payload === 'string' && payload.trim()) {
      return `HTTP ${status}: ${payload}`;
    }

    if (payload?.error?.message) {
      return `HTTP ${status}: ${payload.error.message}`;
    }

    return `HTTP ${status}: ${message}`;
  }

  getGeminiEmbedUrl() {
    return `${GEMINI_API_BASE}/models/${this.geminiEmbeddingModel}:embedContent`;
  }

  getGeminiGenerateUrl() {
    return `${GEMINI_API_BASE}/models/${this.geminiAnswerModel}:generateContent`;
  }

  getEmbeddingProviderTag() {
    return this.embeddingProvider;
  }

  cosineSimilarity(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0 || a.length !== b.length) {
      return -1;
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i += 1) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return -1;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  normalizeLocalEmbeddings(responseData) {
    if (Array.isArray(responseData?.embeddings)) {
      return responseData.embeddings;
    }
    if (Array.isArray(responseData?.embedding)) {
      return [responseData.embedding];
    }
    return [];
  }

  async embedTextsWithLocalModel(texts) {
    const response = await axios.post(
      this.localEmbeddingUrl,
      { texts },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return this.normalizeLocalEmbeddings(response.data);
  }

  async embedTextsWithGemini(texts) {
    this.requireGeminiApiKey();
    const vectors = new Array(texts.length);
    const concurrency = Math.min(this.geminiEmbedConcurrency, texts.length);
    let cursor = 0;

    const worker = async () => {
      while (cursor < texts.length) {
        const index = cursor;
        cursor += 1;

        vectors[index] = await this.embedTextWithGeminiWithRetry(texts[index]);
      }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    return vectors;
  }

  parseJSONSafely(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      return null;
    }

    const jsonBlock = rawText.match(/```json\s*([\s\S]*?)```/i);
    const candidate = jsonBlock ? jsonBlock[1] : rawText;

    try {
      return JSON.parse(candidate.trim());
    } catch (_) {
      const objectMatch = candidate.match(/\{[\s\S]*\}/);
      if (!objectMatch) {
        return null;
      }

      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        return null;
      }
    }
  }

  async embedQuery(text) {
    const vectors = await this.embedTexts([text]);
    return vectors[0] || [];
  }

  async embedTexts(texts) {
    if (!Array.isArray(texts) || texts.length === 0) {
      return [];
    }

    const batchSize = this.embedBatchSize;
    const provider = this.embeddingProvider;
    const vectors = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      let batchVectors = [];

      if (provider === 'gemini') {
        batchVectors = await this.embedTextsWithGemini(batch);
      } else {
        batchVectors = await this.embedTextsWithLocalModel(batch);
      }

      vectors.push(...batchVectors);
    }

    return vectors;
  }

  async retrieveRelevantChunks(query, documents, topK = MAX_RETRIEVED_CHUNKS) {
    const retrievalQuery = buildRetrievalQuery(query);
    let queryEmbedding = [];
    try {
      queryEmbedding = await this.embedQuery(retrievalQuery);
    } catch (_) {
      queryEmbedding = [];
    }

    const exactTokens = getQuotedAndNumericTokens(retrievalQuery).map((token) => normalizeForMatch(token));
    const queryTokens = tokenize(retrievalQuery).filter((token) => !TOKEN_STOPWORDS.has(token));
    const queryTokenSet = new Set(queryTokens);
    const scoredChunks = [];

    documents.forEach((doc) => {
      (doc.structuredData || []).forEach((chunk) => {
        const text = normalizeForMatch(chunk.text);
        const chunkTokens = tokenize(chunk.text);
        const overlapCount = chunkTokens.reduce(
          (count, token) => (queryTokenSet.has(token) ? count + 1 : count),
          0
        );
        const lexicalScore = queryTokenSet.size > 0 ? (overlapCount / queryTokenSet.size) * LEXICAL_SCORE_WEIGHT : 0;
        const hasExactToken = exactTokens.some((token) => token && text.includes(token));
        const semanticScore = this.cosineSimilarity(queryEmbedding, chunk.embedding);
        const baseScore = semanticScore > -1 ? Math.max(semanticScore, lexicalScore) : lexicalScore;
        const score = baseScore + (hasExactToken ? EXACT_MATCH_SCORE_BOOST : 0);

        if (score > 0) {
          scoredChunks.push({
            ...chunk,
            score,
            matchType: semanticScore > -1
              ? (hasExactToken ? 'exact+semantic' : 'semantic')
              : (hasExactToken ? 'exact+lexical' : 'lexical'),
            fileName: doc.fileName,
            originalName: doc.originalName || doc.fileName,
            startLine: chunk.startLine,
            endLine: chunk.endLine
          });
        }
      });
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, topK);
  }

  isRecordLookupQuery(query) {
    const lower = normalizeQueryForRetrieval(query);
    if (extractNumericTokens(lower).length > 0) {
      return true;
    }
    return RECORD_QUERY_HINTS.some((hint) => containsHint(lower, hint));
  }

  getRequestedPersonField(query) {
    const normalized = normalizeQueryForRetrieval(query);
    return PERSON_FIELD_LOOKUPS.find((field) => field.hints.some((hint) => containsHint(normalized, hint))) || null;
  }

  extractPersonNameFromQuery(query) {
    const raw = String(query || '');
    const normalizedRaw = normalizeQueryForRetrieval(query);
    const quotedName = getQuotedAndNumericTokens(raw).find((token) => /[a-z]/i.test(token) && !/\d/.test(token));
    if (quotedName) {
      return compactSpaces(quotedName);
    }

    const patterns = [
      /\bnamed\s+([a-z][a-z\s]{1,50})\??$/i,
      /\bstudent\s+named\s+([a-z][a-z\s]{1,50})\??$/i,
      /\bperson\s+named\s+([a-z][a-z\s]{1,50})\??$/i,
      /\bcustomer\s+named\s+([a-z][a-z\s]{1,50})\??$/i,
      /\bname\s*(?:is|:)?\s*([a-z][a-z\s]{1,50})\??$/i,
      /\bof\s+(?:student|person|customer|borrower)?\s*name\s*([a-z][a-z\s]{1,50})\??$/i,
      /\bof\s+(?:student|person|customer|borrower)?\s*([a-z][a-z\s]{1,50})\??$/i,
      /\bfor\s+(?:student|person|customer|borrower)?\s*([a-z][a-z\s]{1,50})\??$/i
    ];

    for (const pattern of patterns) {
      const match = raw.match(pattern);
      if (!match || !match[1]) {
        continue;
      }

      const cleaned = compactSpaces(
        match[1]
          .replace(/[^a-z\s]/gi, ' ')
          .split(/\s+/)
          .filter((token) => token && !PERSON_LOOKUP_STOPWORDS.has(token.toLowerCase()))
          .slice(0, 3)
          .join(' ')
      );
      if (cleaned) {
        return cleaned;
      }
    }

    const fallbackNameTokens = tokenize(normalizedRaw)
      .filter((token) => !PERSON_LOOKUP_STOPWORDS.has(token))
      .filter((token) => !RECORD_QUERY_HINTS.includes(token))
      .filter((token) => !['what', 'which', 'how', 'many', 'student', 'name'].includes(token));

    if (fallbackNameTokens.length > 0) {
      return compactSpaces(fallbackNameTokens.slice(0, 3).join(' '));
    }

    return '';
  }

  getWindowAroundName(text, personName, left = 90, right = 220) {
    const compactText = compactSpaces(text);
    const normalizedText = normalizeForMatch(compactText);
    const normalizedName = normalizeForMatch(personName);
    const index = normalizedText.indexOf(normalizedName);
    if (index < 0) {
      return compactText;
    }
    const start = Math.max(0, index - left);
    const end = Math.min(compactText.length, index + normalizedName.length + right);
    return compactText.slice(start, end);
  }

  extractMobileValue(text) {
    const mobileMatch = compactSpaces(text).match(/\b[6-9]\d{9}\b/);
    return mobileMatch ? mobileMatch[0] : '';
  }

  extractMobileValueForPerson(text, personName) {
    const compactText = compactSpaces(text);
    const normalizedName = compactSpaces(personName);
    if (!normalizedName) {
      return '';
    }

    const nameParts = normalizedName.split(/\s+/).filter(Boolean).map((part) => escapeRegExp(part));
    if (nameParts.length === 0) {
      return '';
    }

    const fullNamePattern = new RegExp(`\\b${nameParts.join('\\s+')}\\b[\\s\\S]{0,90}?\\b([6-9]\\d{9})\\b`, 'i');
    const fullNameMatch = compactText.match(fullNamePattern);
    if (fullNameMatch && fullNameMatch[1]) {
      return fullNameMatch[1];
    }

    const firstNamePattern = new RegExp(`\\b${nameParts[0]}\\b[\\s\\S]{0,90}?\\b([6-9]\\d{9})\\b`, 'i');
    const firstNameMatch = compactText.match(firstNamePattern);
    if (firstNameMatch && firstNameMatch[1]) {
      return firstNameMatch[1];
    }

    return '';
  }

  extractEmailValueForPerson(text, personName) {
    const compactText = compactSpaces(text);
    const normalizedName = compactSpaces(personName);
    if (!normalizedName) {
      return '';
    }
    const nameParts = normalizedName.split(/\s+/).filter(Boolean).map((part) => escapeRegExp(part));
    if (nameParts.length === 0) {
      return '';
    }

    const emailPattern = '([a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,})';
    const fullNamePattern = new RegExp(`\\b${nameParts.join('\\s+')}\\b[\\s\\S]{0,120}?${emailPattern}`, 'i');
    const fullMatch = compactText.match(fullNamePattern);
    if (fullMatch && fullMatch[1]) {
      return fullMatch[1];
    }

    const firstNamePattern = new RegExp(`\\b${nameParts[0]}\\b[\\s\\S]{0,120}?${emailPattern}`, 'i');
    const firstMatch = compactText.match(firstNamePattern);
    if (firstMatch && firstMatch[1]) {
      return firstMatch[1];
    }

    return '';
  }

  extractGrNoForPerson(text, personName) {
    const compactText = compactSpaces(text);
    const normalizedName = compactSpaces(personName);
    if (!normalizedName) {
      return '';
    }
    const nameParts = normalizedName.split(/\s+/).filter(Boolean).map((part) => escapeRegExp(part));
    if (nameParts.length === 0) {
      return '';
    }

    const fullBeforeName = new RegExp(`\\b(\\d{6,})\\b[\\s\\S]{0,40}?\\b${nameParts.join('\\s+')}\\b`, 'i');
    const fullMatch = compactText.match(fullBeforeName);
    if (fullMatch && fullMatch[1]) {
      return fullMatch[1];
    }

    const firstBeforeName = new RegExp(`\\b(\\d{6,})\\b[\\s\\S]{0,40}?\\b${nameParts[0]}\\b`, 'i');
    const firstMatch = compactText.match(firstBeforeName);
    if (firstMatch && firstMatch[1]) {
      return firstMatch[1];
    }

    return '';
  }

  extractRollNoForPerson(text, personName) {
    const compactText = compactSpaces(text);
    const normalizedName = compactSpaces(personName);
    if (!normalizedName) {
      return '';
    }
    const nameParts = normalizedName.split(/\s+/).filter(Boolean).map((part) => escapeRegExp(part));
    if (nameParts.length === 0) {
      return '';
    }

    const withGrPattern = new RegExp(`\\b(\\d{1,3})\\b\\s+\\d{6,}\\s+\\b${nameParts.join('\\s+')}\\b`, 'i');
    const withGrMatch = compactText.match(withGrPattern);
    if (withGrMatch && withGrMatch[1]) {
      return withGrMatch[1];
    }

    const labelPattern = new RegExp(`\\broll\\s*(?:no|number)?\\s*[:\\-]?\\s*([a-z0-9-]{1,12})\\b[\\s\\S]{0,80}?\\b${nameParts.join('\\s+')}\\b`, 'i');
    const labelMatch = compactText.match(labelPattern);
    if (labelMatch && labelMatch[1]) {
      return labelMatch[1];
    }

    return '';
  }

  extractLoanAmountValueForPerson(text, personName) {
    const compactText = compactSpaces(text);
    const normalizedName = compactSpaces(personName);
    if (!normalizedName) {
      return '';
    }
    const nameParts = normalizedName.split(/\s+/).filter(Boolean).map((part) => escapeRegExp(part));
    if (nameParts.length === 0) {
      return '';
    }

    const amountPattern = '(?:rs\\.?|inr|₹)?\\s*([0-9][0-9,]*(?:\\.\\d{1,2})?)';
    const fullNameAmount = new RegExp(`\\b${nameParts.join('\\s+')}\\b[\\s\\S]{0,120}?\\b(?:loan\\s*amount|loan\\s*amt|sanction\\s*amount|amount|amt)?\\b\\s*[:\\-]?\\s*${amountPattern}`, 'i');
    const fullMatch = compactText.match(fullNameAmount);
    if (fullMatch && fullMatch[1]) {
      return fullMatch[1];
    }

    const firstNameAmount = new RegExp(`\\b${nameParts[0]}\\b[\\s\\S]{0,120}?\\b(?:loan\\s*amount|loan\\s*amt|sanction\\s*amount|amount|amt)?\\b\\s*[:\\-]?\\s*${amountPattern}`, 'i');
    const firstMatch = compactText.match(firstNameAmount);
    if (firstMatch && firstMatch[1]) {
      return firstMatch[1];
    }

    return this.extractLoanAmountValue(compactText);
  }

  extractLoanAmountValue(text) {
    const compactText = compactSpaces(text);
    const contextual = compactText.match(
      /\b(?:loan\s*amount|loan\s*amt|sanction\s*amount|amount|amt)\b\s*[:\-]?\s*(?:rs\.?|inr|₹)?\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i
    );
    if (contextual && contextual[1]) {
      return contextual[1];
    }

    const currency = compactText.match(/\b(?:rs\.?|inr|₹)\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i);
    if (currency && currency[1]) {
      return currency[1];
    }

    const fallback = compactText.match(/\b\d{4,9}(?:\.\d{1,2})?\b/g) || [];
    const nonLikelyIds = fallback.find((token) => token.length >= 5 && token.length <= 9);
    return nonLikelyIds || '';
  }

  extractRequestedFieldValue(fieldKey, text, personName = '', fullText = '') {
    const sourceText = fullText || text;
    if (fieldKey === 'mobile') {
      return personName ? this.extractMobileValueForPerson(sourceText, personName) : this.extractMobileValue(text);
    }
    if (fieldKey === 'email') {
      return personName ? this.extractEmailValueForPerson(sourceText, personName) : '';
    }
    if (fieldKey === 'roll_no') {
      return personName ? this.extractRollNoForPerson(sourceText, personName) : '';
    }
    if (fieldKey === 'gr_no') {
      return personName ? this.extractGrNoForPerson(sourceText, personName) : '';
    }
    if (fieldKey === 'prn_no') {
      return personName ? this.extractGrNoForPerson(sourceText, personName) : '';
    }
    if (fieldKey === 'loan_amount') {
      return personName ? this.extractLoanAmountValueForPerson(sourceText, personName) : this.extractLoanAmountValue(text);
    }
    return '';
  }

  buildPersonFieldLookupAnswer(field, personName, value) {
    const displayName = toDisplayName(personName) || personName;
    if (field.key === 'mobile') {
      return `Mobile number of ${displayName} is ${value}.`;
    }
    if (field.key === 'loan_amount') {
      return `Loan amount of ${displayName} is ${value}.`;
    }
    if (field.key === 'email') {
      return `Email ID of ${displayName} is ${value}.`;
    }
    if (field.key === 'roll_no') {
      return `Roll number of ${displayName} is ${value}.`;
    }
    if (field.key === 'gr_no') {
      return `GR number of ${displayName} is ${value}.`;
    }
    if (field.key === 'prn_no') {
      return `PRN number of ${displayName} is ${value}.`;
    }
    return `${field.label} of ${displayName} is ${value}.`;
  }

  findPersonFieldLookupMatch(query, documents) {
    const field = this.getRequestedPersonField(query);
    if (!field) {
      return null;
    }

    const personName = this.extractPersonNameFromQuery(query);
    if (!personName) {
      return null;
    }

    const personTokens = tokenize(personName);
    if (personTokens.length === 0) {
      return null;
    }

    const scoredMatches = [];

    documents.forEach((doc) => {
      (doc.structuredData || []).forEach((chunk) => {
        const chunkText = String(chunk.text || '');
        const normalizedChunk = normalizeForMatch(chunkText);
        const hasName = personTokens.every((token) => normalizedChunk.includes(token));
        if (!hasName) {
          return;
        }

        const nearbyText = this.getWindowAroundName(chunkText, personName);
        const valueNearName = this.extractRequestedFieldValue(field.key, nearbyText, personName, chunkText);
        const valueFromChunk = valueNearName || this.extractRequestedFieldValue(field.key, chunkText, personName, chunkText);
        if (!valueFromChunk) {
          return;
        }

        const score = 2 + personTokens.length + (valueNearName ? 0.5 : 0);
        scoredMatches.push({
          field,
          personName,
          value: valueFromChunk,
          score,
          chunk,
          fileName: doc.fileName,
          originalName: doc.originalName || doc.fileName
        });
      });
    });

    scoredMatches.sort((a, b) => b.score - a.score);
    return scoredMatches[0] || null;
  }

  findExactRecordMatches(query, documents, topK = MAX_RECORD_MATCHES) {
    const retrievalQuery = buildRetrievalQuery(query);
    const normalizedQuery = normalizeQueryForRetrieval(query);
    const quotedTokens = getQuotedAndNumericTokens(retrievalQuery).map((token) => normalizeForMatch(token));
    const numericTokens = extractNumericTokens(retrievalQuery);
    const queryKeywords = tokenize(retrievalQuery).filter((token) => !TOKEN_STOPWORDS.has(token));
    const queryKeywordSet = new Set(queryKeywords);
    const queryRecordHints = RECORD_QUERY_HINTS.filter((hint) => containsHint(normalizedQuery, hint));

    const matches = [];

    documents.forEach((doc) => {
      (doc.structuredData || []).forEach((chunk) => {
        const chunkText = String(chunk.text || '');
        const normalizedChunk = normalizeForMatch(chunkText);
        const chunkTokens = tokenize(chunkText);

        const exactHits = quotedTokens.filter((token) => token && normalizedChunk.includes(token));
        const matchedNumeric = numericTokens.filter((token) => normalizedChunk.includes(token));
        const keywordOverlap = chunkTokens.reduce(
          (count, token) => (queryKeywordSet.has(token) ? count + 1 : count),
          0
        );
        const lexicalScore = queryKeywordSet.size > 0 ? (keywordOverlap / queryKeywordSet.size) : 0;

        const hintHits = queryRecordHints.filter((hint) => containsHint(normalizedChunk, hint));
        const looksLikeRecordLine =
          /\b(roll|account|loan|id|a\/c|ifsc|pan|aadhaar)\b[\s._-]*(no|number|#|:)?/i.test(chunkText);

        let score = 0;
        score += exactHits.length * 0.9;
        score += matchedNumeric.length * 1.1;
        score += lexicalScore;
        score += hintHits.length * RECORD_MATCH_FIELD_BOOST;
        if (looksLikeRecordLine) {
          score += 0.45;
        }

        const hasStrongSignal =
          matchedNumeric.length > 0 ||
          exactHits.length > 0 ||
          hintHits.length > 0 ||
          (looksLikeRecordLine && lexicalScore >= 0.25);

        if (hasStrongSignal && score >= MIN_RECORD_SCORE) {
          matches.push({
            ...chunk,
            score,
            matchType: 'record_lookup',
            matchedNumeric,
            matchedKeywords: hintHits,
            fileName: doc.fileName,
            originalName: doc.originalName || doc.fileName,
            startLine: chunk.startLine,
            endLine: chunk.endLine
          });
        }
      });
    });

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, topK);
  }

  buildRecordLookupAnswer(query, matches) {
    const lines = [
      `Found ${matches.length} matching record${matches.length === 1 ? '' : 's'} for: "${query}".`
    ];

    matches.slice(0, 5).forEach((match, index) => {
      const location = [
        `page ${match.page}`,
        `para ${match.paragraph}`,
        (match.startLine && match.endLine)
          ? `line ${match.startLine}${match.endLine !== match.startLine ? `-${match.endLine}` : ''}`
          : null
      ].filter(Boolean).join(', ');
      lines.push(`${index + 1}. ${match.originalName} (${location}) -> ${String(match.text || '').slice(0, 180)}`);
    });

    return lines.join('\n');
  }

  async generateAnswerWithCitations(query, retrievedChunks) {
    const context = retrievedChunks
      .map(
        (chunk) =>
          `[${chunk.chunkId}] [${chunk.originalName} - Page ${chunk.page}, Para ${chunk.paragraph}, Lines ${chunk.startLine || '-'}-${chunk.endLine || '-'}] ${chunk.text}`
      )
      .join('\n\n');

    const prompt = [
      'You are a multilingual document QA assistant.',
      'Answer ONLY using the given context chunks.',
      'Use the same language as the question unless the user asks another language.',
      'If answer is not in context, reply with: "I could not find this in the uploaded documents."',
      'Return STRICT JSON only with this schema:',
      '{"answer":"string","citations":["chunkId1","chunkId2"]}',
      '',
      `Question: ${query}`,
      '',
      `Context chunks:\n${context}`
    ].join('\n');

    const provider = this.answerProvider;
    let rawText = '';

    if (provider === 'gemini') {
      this.requireGeminiApiKey();
      const response = await axios.post(
        this.getGeminiGenerateUrl(),
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        },
        {
          params: { key: this.geminiApiKey },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      rawText = response.data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('') || '';
    } else {
      const response = await axios.post(
        this.localAnswerUrl,
        {
          model: this.localAnswerModel,
          prompt,
          stream: false,
          format: 'json'
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      rawText = response.data?.response || '';
    }

    return this.parseJSONSafely(rawText) || {
      answer: rawText || 'No answer generated.',
      citations: []
    };
  }

  async healthCheck() {
    const embeddingProvider = this.embeddingProvider;
    const answerProvider = this.answerProvider;
    const status = {
      embeddingProvider,
      answerProvider,
      embeddingApi: embeddingProvider === 'gemini'
        ? { ok: false, provider: 'gemini', model: this.geminiEmbeddingModel }
        : { ok: false, provider: 'local', url: this.localEmbeddingUrl },
      answerApi: answerProvider === 'gemini'
        ? { ok: false, provider: 'gemini', model: this.geminiAnswerModel }
        : { ok: false, provider: 'local', url: this.localAnswerUrl, model: this.localAnswerModel }
    };

    try {
      let vectors = [];
      if (embeddingProvider === 'gemini') {
        this.requireGeminiApiKey();
        vectors = await this.embedTextsWithGemini(['health check']);
      } else {
        const embedResponse = await axios.post(
          this.localEmbeddingUrl,
          { texts: ['health check'] },
          { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
        );
        vectors = this.normalizeLocalEmbeddings(embedResponse.data);
      }
      status.embeddingApi.ok = Array.isArray(vectors) && vectors.length === 1 && Array.isArray(vectors[0]) && vectors[0].length > 0;
    } catch (error) {
      status.embeddingApi.error = this.formatAxiosError(error);
    }

    try {
      if (answerProvider === 'gemini') {
        this.requireGeminiApiKey();
        const answerResponse = await axios.post(
          this.getGeminiGenerateUrl(),
          {
            contents: [{ role: 'user', parts: [{ text: 'Return {"answer":"ok","citations":[]} in JSON.' }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0 }
          },
          {
            params: { key: this.geminiApiKey },
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
          }
        );
        const raw = answerResponse.data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('') || '';
        status.answerApi.ok = Boolean(raw);
      } else {
        const answerResponse = await axios.post(
          this.localAnswerUrl,
          {
            model: this.localAnswerModel,
            prompt: 'Return {"answer":"ok","citations":[]} in JSON.',
            stream: false,
            format: 'json'
          },
          { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        );
        status.answerApi.ok = Boolean(answerResponse.data?.response);
      }
    } catch (error) {
      status.answerApi.error = this.formatAxiosError(error);
    }

    status.ok = status.embeddingApi.ok && status.answerApi.ok;
    return status;
  }

  async searchDocuments(query, documents) {
    try {
      const orderedDocuments = this.sortDocumentsByUploadOrder(documents);
      const isSubjectQuery = this.isSubjectNameQuery(query);

      if (isSubjectQuery) {
        for (const doc of orderedDocuments) {
          const subject = this.extractSubjectNameFromChunks(doc.structuredData || []);
          if (!subject) {
            continue;
          }

          const subjectLabel = subject.subjectCode
            ? `${subject.subjectName} (${subject.subjectCode})`
            : subject.subjectName;

          return {
            answer: `The subject name is ${subjectLabel}.`,
            sources: [{
              chunkId: subject.chunk.chunkId,
              fileName: doc.fileName,
              originalName: doc.originalName || doc.fileName,
              page: subject.chunk.page,
              paragraph: subject.chunk.paragraph,
              startLine: subject.chunk.startLine,
              endLine: subject.chunk.endLine,
              text: subject.chunk.text,
              score: 1.9,
              matchType: 'subject_lookup'
            }],
            retrievedCount: 1,
            matchStrategy: 'subject_lookup',
            matchedDocument: doc.originalName || doc.fileName
          };
        }
      }

      const isRecordQuery = this.isRecordLookupQuery(query);
      if (isRecordQuery) {
        const specificRecord = this.findPersonFieldLookupMatch(query, orderedDocuments);
        if (specificRecord) {
          const sourceChunk = specificRecord.chunk;
          return {
            answer: this.buildPersonFieldLookupAnswer(
              specificRecord.field,
              specificRecord.personName,
              specificRecord.value
            ),
            sources: [{
              chunkId: sourceChunk.chunkId,
              fileName: specificRecord.fileName,
              originalName: specificRecord.originalName,
              page: sourceChunk.page,
              paragraph: sourceChunk.paragraph,
              startLine: sourceChunk.startLine,
              endLine: sourceChunk.endLine,
              text: sourceChunk.text,
              score: specificRecord.score,
              matchType: 'person_field_lookup'
            }],
            retrievedCount: 1,
            matchStrategy: 'person_field_lookup',
            matchedDocument: specificRecord.originalName || specificRecord.fileName
          };
        }

        const recordMatches = this.findExactRecordMatches(query, orderedDocuments);
        if (recordMatches.length > 0) {
          const topMatch = recordMatches[0];
          return {
            answer: this.buildRecordLookupAnswer(query, recordMatches),
            sources: recordMatches.map((chunk) => ({
              chunkId: chunk.chunkId,
              fileName: chunk.fileName,
              originalName: chunk.originalName,
              page: chunk.page,
              paragraph: chunk.paragraph,
              startLine: chunk.startLine,
              endLine: chunk.endLine,
              text: chunk.text,
              score: chunk.score,
              matchType: chunk.matchType
            })),
            retrievedCount: recordMatches.length,
            matchStrategy: 'record_lookup',
            matchedDocument: topMatch.originalName || topMatch.fileName
          };
        }
      }

      const retrievedChunks = await this.retrieveRelevantChunks(query, orderedDocuments);

      if (retrievedChunks.length > 0) {
        const modelOutput = await this.generateAnswerWithCitations(query, retrievedChunks);
        const answer = modelOutput.answer || 'No answer generated.';

        if (!this.isNoAnswerResponse(answer)) {
          const citations = Array.isArray(modelOutput.citations) ? modelOutput.citations : [];
          const chunkById = new Map(retrievedChunks.map((chunk) => [chunk.chunkId, chunk]));

          const sources = citations
            .map((chunkId) => chunkById.get(chunkId))
            .filter(Boolean)
            .map((chunk) => ({
              chunkId: chunk.chunkId,
              fileName: chunk.fileName,
              originalName: chunk.originalName,
              page: chunk.page,
              paragraph: chunk.paragraph,
              startLine: chunk.startLine,
              endLine: chunk.endLine,
              text: chunk.text,
              score: chunk.score,
              matchType: chunk.matchType
            }));

          const fallbackSources = sources.length > 0
            ? sources
            : retrievedChunks.slice(0, 3).map((chunk) => ({
                chunkId: chunk.chunkId,
                fileName: chunk.fileName,
                originalName: chunk.originalName,
                page: chunk.page,
                paragraph: chunk.paragraph,
                startLine: chunk.startLine,
                endLine: chunk.endLine,
                text: chunk.text,
                score: chunk.score,
                matchType: chunk.matchType
              }));

          const topSource = fallbackSources[0];
          return {
            answer,
            sources: fallbackSources,
            retrievedCount: retrievedChunks.length,
            matchedDocument: topSource ? (topSource.originalName || topSource.fileName) : undefined
          };
        }
      }

      return {
        answer: 'I could not find relevant content in the uploaded documents.',
        sources: [],
        retrievedCount: 0
      };
    } catch (error) {
      const detailedError = this.formatAxiosError(error);
      console.error('AI Service Error:', error.response?.data || error.message);
      throw new Error(detailedError);
    }
  }
}

module.exports = new AIService();
