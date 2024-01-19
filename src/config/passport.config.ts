import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { comparePass } from '../shared/services/auth.service';
import { findById, findByUsername } from '../User/user.service';

/*import UserType from '../types/user';*/
import User from "../User/user.model";

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
    .then((user: User | any) => {
        if (!user) return done(null, false, { message: 'User Not Found.' });
        if (!comparePass(password, user.password)) {
            return done(null, false, { message: 'Incorrect Password.' });
        } else {
            let {id, name, title, permission} = user;
            return done(null, {id: id, name: name, title: title, permission: permission});
        }
    })
    .catch((err) => { return done(err); });
}));

passport.use("jwt", new JwtStrategy(opts,
    (jwt_payload, done) => {
        findById(jwt_payload.id)
        .then((user: User | any) => {
            if (user) return done(null, user);
            else  return done(null, false);
        })
        .catch((err) => { return done(err, false); });
}));

export default passport;