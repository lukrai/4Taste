import * as request from 'request-promise';
const keys = require('../config/keys');

export class DataParserController {
    public async parseFacebookData(profilesString: String[]) {
        let data: any = [];
        const options = {
            method: 'GET',
            uri: `https://graph.facebook.com/v2.11/?ids=${profilesString.toString()}`,
            qs: {
                access_token: keys.FB_ACCESS_KEY,
                fields: 'feed.limit(40){description,message,created_time,from{name, picture}, picture.height(720), properties, source, attachments, likes.summary(1).limit(0), link}'//'feed.limit(3).order(reverse_chronological)'
            },
            json: true
        };
        //https://graph.facebook.com/?ids=footengo31,footengo01,Footengo69&fields=posts.limit(5){message,created_time,picture}&access_token={your_access_token}

        await request.get(options)
            .then(fbRes => {
                var feedData: any = [];
                for (let profile in fbRes) {
                    if (fbRes.hasOwnProperty(profile)) {
                        fbRes[profile].feed.data.forEach((obj: any) => obj.source = 'facebook');
                        feedData = feedData.concat(fbRes[profile].feed.data);
                    }
                }
                data = feedData;
            }).catch(function (err) {
                return [];
            });    
        return data;
    }
}