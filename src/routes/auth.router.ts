import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller'
import * as passport from 'passport';
import {checkTokenMW, signToken, verifyToken} from "../services/auth.service";

const loginMiddleware = passport.authenticate("local", {session: false});
const jwtMiddleware = passport.authenticate("jwt", {session: false});
const googleMiddleware = passport.authenticate("google", {scope: ['profile', "email"], session: false});

export class AuthRouter {
	router: Router;
	userController: UserController = new UserController();

	constructor() {
		this.router = Router();
		this.init();
	}

	public getAll(req: Request, res: Response, next: NextFunction) {
		res.send("FEEDS ALL");
	}

	public googleCallback(req: Request, res: Response, next: NextFunction) {
		signToken(req, res);
		const token = signToken(req, res);
        return res.json({ token, id: req.user.id, });
	}

	public verify(req: Request, res: Response, next: NextFunction) {
		verifyToken(req, res);
		res.send("google Callback");
	}

	public logout(req: Request, res: Response, next: NextFunction) {
		res.send("Logging out");
	}

	/**
	 * Take each handler, and attach to one of the Express.Router's endpoints.
	 */
	init() {
		this.router.post('/register', this.userController.addNewUser);
		this.router.post('/login', loginMiddleware, this.userController.login);
		this.router.get('/secret', jwtMiddleware, this.getAll)

		this.router.get('/google', googleMiddleware);
		this.router.get('/google/callback', passport.authenticate('google', {session: false}), this.googleCallback);
		this.router.get('/google/verify', checkTokenMW, this.verify);
		this.router.post('/logout', this.logout);
	}

}

const feedRoutes = new AuthRouter();
feedRoutes.init();

export default feedRoutes.router;
