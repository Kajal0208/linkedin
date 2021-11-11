
const router = require('express').Router();
const { default: axios } = require('axios');
const conn = require('../config/conn');
const API = require('../services/api');

router.get('/auth', (req, res) => {
    res.redirect(API.getAuthorizationUrl());
    
});
// post
router.get('/callback', async (req, res) => {
    
    if (!req.query.code) {
        res.redirect('/');
        return;
    }
    try {
        const data = await API.getAccessToken(req);
        if (data.access_token) {
            if (req.session) {

                req.session.token = data.access_token;
                req.session.authorized = true;
            }

        }
       res.redirect('/');
    } catch (err) {
        res.json(err);
    }
});

router.get('/', async (req, res) => {

    const isAuthorized = true;

    if (!isAuthorized) {

        res.render('index', { isAuthorized, id: '' });
    } else {
        try {
            const id = await API.getLinkedinId(req);
            console.log("id---", id);
           
            res.render('index', { isAuthorized, id });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }
});

const addData = async({conn,id,body,post_id})=>{
    const params = [];
    params.push(id,body,post_id);
    
    const query =  'Insert into Linkedin_posts (person_id,post_id,access_token) VALUES(id,post_id,body)'
    const { rows } = await conn.query(query, params);
    return rows;
}
router.post('/publish', async (req, res) => {

try {
        const response = await API.publishContent(req);
       
        res.json({ response,success: 'Post published successfully.' });
    } catch (err) {

        res.json({ error: 'Unable to publish your post.' });
    }

});

router.get('/getPost', async (req, res) => {


    var config = {
        method: 'get',
        url: `https://www.linkedin.com/feed/update/urn:li:share:6864092590728384512`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'bcookie="v=2&36e2722a-e810-4600-8583-7d9297125c06"; lang=v=2&lang=en-us; lidc="b=TB32:s=T:r=T:a=T:p=T:g=3758:u=157:x=1:i=1635756200:t=1635821239:v=2:sig=AQHLpSj9qUSo7z4FEVbwNOkOYwlOOpPH"; JSESSIONID=ajax:5596919687131558543; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImZsb3dUcmFja2luZ0lkIjoic0tSYlNIV2pTQVc4UFIzVEh5aTg5dz09In0sIm5iZiI6MTYzNTc1MTkzNiwiaWF0IjoxNjM1NzUxOTM2fQ.vd1ii8JbD8xHaaRCNc8-SAlNVQzMoxY0VONEq1bXSbI; bscookie="v=1&20211101054543b44ad1a2-f8b7-4e71-88ab-5e8e176ee90fAQHPLcwKW5hvR_XY52Mch-JV8HLuFxlT"'
        },

    };

    axios(config)
        .then(function (response) {

            const { data } = response;
            if (data) {
                return res.send(data);
            }

        })
        .catch(function (error) {
            console.log("err", error);
            return res.status(400).json({ err: error })
        });


});

module.exports = router;