const { Hashtag, Post } = require('../models');

exports.afterUploadImage = (req, res) => {
    console.log(req.file); //객체 확인
    res.json({ url: `/img/${req.file.filename}`}); // == main.html의 res.data.url
};

exports.uploadPost = async (req, res, next) => {
    //req.body.content, req.body.url
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g); //#으로 시작하고 공백 또는 #이 없는 나머지(반복)
        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => { //hashtags 배열(promise로 전부 받음)
                return Hashtag.findOrCreate({ //해시태그 값으로 findOrcreate 값 등록
                    where: { title: tag.slice(1).toLowerCase() } // #빼고 소문자로(해시태그 값)  
                })
            })); // => result = [[model, bool], [model, bool], [model, bool]...]
            console.log('result', result);
            await post.addHashtags(result.map(r => r[0])); // 다대다 관계 형성/[model, bool]에서 모델 추출
        }
        res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
};