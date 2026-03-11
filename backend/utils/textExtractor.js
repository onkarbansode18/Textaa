const fs = require('fs');
const pdf = require('pdf-parse');

const MAX_PARAGRAPH_CHARS = 900;
const PDF_PARSE_TIMEOUT_MS = Number(process.env.PDF_PARSE_TIMEOUT_MS || 120000);
const PDF_MAX_PAGES = Number(process.env.PDF_MAX_PAGES || 250);

function withTimeout(promise, timeoutMs, timeoutMessage) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return promise;
  }

  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    })
  ]);
}

function splitParagraphsWithLineNumbers(pageText) {
  const normalized = pageText
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!normalized) {
    return [];
  }

  const indexedLines = normalized
    .split('\n')
    .map((line, index) => ({
      lineNumber: index + 1,
      text: line.replace(/[ \t]+/g, ' ').trim()
    }))
    .filter((line) => Boolean(line.text));

  if (indexedLines.length === 0) {
    return [];
  }

  const grouped = [];
  let currentText = '';
  let currentStartLine = indexedLines[0].lineNumber;
  let currentEndLine = indexedLines[0].lineNumber;

  indexedLines.forEach((line) => {
    const projected = `${currentText} ${line.text}`.trim();
    const shouldSplit =
      Boolean(currentText) &&
      (
        projected.length > MAX_PARAGRAPH_CHARS ||
        (/[.!?]$/.test(currentText) && currentText.length >= 220)
      );

    if (shouldSplit) {
      grouped.push({
        text: currentText.trim(),
        startLine: currentStartLine,
        endLine: currentEndLine
      });
      currentText = line.text;
      currentStartLine = line.lineNumber;
      currentEndLine = line.lineNumber;
      return;
    }

    currentText = projected;
    currentEndLine = line.lineNumber;
  });

  if (currentText.trim()) {
    grouped.push({
      text: currentText.trim(),
      startLine: currentStartLine,
      endLine: currentEndLine
    });
  }

  const sizedParagraphs = [];

  grouped.forEach((paragraph) => {
    if (paragraph.text.length <= MAX_PARAGRAPH_CHARS) {
      sizedParagraphs.push(paragraph);
      return;
    }

    const sentences = paragraph.text.split(/(?<=[.!?])\s+/);
    let current = '';

    sentences.forEach((sentence) => {
      const projected = `${current} ${sentence}`.trim();
      if (projected.length > MAX_PARAGRAPH_CHARS && current.trim()) {
        sizedParagraphs.push({
          text: current.trim(),
          startLine: paragraph.startLine,
          endLine: paragraph.endLine
        });
        current = sentence;
      } else {
        current = projected;
      }
    });

    if (current.trim()) {
      sizedParagraphs.push({
        text: current.trim(),
        startLine: paragraph.startLine,
        endLine: paragraph.endLine
      });
    }
  });

  return sizedParagraphs;
}

const extractTextWithPageNumbers = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pages = [];
    let currentPage = 0;

    const data = await withTimeout(
      pdf(dataBuffer, {
        max: PDF_MAX_PAGES > 0 ? PDF_MAX_PAGES : 0,
        pagerender: async (pageData) => {
          currentPage += 1;
          const textContent = await pageData.getTextContent({
            normalizeWhitespace: true,
            disableCombineTextItems: false
          });

          let pageText = '';
          let lastY;

          for (const item of textContent.items) {
            const y = item.transform[5];
            if (lastY === undefined || Math.abs(lastY - y) < 1.5) {
              pageText += `${item.str} `;
            } else {
              pageText += `\n${item.str} `;
            }
            lastY = y;
          }

          const cleanPageText = pageText.replace(/[ \t]+/g, ' ').trim();
          pages.push({ page: currentPage, text: cleanPageText });

          return cleanPageText;
        }
      }),
      PDF_PARSE_TIMEOUT_MS,
      `PDF text extraction timed out after ${Math.round(PDF_PARSE_TIMEOUT_MS / 1000)}s.`
    );

    const structuredData = [];

    pages.forEach((pageData) => {
      const paragraphs = splitParagraphsWithLineNumbers(pageData.text);
      paragraphs.forEach((paragraph, index) => {
        structuredData.push({
          page: pageData.page,
          paragraph: index + 1,
          startLine: paragraph.startLine,
          endLine: paragraph.endLine,
          text: paragraph.text
        });
      });
    });

    return {
      fullText: data.text || '',
      // Some PDFs report incorrect huge numpages metadata; use parsed pages count.
      numPages: pages.length,
      pages,
      structuredData
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

module.exports = {
  extractTextWithPageNumbers
};
