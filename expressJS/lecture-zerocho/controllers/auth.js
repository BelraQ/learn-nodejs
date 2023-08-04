const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.join = async (req, res, next) => {
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({where: {email}});
        if (exUser) {
            return res.redirect('/join?error=exist'); //유저가 이미 있다면 => join.html
        }
        const hash = await bcrypt.hash(password, 12); //bcrypt로 암호화
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
}
//POST /auth/login
exports.login = (req, res, next) => { //Strategy의 done이 호출되는 순간  (authError, user, info)로 간다
    //'local': passport에 등록되어 있는 localStrategy 실행
    passport.authenticate('local', (authError, user, info) => { 
        if (authError) { //서버실패
            console.error(authError);
            return next(authError);
        }
        if (!user) { //로직실패
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => { //로그인 성공/ req.login(user) 메서드로 serialUser 이동
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); //미들웨어 확장 패턴
};

exports.logout = (req, res, next) => { //세션 없애기
    req.logout(() => {
        res.redirect('/');
    });
};