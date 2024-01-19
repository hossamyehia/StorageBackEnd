import { db } from "../config/database.config";
import Brand from "./brand.model";
import SQLError from "../shared/models/SQLError.model";
import Category from "../category/category.model";
import { camelize } from "../shared/util/helper.util";
import HttpException from "../shared/models/HttpException.model";

/**
 * Insert Brand To Database
 * @param name Brand Name
 * @param model Brand Model
 * @param type Brand Type "Category ID"
 * @param quantityType Brand Quantity Type ('بالعدد', 'بالرول', 'بالمتر')
 * @returns Operation Result || Error Object
 */
export function insertBrand(
  name: string,
  model: string,
  type: number,
  quantityType: string
) {
  return new Promise(async (resolve, reject) => {
    await db<Brand>("brand")
      .insert(
        {
          name: camelize(" " + name).slice(1),
          model: camelize(" " + model).slice(1),
          type,
          quantityType,
        },
        "id"
      )
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find All Brands
 * @returns Array Of All Brands || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Brand>("brand")
      .leftJoin<Category>("category", "category.id", "brand.type")
      .select(
        "brand.id as id",
        "brand.name as name",
        "brand.model as model",
        "category.name as type",
        "brand.total as total",
        "brand.quantityType as quantityType"
      )
      .orderBy(["id", "name", "model"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find brand by its ID
 * @param id brand ID
 * @returns The Specific Brand || Error Object
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Brand>("brand")
      .leftJoin<Category>("category", "category.id", "brand.type")
      .select(
        "brand.id as id",
        "brand.name as name",
        "brand.model as model",
        "category.name as type",
        "brand.total as total",
        "brand.quantityType as quantityType"
      )
      .where("brand.id", id)
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
 * Find Brands For Specific Category
 * @param type Brand Type "Category ID"
 * @returns Array Of Categories` Brands || Error Object
 */
export function findByType(type: number) {
  return new Promise(async (resolve, reject) => {
    await db<Brand>("brand")
      .leftJoin<Category>("category", "category.id", "brand.type")
      .select(
        "brand.id as id",
        "brand.name as name",
        "brand.model as model",
        "category.name as type",
        "brand.quantityType as quantityType"
      )
      .where({ type })
      .orderBy(["id", "name", "model"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Add Quantity to Total Number Of Devices of Specific Brand
 * @param id brand ID
 * @param value The Addition Quantity
 * @returns Success Msg || Error Object
 */
export function addQuantity(id: number, value: number) {
  return new Promise(async (resolve, reject) => {
    await db<Brand>("brand")
      .where({ id })
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
 * Update brand Data
 * @param id brand ID
 * @param data new Data
 * @returns Operation Result|| Error Object
 */
export function updateBrand(id: number, data: any) {
  return new Promise(async (resolve, reject) => {
    db.transaction(async (trx) => {
      const brand = await trx("brand").select("*").where({ id }).first();

      let queries: any[] = [];

      if (data.type !== brand.type) {
        queries.push(
          trx("category")
            .where({ id: brand.type })
            .first()
            .update({
              total: db.raw(`?? - ${brand.total}`, ["total"]),
            })
            .transacting(trx)
        );
        queries.push(
          trx("category")
            .where({ id: data.type })
            .first()
            .update({
              total: db.raw(`?? + ${brand.total}`, ["total"]),
            })
            .transacting(trx)
        );
      }

      queries.push(
        trx("brand").where({ id }).first().update(data).transacting(trx)
      );
      try {
        const value = await Promise.all(queries);
        return trx.commit(value);
      } catch (error) {
        return trx.rollback(error);
      }
    })
      .then(function (update: any) {
        resolve(update);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

/**
 * Delete Specific Brand
 * @param id brand ID
 * @returns Operation Result || Error Object
 */
export function removeBrand(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Brand>("brand")
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
