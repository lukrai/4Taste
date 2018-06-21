import * as mongoose from 'mongoose';
import { FeedSchema, Feed } from '../models/Feed.model';
import { Request, Response } from 'express';
import { DataParserController } from './dataParser.controller'

const dataParserController: DataParserController = new DataParserController();

export class FeedController {
    public addNewFeed(req: Request, res: Response) {
        let newFeed = new Feed(req.body);

        newFeed.save((err, feed) => {
            if (err) {
                return res.status(500).json({message: "Could not save feed", error: err});
            }
            return res.json({message: "Successfully added!", id: feed.id} );
        });
    }

    public getAllFeeds(req: Request, res: Response) {
        Feed.find({}).sort({ createdAt: -1 }).exec((err, feeds) => {
            if (err) {
               return res.status(500).json({error: "Could not fetch feeds"});
            }
            return res.json(feeds);
        });
    }

    public async getFeed(req: Request, res: Response) {
        console.log(await dataParserController.parseFacebookData(['carthrottle']));
        Feed.findOne({_id: req.params.feedId}).lean().exec((err, feed) => {
            if (err) {
                return res.status(500).json({message: "Server error", error: err});
            }
            if (!feed) {
                return res.status(404).json({message: "Feed not found"});
            }
            return res.json(feed);
        });
    }

    public updateFeed(req: Request, res: Response) {
        Feed.findOneAndUpdate({_id: req.params.feedId}, req.body).exec((err, feed) => {
            if (err) {
                return res.status(500).json({message: "Server error", error: err});
            }
            if (!feed) {
                return res.status(404).json({message: "Feed not found"});
            }
            return res.json({message: "Successfully updated!"});
        });
    }

    public deleteFeed(req: Request, res: Response) {
        Feed.remove({_id: req.params.feedId}).exec((err, feed) => {
            if (err) {
                return res.status(500).json({message: "Server error", error: err});
            }
            if (!feed) {
                return res.status(404).json({message: "Feed not found"});
            }
            return res.json({message: "Successfully deleted!"});
        });
    }
}
