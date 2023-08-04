//로그인 상태 판단하는 미들웨어
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // 패스포트 통해서 로그인을 했는가/로그인 중이면 true
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}; 

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`); //localhost:8001?error=메시지
    }
}