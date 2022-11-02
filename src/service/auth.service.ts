import bcrypt from 'bcryptjs';

function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}


export = {
  comparePass
};