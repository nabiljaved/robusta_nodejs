const express = require('express');
const router = express.Router();



router.get('/', (req, res)=>{
    res.render('registration.ejs');
})

router.get('/login', (req, res)=>{
    res.render('login.ejs');
})

router.get('/*', (req, res)=>{
    res.render('404.ejs', {title : '404 Not Found'});
})


module.exports = router;