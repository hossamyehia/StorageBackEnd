import passport from 'passport';

import { db } from '../config/database.config';
import Lawyers from '../interface/Lawyers';

type User = {
  _id?: number
}

export default () => {

  passport.serializeUser((user: User, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id: number, done) => {
    db<Lawyers>('lawyers').where({ id }).first()
      .then((user) => { done(null, user); })
      .catch((err) => { done(err, null); });
  });

};

