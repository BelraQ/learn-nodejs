const express = require('express');
const { verifyToken, deprecated } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1');

const router = express.Router();

router.use(deprecated);

// /v1/token
router.post('/token', createToken); //req.body.clientSecret(프론트에 req.body에 전달해 달라고 함)
router.get('/test', verifyToken, tokenTest);

router.get('/posts/my', verifyToken, getMyPosts);
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;