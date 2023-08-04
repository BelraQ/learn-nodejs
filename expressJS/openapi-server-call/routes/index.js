const express = require('express');

const {renderMain} = require('../controllers');

const router = express.Router();

router.get('/', renderMain);
module.exports = router;