
const router = require('express').Router();
var session = require('express-session');

const controller = require('../controllers/linkedin.controller');
const API = require('../services/api');

router.get('/auth', (req, res) => {
    res.redirect(API.getAuthorizationUrl());
});

router.get('/callback', async (req, res) => {
    if(!req.query.code) {
        res.redirect('/');
        return;
    }
    try {
        const data = await API.getAccessToken(req);
      
        if(data.access_token) {
            if (req.session) {
              
                req.session.token = data.access_token;
                req.session.authorized = true;
            }
            
        }
        
        res.redirect('/');
    } catch(err) {
       
        res.json(err);
    }
});

router.get('/', async (req, res) => {
    
        const isAuthorized = true;
       
    if(!isAuthorized) {
        
        res.render('index', { isAuthorized, id: '' });
    } else {
        try {
           
           
            const id = await API.getLinkedinId(req);
           console.log("id--",id);
            res.render('index', { isAuthorized, id });
        } catch(err) {
            console.log(err);
            res.send(err);
        }
    }   
// } 
});

router.post('/publish', async (req, res) => {
    // const { author, lifecycleState, specificContent, visibility } = req.body;
    console.log(req.body);
    const errors = [];

    // if(validator.isEmpty(title)) {
    //     errors.push({ param: 'title', msg: 'Invalid value.'});
    // }
    // if(validator.isEmpty(text)) {
    //     errors.push({ param: 'text', msg: 'Invalid value.'});
    // }
    // if(!validator.isURL(url)) {
    //     errors.push({ param: 'url', msg: 'Invalid value.'});
    // }
    // if(!validator.isURL(thumb)) {
    //     errors.push({ param: 'thumb', msg: 'Invalid value.'});
    // }

    // if(errors.length > 0) {
    //     res.json({ errors });
    // } else {
        

        try {
            const response = await API.publishContent(req);
            
            res.json({ success: 'Post published successfully.' });
        } catch(err) {
           
            res.json({ error: 'Unable to publish your post.' });
        }
    
});



module.exports = router;