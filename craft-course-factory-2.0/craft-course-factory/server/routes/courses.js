const express = require('express')
const multer = require('multer')
const path = require('path')
const mammoth = require('mammoth')
const { verifyToken, checkRole } = require('../middleware/auth')

const router = express.Router()

// Multer Disk Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

const upload = multer({ storage })

// Upload and Parse Document (.docx)
router.post(
  '/upload',
  verifyToken,
  checkRole(['Super Admin', 'Admin', 'Developer']),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      let parsedContent = ''
      
      // Parse Word document to HTML using Mammoth if file is .docx
      if (
        req.file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.convertToHtml({ path: req.file.path })
        parsedContent = result.value
      }

      res.status(200).json({
        message: 'File uploaded and processed successfully',
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          path: `/uploads/${req.file.filename}`,
          size: req.file.size
        },
        parsedContent
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to process file',
        error: error.message
      })
    }
  }
)

module.exports = router
