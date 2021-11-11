const request = require('request');
const config = require('../config/dev.json');
const conn = require('../config/conn');



class API {
    static getAuthorizationUrl() {
        const state = Buffer.from(Math.round( Math.random() * Date.now() ).toString() ).toString('hex');
        const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
        const url = `${config.linkedin.authorizationURL}?response_type=code&client_id=${config.linkedin.client_id}&redirect_uri=${encodeURIComponent(config.linkedin.redirectURL)}&state=${state}&scope=${scope}`;
       
        return url;
    }

    static getAccessToken(req) {
        const { code } = req.query;
       console.log("code-",code);
      
        const body = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: config.linkedin.redirectURL,
            client_id: config.linkedin.client_id,
            client_secret: config.linkedin.client_secret
        };
       
        return new Promise((resolve, reject) => {
            request.post({url: config.linkedin.accessTokenURL, form: body }, (err, response, body) =>
        { 
            ;
            if(err) {
                reject(err);
            }
          
            resolve(JSON.parse(body));
        }
        );
        });
       
    }

    static getLinkedinId(req) {
        return new Promise((resolve, reject) => {
         
            const url = 'https://api.linkedin.com/v2/me';
            console.log(req.session);
            if (req.session) {
              
             
            
            const headers = {
                'Authorization': 'Bearer ' + req.session.token,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0' 
            };
        
          
            request.get({ url: url, headers: headers }, (err, response, body) => {
                if(err) {
                    console.log(err);
                    reject(err);
                }
                resolve(JSON.parse(body).id);
            });
        }
        });
    }

    static publishContent(req, linkedinId, content) {
        const url = 'https://api.linkedin.com/v2/ugcPosts';
       
        const body =  {
            "author": "urn:li:person:EvDrEvJdS1",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": "Hello World! This is my first Share on Linkedin"
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }
        if (req.session) {
        const headers = {
            'Authorization':  req.headers.authorization,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0',
            'x-li-format': 'json'
        };
        const addData = async({conn,linkedinId,body,post_id})=>{
            const params = [];
            params.push(linkedinId,post_id,body);
            
            const query =  'Insert into Linkedin_posts (person_id,post_id,access_token) VALUES(?,?,?)'
            const { rows } = await conn.query(query, params);
            return rows;
        }
       
        return new Promise((resolve, reject) => {
            
            request.post({ url: url, json: body, headers: headers}, (err, response, body) => {
                if(err) {
                    console.log(err);
                    reject(err);
                }
               
               
                resolve(body);
                addData({conn,linkedinId:"EvDrEvJdS1",body:req.headers.authorization,post_id:body.id});
            });
        });
    }
    }
}

module.exports = API;