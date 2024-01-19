import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { comparePass } from '../service/auth.service';
import { findById, findByUsername } from '../service/user.service';

import UserType from '../types/user';

const options = {
    usernameField: 'username',
    passwordField: 'password'
};

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.SECRET
}


passport.use('local', new localStrategy(options, function verify(username: string, password: string, done) {
    findByUsername(username)
    .then((user: UserType | any) => {
        if (!user) return done(null, false);
        if (!comparePass(password, user.password)) {
            return done(null, false);
        } else {
            let {id} = user;
            return done(null, {id: id});
        }
    })
    .catch((err) => { return done(err); });
}));

passport.use("jwt", new JwtStrategy(opts,
    (jwt_payload, done) => {
        findById(jwt_payload.id)
        .then((user: UserType | any) => {
            if (user) return done(null, user);
            else  return done(null, false);
        })
        .catch((err) => { return done(err, false); });
}));

export default passport;