import bcrypt from 'bcryptjs';
import { db } from '../config/database.config';
import UserInterface from '../interface/User.interface';
import sqlError from '../types/sqlError';


export function insertUser(username: string, password: string, name: string, type: string) {
    return new Promise(async (resolve, reject) => {

        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        await db<UserInterface>('user')
            .insert({
                username,
                password: hash,
                name,
                type,
            })
            .then((user) => {
                resolve(user);
            }).catch((err: sqlError | any) => {
                if (err.errno === 1062)
                    reject(new Error("Username already exists"))

                reject(new Error(err));
            })
    })
}

export function findById(id: number) {
    return new Promise(async (resolve, reject) => {
        await db<UserInterface>('user')
            .select('id', 'name')
            .where({ id: id }).first()
            .then((user) => {
                resolve(user);
            }).catch((err: sqlError | any) => {
                reject(new Error(err))
            })
    })
}

export function findByUsername(username: string) {
    return new Promise(async (resolve, reject) => {
        await db<UserInterface>('user')
            .select('*')
            .where({ username }).first()
            .then((user) => {
                resolve(user);
            }).catch((err: sqlError | any) => {
                reject(new Error(err))
            })
    })
}

export function updateUser(id: number, data: { name?: string, username?: string, password?: string }){
    return new Promise(async (resolve, reject) => {
        await db<UserInterface>('user').where({ id }).first().update(data)
        .then((user) => {
            resolve(user);
        }).catch((err: sqlError | any) => {
            reject(new Error(err))
        })
    })
}

