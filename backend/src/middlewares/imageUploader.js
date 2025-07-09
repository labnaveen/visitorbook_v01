const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = req.query.folderName;
        console.log("Folder Name", folderName);
        // Define the upload path dynamicallyconst
        const uploadPath = path.join(__dirname, "../../uploads", folderName);
        // const uploadPath = path.join(__dirname, "../../public/company_images");

        // Create the folder if it doesn't exist
        const isFolderCreated = fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + path.extname(file.originalname));
    },
});
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = req.query.folderName;
        console.log("Folder Name", folderName);
        // Define the upload path dynamicallyconst
        const uploadPath = path.join(__dirname, "../../public", folderName);
        // Create the folder if it doesn't exist
        const isFolderCreated = fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + path.extname(file.originalname));
    },
});
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {

//         cb(null, 'uploads/companies_logo')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '_' + path.extname(file.originalname))
//     },
// });
const imageFilter = (req, file, cb) => {
    // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    cb(null, true);
    // } else {
    //     cb(null, false);
    //     cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
    // }
};

const fileFilter = (req, file, cb) => {
    // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    cb(null, true);
    // } else {
    //     cb(null, false);
    //     cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
    // }
};
const uploadImage = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadFile = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 7 * 1024 * 1024 }, // 7 MB
});

module.exports = {
    uploadImage,
    uploadFile,
};
