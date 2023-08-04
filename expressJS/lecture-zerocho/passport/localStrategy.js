const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
// const localStrategy = require('passport-local').Strategy;
const { Strategy: localStrategy } = require('passport-local');

//localStrategy 이메일 로그인했을 때 어떻게 할 지
module.exports = () => {
    passport.use(new localStrategy({ //passport에 localStrategy 등록하기
        usernameField: 'email', // req.body.email /일치하는 로그인 라우터의 req.body 속성명
        passwordField: 'password', //req.body.password
        passReqToCallback: false, // 아래 함수에 req 인수 추가 여부
    }, async (email, password, done) => { //done(서버실패, 성공유저, 로직실패): passport.authenticate()의 콜백 함수
        try {
            const exUser = await User.findOne({ where: { email }});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) { //일치한다면
                    done(null, exUser);
                } else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            }   else {
                    done(null, false, { message: '가입되지 않은 회원입니다.'});
                }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};