const multer = require('multer')
const path = require('path')
const fs = require('fs')

module.exports.uploadFiles = (fields, destination, maxFileSize = 10000000, allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heif', 'application/pdf']) => {
    try {
        fs.promises.access(destination, fs.constants.F_OK)
        if (!fs.constants.F_OK) {
            fs.promises.mkdir(destination, { recursive: true })
        }
        return multer({
            storage: multer.diskStorage({
                destination: destination,
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
                },
            }),
            limits: {
                fileSize: maxFileSize,
            },
            fileFilter: (req, file, cb) => {
                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true)
                } else {
                    cb(new Error('Invalid file type'))
                }
            },
        }).fields(fields)
    } catch (error) {
        console.log('error', error)

        return error.message
    }
}

module.exports.uploadMultipleFiles = (destination, maxFileSize = 9000000000, allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heif', 'image/webp', 'application/pdf']) => {
    try {
        fs.promises.access(destination, fs.constants.F_OK)
        if (!fs.constants.F_OK) {
            fs.promises.mkdir(destination, { recursive: true })
        }

        return multer({
            storage: multer.diskStorage({
                destination: destination,
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
                },
            }),
            limits: {
                fileSize: maxFileSize,
            },
            fileFilter: (req, file, cb) => {
                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true)
                } else {
                    cb(new Error('Invalid file type'))
                    // return "Invalid file type"
                }
            },
        }).any() // Use .any() to handle multiple files without specifying field names
    } catch (error) {
        return error.message
    }
}