import * as passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
var GoogleStrategy = require('passport-google-oauth20');
import { User } from './models/User.model';
const keys = require('./config/keys');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: keys.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);

    }
}));

passport.use("google", new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            provider: "google",
            google: {
                id: profile.id,
                email: profile.emails[0].value,
            }

        });
        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message)
    }
}));

passport.use(new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ "local.email": email });
        if (!user) {
            return done(null, false);
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));