import bcrypt from "bcryptjs";
import { db } from "../config/database.config";
import User from "./user.model";
import SQLError from "../shared/models/SQLError.model";
import Role from "../role/role.model";

/**
 * Insert New User
 * @param username Username
 * @param password Password
 * @param name Name
 * @param role Role Tag "ID"
 * @returns Success MSG || Error Object
 */
export function insertUser(
  username: string,
  password: string,
  rank: string,
  name: string,
  role: string
) {
  return new Promise(async (resolve, reject) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    await db<User>("user")
      .insert({
        username,
        password: hash,
        rank,
        name,
        role,
      })
      .then((user) => {
        resolve(user);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}


/**
 * Find User Information And Role By ID
 * @param id User`s ID
 * @returns User Object || Error Object
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<User>("user")
      .join<Role>("role", "role.role", "user.role")
      .select("id", "rank", "name", "username", "user.role", "title", "permission")
      .where({ id: id })
      .first()
      .then((user) => {
        resolve(user);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}


/**
 * Find User Information And Role By Username
 * @param username Username
 * @returns User Object || Error Object
 */
export function findByUsername(username: string) {
  return new Promise(async (resolve, reject) => {
    await db<User>("user")
      .join<Role>("role", "role.role", "user.role")
      .select("*")
      .where({ username })
      .first()
      .then((user) => {
        resolve(user);
      })
      .catch((err: SQLError | any) => {
        reject(new Error(err));
      });
  });
}

/**
 * Find ALL Users Information
 * @returns Array of Users || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<User>("user")
      .select("id", "rank", "name", "username", "role")
      .then((users) => {
        resolve(users);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}


/**
 * Update User 
 * @param id User`s ID
 * @param data New Information
 * @returns Operation Result || Error Object
 */
export function updateUser(id: number, data: any) {
  return new Promise(async (resolve, reject) => {
    if(data.password) {
      const salt = bcrypt.genSaltSync();
      data.password = bcrypt.hashSync(data.password, salt);
    }
    await db<User>("user")
      .where({ id })
      .first()
      .update(data as { rank?: string, name?: string, username?: string, password: string })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Delete User
 * @param id User`s ID
 * @returns Operation Result || Error Object
 */
export function deleteUser(id: number){
  return new Promise(async (resolve, reject) => {
    await db<User>("user")
      .where({ id })
      .first()
      .delete()
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}