const multer = require("multer");

const excelFilter = (req, file, cb) => {
    if (
        file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml")
    ) {
    cb(null, true);
    } else {
        cb("Please upload only excel file.", false);
    }
};


// Start -->  If want to store in folder structure then this code will use otherwise comment

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         console.log(file.originalname);
//         cb(null, `${Date.now()}-students-${file.originalname}`);
//     },
// });

// End 

var uploadFile = multer({ storage: multer.memoryStorage(), fileFilter: excelFilter });
module.exports = uploadFile;