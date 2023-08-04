const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); 

const indexRouter = require('./routes');

const app = express();

app.set('port', process.env.PORT || 8006);
app.set('view engine', 'html'); 
nunjucks.configure('views', { 
    express: app,
    watch: true,
});

app.use(morgan('dev'));

app.use('/', indexRouter);

app.use((req, res, next) => {// 404 NOT FOUND 
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});