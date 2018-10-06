import { Feed } from '../models/Feed.model';
import { Request, Response, NextFunction } from 'express';
import { DataParserController } from './dataParser.controller'

export class FeedController {
    private dataParserController: DataParserController = new DataParserController();

    public addNewFeed(req: Request, res: Response, next: NextFunction) {
        let newFeed = new Feed(req.body);

        newFeed.save((err, feed) => {
            if (err) {
                return next(err);
            }
            return res.json({ message: "Successfully added!", id: feed.id });
        });
    }

    public getAllFeeds(req: Request, res: Response, next: NextFunction) {
        Feed.find({}).sort({ createdAt: -1 }).exec((err, feeds) => {
            if (err) {
                return next(err);
            }
            return res.json(feeds);
        });
    }

    public async getFeed(req: Request, res: Response, next: NextFunction) {
        // console.log(await dataParserController.parseFacebookData(['carthrottle']));
        // console.log(await dataParserController.parseInstagramData(['love_food', 'rkoi']));
        // const s = await dataParserController.parsePinterestData(["travelhyper", "thriftytrvlmama"]);

        Feed.findOne({ _id: req.params.feedId }).lean().exec((err, feed) => {
            if (err) {
                return next(err);
            }
            if (!feed) {
                return res.status(404).json({ error: { message: "Feed not found" } });
            }
            return res.json(feed);
        });
    }

    public updateFeed(req: Request, res: Response, next: NextFunction) {
        Feed.findOneAndUpdate({ _id: req.params.feedId }, req.body).setOptions({ runValidators: true }).exec((err, feed) => {
            if (err) {
                return next(err);
            }
            if (!feed) {
                return res.status(404).json({ error: { message: "Feed not found" } });
            }
            return res.json({ message: "Feed successfully updated" });
        });
    }

    public deleteFeed(req: Request, res: Response, next: NextFunction) {
        Feed.remove({ _id: req.params.feedId }).exec((err, feed) => {
            if (err) {
                return next(err);
            }
            if (!feed) {
                return res.status(404).json({ error: { message: "Feed not found" } });
            }
            return res.json({ message: "Feed successfully deleted" });
        });
    }
}
