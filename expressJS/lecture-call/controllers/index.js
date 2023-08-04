const axios = require('axios');

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;
//문자열은 .env로 몰아서 관리하는 게 편리. 찾아서 수정하기 번거로움.

const request = async (req, api) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET,
            }) 
            req.session.jwt = tokenResult.data.token;
        }
        return await axios.get(`${URL}${api}`, {
            headers: {authorization: req.session.jwt},
        });
    } catch(error) {
        if (error.response?.status === 419) { //419를 토큰 만료 에러로 합의
            delete req.session.jwt; //해결하고 싶은 건 해결하고 위조되거나 서버 문제는 에러로 처리  
            return request(req, api);
        }
        return error.response; //throw해서 catch로 에러 잡기
    }
}

exports.getMyPosts = async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch(error) {
        console.log(error);
        next(error);
    }
}

exports.searchByHashtag = async (req, res, next) => {
    try {
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        //브라우저 문제가 있으면 encodeURIComponent로
        res.json(result.data);
    } catch(error) {
        console.log(error);
        next(error);
    }
}

exports.renderMain = (req, res) => {
    res.render('main', {key: process.env.CLIENT_SECRET});
}

//headers.origin을 보고 어떤 도메인에서 왔는지 판단함.(headers.common.origin을 넣어야 할 수도) 


// exports.test = async (req, res, next) => {
//     try {
//         if (!req.session.jwt) {
//             const tokenResult = await axios.post('http://localhost:8002/v1/token', {
//                 clientSecret: process.env.CLIENT_SECRET, 
//             });
//             if (tokenResult.data?.code === 200) {
//                 req.session.jwt = tokenResult.data.token; //session에 토큰 넣어 사용량 줄이기
//             } else {
//                 return res.status(tokenResult.data?.code).json(tokenResult.data);
//             }
//         }
//         const result = await axios.get('http://localhost:8002/v1/test', {
//             headers: { authorization: req.session.jwt },
//         });
//         console.log('반환.json 값', result.data);
//         return res.json(result.data);
//     } catch(error) {
//         console.error(error);
//         if (error.response?.status === 419) { //정의한 토큰 에러
//             return res.json(error.response.data);
//         }
//         return next(error);
//     }
// }