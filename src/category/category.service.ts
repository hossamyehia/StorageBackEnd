import { db } from "../config/database.config";
import Category from "./category.model";
import SQLError from "../shared/models/SQLError.model";

/**
 * Insert Category To Database
 * @param name Category Name
 * @returns Operation Result || Error Object
 */
export function insertCategory(name: string) {
  return new Promise(async (resolve, reject) => {
    await db<Category>("category")
      .insert({
        name,
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
 * Find All Categories
 * @returns Array Of All Categories || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Category>("category")
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
 * Find Category by its ID
 * @param id Category ID
 * @returns The Specific Category || Error Object
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Category>("category")
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
 * Find Categories` Devices` Count & Brands` Count
 * @returns Array Of All Categories || Error Object
 */
export function findWithDetails() {
  return new Promise(async (resolve, reject) => {
    await db<Category>("category")
      .leftJoin("brand", "brand.type", "category.id")
      .select("category.name", "category.total")
      .count("brand.id as numberOfBrands")
      .groupBy("category.name")
      .orderBy(["category.name"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Add Quantity To Total Number Of Devices of Specific Category
 * @param name Category Name
 * @param value The Addition Quantity
 * @returns Success Msg || Error Object
 */
export function addQuantity(name: string, value: number) {
  return new Promise(async (resolve, reject) => {
    await db<Category>("category")
      .where({ name })
      .first()
      .update({
        total: db.raw(`?? + ${value}`, ["total"]),
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
 * Update Category Data
 * @param id Category ID
 * @param data New Data
 * @returns Success Msg || Error Object
 */
export function updateCategory(id: number, data: { name?: string }) {
  return new Promise(async (resolve, reject) => {
    await db<Category>("category")
      .where({ id })
      .first()
      .update(data)
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Delete Specific Category
 * @param id Category ID
 * @returns Success Msg || Error Object
 */
export function removeCategory(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Category>("category")
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
