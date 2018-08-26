const jwt = require('jsonwebtoken');
const keys = require('./../config/keys');
import { Router, Request, Response, NextFunction } from 'express';

// check if Token exists on request Header and attach token to request as attribute
export const checkTokenMW = (req: any, res: Response, next: NextFunction) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader.split(' ')[1];
        next();
    } else {
        res.sendStatus(403);
    }
};

// Verify Token validity and attach token data as request attribute
export const verifyToken = (req: any, res: Response) => {
    jwt.verify(req.token, 'secretkey', (err: any, authData: string) => {
        if(err) {
            res.status(403).json("Token is not valid");
        } else {
            return req.authData = authData;
        }
    })
};

// Issue Token
// export const signToken = (req: Request, res: Response) => {
//     jwt.sign({userId: req.user._id}, keys.JWT_SECRET, {expiresIn:'5 min'}, (err: any, token: string) => {
//         if(err){
//             res.sendStatus(500);
//         } else {
//             res.json({token});
//         }
//     });
// }
export const signToken = (req: Request, res: Response) => {
    console.log(req.user);
    return jwt.sign({
        iss: "4Taste",
        sub: req.user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
    }, keys.JWT_SECRET);
}
