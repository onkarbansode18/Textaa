
const pdfService = require('../services/pdfService');

exports.uploadPDF = async (req, res) => {
  try {
    let relativePaths = [];
    try {
      const raw = req.body?.relativePaths;
      relativePaths = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
    } catch (_) {
      relativePaths = [];
    }

    const files = Array.isArray(req.files) && req.files.length > 0
      ? req.files
      : (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];

    for (const file of files) {
      try {
        const enrichedFile = {
          ...file,
          relativePath: relativePaths[results.length] || file.originalname
        };
        const result = await pdfService.processPDF(enrichedFile);
        results.push({
          success: true,
          ...result
        });
      } catch (error) {
        results.push({
          success: false,
          fileName: file.originalname,
          error: error.message
        });
      }
    }

    const successCount = results.filter((item) => item.success).length;
    const failedCount = results.length - successCount;

    if (results.length === 1) {
      const only = results[0];
      if (!only.success) {
        return res.status(500).json({ error: only.error || 'Upload failed' });
      }
      return res.json(only);
    }

    return res.status(failedCount === results.length ? 500 : 200).json({
      success: failedCount === 0,
      successCount,
      failedCount,
      message: `Processed ${results.length} file(s): ${successCount} success, ${failedCount} failed.`,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await pdfService.getAllDocuments();
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { fileName } = req.params;
    const deleted = await pdfService.deleteDocument(fileName);
    
    if (deleted) {
      res.json({ success: true, message: 'Document deleted successfully' });
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
