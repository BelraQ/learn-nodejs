const express = require('express');

const {renderMain, getrandomSource } = require('../controllers');

const router = express.Router();

router.get('/', renderMain);
router.get('/random', getrandomSource);
module.exports = router;