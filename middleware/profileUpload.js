const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "profiles");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const profileUpload = multer({ storage: storage });

  module.exports=profileUpload