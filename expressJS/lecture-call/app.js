const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
dotenv.config(); //process.env

const indexRouter = require('./routes');

const app = express(); //express 불러오기


app.set('port', process.env.PORT || 4000);
app.set('view engine', 'html'); //error.html을 nunjucks가 
nunjucks.configure('views', { //views 폴더에서 찾아서 응답으로 보내준다
    express: app,
    watch: true,
});

app.use(morgan('dev'));
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

app.use('/', indexRouter);

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