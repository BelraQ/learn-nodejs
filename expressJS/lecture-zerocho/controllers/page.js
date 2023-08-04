const { Post, User, Hashtag }= require('../models');

exports.renderProfile = (req, res, next) => {
    // 컨트롤러: 서비스를 호출
    res.render('profile', { title: '내 정보 - NodeBird'});
};
exports.renderJoin = (req, res, next) => {
    res.render('join', {title: '회원 가입 - NodeBird'});
};
exports.renderMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'], //프론트에 password 보내면 안됨
            },
            order: [['createdAt', 'DESC']]
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch(error) {
        console.error(error);
        next(error);
    }
};

//라우터 -> 컨트롤러(안다) -> 서비스(요청, 응답 모름)

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query }});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({
                include: [{model: User, attributes: ['id', 'nick']}],
                order: [['createdAt', 'DESC']]
            }); //hashtag와 post와 관계를 맺어놨기 때문에, hashtag에 속한 post를 불러올 수 있음
        }  
        res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch(error) {
        console.error(error);
        next(error);
    }
}