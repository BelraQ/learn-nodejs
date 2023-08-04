const fs = require('fs');
const path = require('path');
const ajegag = require('../ajegag.json');
const axios = require('axios');

exports.renderMain = (req, res) => {
    res.render('main');
}

exports.getrandomSource = (req, res) => {
    try {
        
        const problem = ajegag.problems[Math.floor(Math.random() * ajegag.problems.length)];
        res.status(200).send({
            code: 200,
            message: "랜덤 퀴즈",
            problem,
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            message: "서버 에러",
        });
    }
}

