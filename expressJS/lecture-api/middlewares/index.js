// /middlewares: 여러 router에서 공통적으로 쓰이는 미들웨어들(?)
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const {User, Domain} = require('../models');
const cors = require('cors');

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

exports.verifyToken = (req, res, next) => {
    try {
        res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // 다른 곳에서 req.headers.authorization에 토큰을 주라고 요청할 예정
        //검사가 끝난 내용물을 decoded에 넣음
        // *env(jwtSecret)가 발급도 하고 검사도 하기 때문에 털리면 다 털렸음
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                    code: 419, //프론트와 코드 합의
                    message: '토큰이 만료되었습니다',
            });
        }
        return res.status(401).json({
            code: 401, //코드는 마음대로 정해도 됨.
            message: '유효하지 않은 토큰입니다.',
        })
    }
};

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: (req, res) => {
        return req.user?.Domains[1]?.type === 'premium' ? 10 : 5;
    },
    handler(req, res) { //제한 초과 시 콜백 함수
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: `1분에 ${req.user?.Domains[1]?.type === 'premium' ? '열' : '다섯'} 번만 요청할 수 있습니다.`,
        });
    }, 
});

exports.apiLimiter = async (req, res, next) => {
    let user; //값 재할당이 가능한 let을 사용 
    console.log('locals.decoded: ', res.locals.decoded);
    if (res.locals.decoded) {
        user = await User.findOne({
            where: {id: res.locals.decoded.id}, 
            include: {model: Domain},
        });
    }
    console.log('user 타입은 ', user?.Domains[1]?.type); //domain
    //console.log('req.user 객체 확인: ', req?.user);
    // rateLimit({ //그냥 무제한 허용하고 있음(버그)
    //     windowMs: 60 * 1000, //기준 시간
    //     max: domain?.type === 'premium' ? 1000 : 1, //허용 횟수
    //     handler(req, res) { //제한 초과 시 콜백 함수
    //         res.status(this.statusCode).json({
    //             code: this.statusCode,
    //             message: '1분에 열 번만 요청할 수 있습니다.',
    //         });
    //     }
    // })(req, res, next);
    req.user = user;
    limiter(req, res, next);
    console.log('리미터 확인: ', req.rateLimit);
}

exports.deprecated = (req, res) => { //사용하면 안되는 라우터에 붙여서 경고
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    })
}

exports.corsWhenDomainMatches = async (req, res, next) => {
    const domain = await Domain.findOne({
        where: {host: new URL(req.get('origin')).host}, //http 없는 도메인 주소
    });
    if (domain) {
        cors({ //사용자에 따라 다르게 해야 할 땐 미들웨어 확장 패턴.
            origin: req.get('origin'), //true거나 '*'이면 모든 요청 허용, 하지만 '*'를 쓰면 credentials 속성 안됨. 도메인 주소 넣기
            credentials: true, //쿠키 요청 허용
        })(req, res, next);
    } else {
        next();
    }
}