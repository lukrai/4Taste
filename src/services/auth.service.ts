const jwt = require('jsonwebtoken');
const keys = require('./../config/keys');
import * as passport from 'passport';
import { Router, Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response) => {
    const token = req.headers['authorization'];
    jwt.verify(token, keys.JWT_SECRET, (err: any, authData: string) => {
        console.log(authData);
        if (err) {
            return res.status(403).json("Token is not valid");
        } else {
            console.log(authData);
            // return req.authData = authData;
        }
    })
};

export function signToken(req: Request): string {
    return jwt.sign({
        iss: "4Taste",
        sub: req.user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
    }, keys.JWT_SECRET);
}

export const jwtMiddleware = passport.authenticate("jwt", { session: false });
