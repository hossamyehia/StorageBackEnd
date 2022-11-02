import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import Lawyers from '../interface/Lawyers';
import sqlError from '../interface/sqlError';



export = {
    insertUser:  (username: string, password: string, name: string) => {
        return new Promise(async (resolve, reject)=>{
            try {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                const result = await db<Lawyers>('lawyers')
                    .insert({
                        username,
                        password: hash,
                        name,
                    })
                    .returning(['id', 'name']);

                resolve(result);
            }catch (err: sqlError | any) {
                if( err.errno === 1062)
                    reject(new Error("Username already exists"))
            }
        })
        
    }
}