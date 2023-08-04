const User = require('../models/user');
//핵심적인 비즈니스 로직을 서비스로 분리 - req, res, next같은 요청 없이
exports.follow = async (userId, followingId) => {
    const user = await User.findOne({where: {id: userId}});
    if (user) {
            await user.addFollowing(parseInt(followingId, 10));     
        return 'ok';
    } else {
        return 'no user';
    }
}