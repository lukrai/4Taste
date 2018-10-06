import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller'
import * as passport from 'passport';
import {signToken, verifyToken, jwtMiddleware} from "../services/auth.service";

const loginMiddleware = passport.authenticate("local", {session: false});
const googleMiddleware = passport.authenticate("google", {scope: ['profile', "email"], session: false});

export class AuthRouter {
	public router: Router;
	private userController: UserController = new UserController();

	constructor() {
		this.router = Router();
		this.init();
	}

	public getAll(req: Request, res: Response, next: NextFunction) {
		return res.send("FEEDS ALL");
	}

	public googleCallback(req: Request, res: Response, next: NextFunction) {
		const token = signToken(req);
        res.json({ token, id: req.user.id, });
	}

	public verify(req: Request, res: Response, next: NextFunction) {
		verifyToken(req, res);
		console.log(req.user);
		res.send("google Callback");
	}

	public logout(req: Request, res: Response, next: NextFunction) {
		res.send("Logging out");
	}

	init() {
		this.router.post('/register', this.userController.addNewUser);
		this.router.post('/login', loginMiddleware, this.userController.login);

		this.router.get('/google', googleMiddleware);
		this.router.get('/google/callback', passport.authenticate('google', {session: false}), this.googleCallback);

		this.router.get('/verify', jwtMiddleware, this.verify);
		this.router.post('/logout', this.logout);
	}
}

const feedRoutes = new AuthRouter();
feedRoutes.init();

export default feedRoutes.router;
