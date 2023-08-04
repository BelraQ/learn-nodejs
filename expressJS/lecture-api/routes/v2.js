const express = require('express');
const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v2');

const router = express.Router();

router.use(corsWhenDomainMatches); //미들웨어로 만들었음

// router.use((req, res, next) => { //cors 직접 해결하기(하지만 환경에 따라 작업이 달라서.. 모듈을 쓰자)
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
//     res.setHeader('Access-Control-Allow-Headers', 'content-type');
//     next();
// })

// /v1/token
router.post('/token', apiLimiter, createToken); //req.body.clientSecret(프론트에 req.body에 전달해 달라고 함)
router.get('/test', verifyToken, apiLimiter, tokenTest);

router.get('/posts/my', verifyToken, apiLimiter, getMyPosts);
router.get('/posts/hashtag/:title', verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;