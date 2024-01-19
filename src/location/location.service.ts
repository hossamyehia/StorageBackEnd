import { db } from "../config/database.config";
import Location from "./location.model";
import SQLError from "../shared/models/SQLError.model";

/**
 * Insert Location
 * @param name Location Name
 * @returns Operation Result || Error Object
 */
export function insertLocation(name: string) {
  return new Promise(async (resolve, reject) => {
    await db<Location>("location")
      .insert({
        name,
      })
      .then((done) => {
        resolve(done);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Specific Location By its ID
 * @param id Location ID
 * @returns Specific Location
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Location>("location")
      .select("*")
      .where({ id })
      .first()
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find All Locations
 * @returns Array of All Locations || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Location>("location")
      .select("*")
      .orderBy(["id", "name"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}


/**
 * Update Specific Location By its ID
 * @param id Location ID
 * @param data new Data
 * @returns Operation Result || Error Object
 */
export function updateLocation(id: number, data: any) {
  return new Promise(async (resolve, reject) => {
    await db<Location>("location")
      .where({ id })
      .first()
      .update(data as { name?: string })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(new Error(err));
      });
  });
}


/**
 * Delete Specific Location By its ID
 * @param id Location ID
 * @returns Operation Result || Error Object
 */
export function deleteLocation(id: number){
    return new Promise(async (resolve, reject) => {
        await db<Location>("location")
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
