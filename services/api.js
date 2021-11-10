const request = require('request');
const config = require('../config/dev.json');

class API {
    static getAuthorizationUrl() {
        const state = Buffer.from(Math.round( Math.random() * Date.now() ).toString() ).toString('hex');
        const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
        const url = `${config.linkedin.authorizationURL}?response_type=code&client_id=${config.linkedin.client_id}&redirect_uri=${encodeURIComponent(config.linkedin.redirectURL)}&state=${state}&scope=${scope}`;
       
        return url;
    }

    static getAccessToken(req) {
        const { code } = req.query;
       
       
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
        // const { title, text, shareUrl, shareThumbnailUrl } = content;
        const body =  {
            "author": "urn:li:person:M39Kt_9aNn",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": "Hello World! This is my first Share on LinkedIn!"
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
      
        return new Promise((resolve, reject) => {
            
            request.post({ url: url, json: body, headers: headers}, (err, response, body) => {
                if(err) {
                    console.log(err);
                    reject(err);
                }
                
                resolve(body);
            });
        });
    }
    }
}

module.exports = API;