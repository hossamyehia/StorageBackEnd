import { db } from "../config/database.config";
import Role from "./role.model";
import SQLError from "../shared/models/SQLError.model";

/**
 * Insert New Role
 * @param role Role Tag
 * @param title Job Title
 * @param permission Set of Permissions
 * @returns Operation Result || Error Object
 */
export function insertRole(role: string, title: string, permission: string) {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .insert({
        role,
        title,
        permission,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Role By its Tag
 * @param role Role Tag
 * @returns Role Object || Error Object
 */
export function findByRole(role: string) {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .select("*")
      .where({ role })
      .first()
      .then((role) => {
        resolve(role);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find All Roles
 * @returns Array of All Roles || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .select("*")
      .orderBy(["role", "title"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}
/**
 * Update Role
 * @param role Role Tag
 * @param data New Data
 * @returns Operation Result || Error Object
 */
export function updateRole(role: string, data: any) {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .where({ role })
      .first()
      .update(data as { title?: string; permission?: string })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Delete Role
 * @param role Role Tag
 * @returns Operation Result || Error Object
 */
export function deleteRole(role: string) {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .where({ role })
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
