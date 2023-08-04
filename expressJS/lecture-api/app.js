const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const { sequelize } = require('./models'); //index.js의 db 연결 객체 불러오기(index만으론 안됨)
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
dotenv.config(); //process.env

const authRouter = require('./routes/auth');
const indexRouter = require('./routes');
const v1Router = require('./routes/v1');
const v2Router = require('./routes/v2');

const passportConig = require('./passport');



const app = express(); //express 불러오기
passportConig();
app.set('port', process.env.PORT || 8002);
app.set('view engine', 'html'); //error.html을 nunjucks가 
nunjucks.configure('views', { //views 폴더에서 찾아서 응답으로 보내준다
    express: app,
    watch: true,
});

sequelize.sync() //db 연결하기 //개발 시에는 sync()에 {force: true}로 서버 실행 시 테이블 삭제&재생성 가능.
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public'))); //프론트 연결 폴더 *개발자 폴더와 유저 생성 폴더 분리하기
app.use(express.json()); // ajax, json 요청을 req.body에 담음
app.use(express.urlencoded({extended: false})); //form 요청을 req.body에 담음 (멀티파트 데이터 제외)
app.use(cookieParser(process.env.COOKIE_SECRET)); //받아온 쿠키, 세션을 객체로 변환
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
//passport의 미들웨어는 반드시 express.session 미들웨어 아래에 넣어야 한다
app.use(passport.initialize()); //req.user, req.login, req.isAuthenticate, req.logout 
app.use(passport.session()); //connect.sid 라는 이름으로 세션 쿠기가 브라우저에 전송
//passport.session()이 deserializeUser 실행

app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/v1', v1Router);
app.use('/v2', v2Router);

app.use((req, res, next) => {// 404 NOT FOUND 
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; //에러 로그를 서비스한테 옮겨요
    res.status(err.status || 500);
    res.render('error');
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
});