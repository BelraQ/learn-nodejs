const User = require('../models/user');
const follow = require('../services/user');
//controller는 요청과 응답, service는 핵심 로직.
exports.follow = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const result = await this.follow(req.user.id, req.params.id);
        if (result === 'ok') {
            res.send('success');
        } else if (result === 'no user') {
            res.status(404).send('no user');
        }
        user.addFollowing(parseInt(req.params.id, 10));
    } catch(error) {
        console.error(error);
        next(error);
    }  
};