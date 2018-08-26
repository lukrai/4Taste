import * as jwt from 'jsonwebtoken';
const keys = require('./../config/keys');
import { User, IUser } from '../models/User.model';
import { Request, Response, NextFunction } from 'express';

export class UserController {
    private signToken(user: IUser) {
        return jwt.sign({
            iss: "4Taste",
            sub: user.id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1),
        }, keys.JWT_SECRET);
    }

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

            const token = this.signToken(user);
            return res.json({ token, id: user.id, });
        });
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const token = this.signToken(<IUser>req.user);
        return res.json({ token });
    }
    public loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
        const token = this.signToken(<IUser>req.user);
        return res.json({ token });
    }
}
