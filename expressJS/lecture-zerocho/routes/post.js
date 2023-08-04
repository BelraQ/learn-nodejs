const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { afterUploadImage, uploadPost } = require('../controllers/post');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch(error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({ //디스크 저장
        destination(req, file, cb) {
            cb(null, 'uploads/'); //경로: uploads/ 폴더
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); // 이미지.png => 이미지1323.png / 확장자 받아오기
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024}, //5MB
});
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage); //main.html의 formdata.append('img')와 문자가 같아야 함

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;