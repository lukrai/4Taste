import { User, IUser } from '../models/User.model';
import { Request, Response, NextFunction } from 'express';
import {signToken} from "../services/auth.service";

export class UserController {
    public addNewUser = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const foundUser = await User.findOne({"local.email": email});
        if (foundUser) {
            return res.status(403).json({ error: { message: "Email already in use" } });
        }

        let newUser = new User({ local: {email, password}, provider: "local" });
        newUser.save((err, user) => {
            if (err) {
                return next(err);
            }

            const token = signToken(req);
            return res.json({ token, id: user.id, });
        });
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const token = signToken(req);
        return res.json({ token });
    }
}
