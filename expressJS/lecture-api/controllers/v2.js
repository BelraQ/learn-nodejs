const { Domain, User, Post, Hashtag } = require('../models');
const jwt = require('jsonwebtoken');

exports.createToken = async (req, res) => {
    const { clientSecret } = req.body;
    //console.log('비밀키: ', clientSecret);
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
            }],
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.'
            });
        }
        const token = jwt.sign({ //token 내용 넣기
            id: domain.User.id, //내용물(id, nick)
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, { //비밀 키 등록
            expiresIn: '30m', //유효기간
            issuer: 'nodebird', //발급자
        });
        return res.json({
            code: 200,
            message: '토큰 발급되었습니다.',
            token,
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
}

exports.tokenTest = (req, res) => {
    console.log("토큰 내용: ", res.locals.decoded);
    res.json(res.locals.decoded); //프론트로 내용물 보내기
}

exports.getMyPosts = (req, res) => {
    Post.findAll({ where: { userId: res.locals.decoded.id }})
        .then((posts) => {
            res.json({
                code: 200,
                payload: posts,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        })    
}

exports.getPostsByHashtag = async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({where: { title: req.params.title}});
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            })
        }
        const posts = await hashtag.getPosts();
        if (posts.length === 0) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            })
        }
        return res.json({
            code: 200,
            payload: posts,
        })
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        })
    }
}