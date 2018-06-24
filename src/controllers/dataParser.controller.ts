import * as request from 'request-promise';
const keys = require('../config/keys');

export class DataParserController {
    public async parseFacebookData(profilesString: string[]) {
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

    private youtubeOptions = (channelId: string) => {
        const options = {
            method: 'GET',
            uri: `https://www.googleapis.com/youtube/v3/search?key=${keys.GOOGLE_API}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`,
            json: true
        };
        return options;
    }

    public async parseYoutubeData(idsString: string[]) {
        let youtubeData: any[] = [];
        let requests = [];

        for (const channelId of idsString) {
            requests.push(request(this.youtubeOptions(channelId)));
        }

        await Promise.all(requests)
            .then(data => {
                for (const channelData of data) {
                    for (const element of channelData.items) {
                        const obj = {
                            id: element.id.videoId,
                            kind: element.id.kind,
                            created_time: element.snippet.publishedAt,
                            title: element.snippet.title,
                            description: element.snippet.description,
                            channelId: element.snippet.channelId,
                            channelTitle: element.snippet.channelTitle,
                            thumbnails: element.snippet.thumbnails,
                            source: 'youtube'
                        }
                        youtubeData.push(obj);
                    }
                }
            }).catch(function (err) {
                //return res.status(500).send("There was a problem parsing youtube feed.");
                return [];
            });
        return youtubeData;
    }
}
