const passport = require('passport');
const { Strategy: KakaoStrategy } = require('passport-kakao');
const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => { //accessToken으로 api 요청 보내기..? connect.sid도 토큰
        console.log('profile', profile);
        try {
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'kakao'}
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,
                    nick: profile.dsplayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};