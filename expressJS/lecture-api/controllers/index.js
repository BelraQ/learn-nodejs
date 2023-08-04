const { User, Domain } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.renderLogin = async (req, res, next) => {
    //console.log("요청의 유저: ", req.user);
    try {
        const user = await User.findOne({
            where: { id: req.user?.id || null }, 
            include: { model: Domain },
        });
        //console.log("찾은 유저: ", user);
        // where은 undifined 값이 되면 안됨. null로 해주기
        //passport serial에서 include model Domain 설정하여 매번 include 하지 않아도 되게끔 해도 됨
        res.render('login', {
            user,
            domains: user?.Domains,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.createDomain = async (req, res, next) => {
    try {
        await Domain.create({
           UserId: req.user.id,
           host: req.body.host,
           type: req.body.type,
           clientSecret: uuidv4(), 
        }); 
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};