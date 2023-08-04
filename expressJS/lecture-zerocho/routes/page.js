const express = require('express');
const router = express.Router();
const {renderProfile, renderJoin, renderMain, renderHashtag } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
router.use((req, res, next) => { //res.locals : 미들웨어 간 공유되는 데이터
    res.locals.user = req.user;
    //await User.findOne... 해서 넣어도 됨(req.user가 너무 커져도 좋지 않음)
    res.locals.followerCount = req.user?.Followers?.length || 0; //에러 내지 않게 옵셔널 체이닝으로
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/hashtag', renderHashtag); //ex. hashtag?hashtag=고양이

module.exports = router;