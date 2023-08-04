const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => { //req.login(user) 로 이동됨
    passport.serializeUser((user, done) => { //user === exUser  
        done(null, user.id); //user id만 추출(user보단 낫지만 메모리 저장에서 아직 위험함
    });

    passport.deserializeUser((id, done) => { //id로 유저 복원
        User.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                }, //팔로잉
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                }, //팔로워
            ]
        })
        .then((user) => done(null, user)) // req.user, req.session 생성 (정확히는 connect.sid 쿠키로 세션에서 찾을 때 req.session이 생성됩니다.)
        .catch(err => done(err));   
    });

    local(); //호출
    kakao();
};