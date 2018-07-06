import { Router, Request, Response, NextFunction } from 'express';
import { FeedController } from '../controllers/feed.controller'
// const Heroes = require('../data');

export class FeedRouter {
	router: Router;
	feedController: FeedController = new FeedController();

	constructor() {
		this.router = Router();
		this.init();
	}

	public getAll(req: Request, res: Response, next: NextFunction) {
		res.send("FEEDS ALL");
	}

	/**
	 * Take each handler, and attach to one of the Express.Router's endpoints.
	 */
	init() {
		this.router.get('/', this.feedController.getAllFeeds);
		this.router.post('/new', this.feedController.addNewFeed);
		this.router.get('/:feedId', this.feedController.getFeed);
		this.router.put('/:feedId', this.feedController.updateFeed);
		this.router.delete('/:feedId', this.feedController.deleteFeed);
	}

}

const feedRoutes = new FeedRouter();
feedRoutes.init();

export default feedRoutes.router;
