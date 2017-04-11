const router = module.exports  = require('express').Router();


router.use('/users', require('./users'))
router.use('/blogs', require('./blogs'))
router.use('/admin', require('./admin'))
router.use('/castingcalls', require('./castingcalls'))