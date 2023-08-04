const axios = require('axios');

//axios.defaults.headers.origin = "http://localhost:8006";

exports.renderMain = (req, res) => {
    res.render('main');
}