import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

import configs from '../config/configs.config';

import LawyerType from '../types/lawyer';

export function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

export function getToken(user: LawyerType | any) {
  return jwt.sign(user, configs.SECRET,
      {expiresIn: 60 * 60 * 8});
};
