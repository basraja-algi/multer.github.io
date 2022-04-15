const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const app = express();

// set storage engine 
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// upload 
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).single('myimage');

// check file type 
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    // check extension 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime 
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        console.log(req.file);
        res.send('test');
    }
}

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: "Error: No File Selected"
                });
            } else {
                res.render('index', {
                    msg: "File Uploaded!",
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

app.get('/', (req, res) => res.render('index'));

app.listen(7000, () => {
    console.log(`server at port 7000`);
});
