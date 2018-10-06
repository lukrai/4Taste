import { Router, Request, Response, NextFunction } from 'express';
import { FeedController } from '../controllers/feed.controller'
import { jwtMiddleware} from "../services/auth.service";

export class FeedRouter {
	public router: Router;
	private feedController: FeedController = new FeedController();

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {
		this.router.get('/', this.feedController.getAllFeeds);
		this.router.post('/new', jwtMiddleware, this.feedController.addNewFeed);
		this.router.get('/:feedId', this.feedController.getFeed);
		this.router.put('/:feedId', jwtMiddleware, this.feedController.updateFeed);
		this.router.delete('/:feedId', jwtMiddleware, this.feedController.deleteFeed);
	}
}

const feedRoutes = new FeedRouter();
feedRoutes.init();

export default feedRoutes.router;
