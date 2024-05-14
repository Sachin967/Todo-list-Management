import multer from 'multer'

const storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, 'uploads') // specify the destination folder for uploaded files
     },
     filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname) // customize the file name if needed
     },
})

const fileFilter = function (req, file, cb) {
     // Accept only CSV files
     if (file.originalname.endsWith('.csv')) {
          cb(null, true) // Accept the file
     } else {
          cb(new Error('Only CSV files are allowed'), false) // Reject the file
     }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

export default upload
