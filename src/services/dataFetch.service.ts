import { DataParserController } from "../controllers/dataParser.controller";
import { Feed, IFeed } from "../models/Feed.model";
import { Sources } from "../utils/enums";
import { sortFeedByDate } from "../utils/misc";

const dataParserController: DataParserController = new DataParserController();

export function initDataFetch() {
    setInterval(fetchFeedData, 1000 * 60 * 60);
}

async function fetchFeedData() {
    console.log("Fetching Feeds Started");
    const feeds: IFeed[] = await Feed.find({}, "name sources").exec();

    for (const feed of feeds) {
        const facebookSources = feed.sources.filter(o => o.provider === Sources.Facebook);
        const instagramSources = feed.sources.filter(o => o.provider === Sources.Instagram);

        const [facebookFeed, instagramFeed] = await Promise.all([
            dataParserController.parseFacebookData(facebookSources.map(o => o.profileName)),
            dataParserController.parseInstagramData(instagramSources.map(o => o.profileName))
        ]);

        const feedData = sortFeedByDate([].concat.apply(facebookFeed, instagramFeed));

        await Feed.updateOne(
            {
                "_id": feed.id,
            },
            {
                "$set": {
                    "feedData": feedData,
                    "date_updated": Date.now(),
                }
            }
        );
        console.log("Fetching Feeds Finished");
    }
}