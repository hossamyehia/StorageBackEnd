import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';

import { db } from '../config/database';
import Lawyers from '../interface/Lawyers';
import authService from '../service/auth.service';
import initPassport from '../middleware/passport.middleware'

const options = {
    usernameField: 'username',
    passwordField: 'password'
};

// Init Passport Middleware
initPassport()

passport.use(new localStrategy(options, function verify(username: string, password: string, done) {
    db<Lawyers>('lawyers').where({ username }).first()
        .then((user) => {
            if (!user) return done(null, false);
            if (!authService.comparePass(password, user.password)) {
                return done(null, false);
            } else {
                let {id} = user;
                return done(null, {_id: id});
            }
        })
        .catch((err) => { return done(err); });
}));

export default passport;