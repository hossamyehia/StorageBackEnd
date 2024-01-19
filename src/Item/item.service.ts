import { db } from "../config/database.config";
import Item from "./item.model";
import SQLError from "../shared/models/SQLError.model";
import Brand from "../brand/brand.model";
import Category from "../category/category.model";
import * as crypto from "crypto";

/**
 * Insert Item
 * @param SID Serial Number
 * @param brand_id  Brand`s ID
 * @param status  Item`s status ("ص أ", "جديد", "ت ح")
 * @param quantity  Item`s quantity
 * @param edara Is Ohda By Edara
 * @param location  Item`s Current Location
 * @param addedBy User`s Name
 * @returns Success MSG || Error Object
 */
export function insertItem(
  SID: string,
  brand_id: number,
  status: string,
  quantity: number,
  edara: boolean,
  location: number,
  addedBy: string
) {
  return new Promise(async (resolve, reject) => {
    if (SID === "-") SID = "GEN-" + crypto.randomBytes(3).toString("hex");
    SID = SID.toUpperCase();
    await db<Item>("item")
      .insert({
        SID,
        brand_id,
        status,
        quantity,
        edara,
        location,
        addedBy,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        if (err.errno === 1062) reject(new Error("Item already Added"));
        reject(new Error(err));
      });
  });
}

/**
 * Find All Items
 * @returns Array Of All Items || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Item>("item as i")
      .leftJoin<Brand>("brand as b", "b.id", "i.brand_id")
      .leftJoin<Category>("category as c", "c.id", "b.type")
      .leftJoin<Location>("location as l", "i.location", "l.id")
      .select(
        "i.SID as SID",
        "b.name as name",
        "b.model as model",
        "i.brand_id as brand_id",
        "c.name as type",
        "i.status as status",
        "i.edara as edara",
        db.raw("CASE WHEN ?? = 0 THEN 'فرع' ELSE 'إدارة' END AS eof", ["i.edara"]),
        "i.location as location",
        "l.name as location_name",
        "i.quantity as quantity",
        "b.quantityType as quantityType",
        "i.createdAt as createdAt",
        "i.addedBy as addedBy"
      )
      .orderBy(["type"])
      .then((items) => {
        resolve(items);
      })
      .catch((err: SQLError | any) => {
        reject(new Error(err));
      });
  });
}

/**
 * Find Specific Item
 * @param SID Serial Number
 * @returns Specific Item || Error Object
 */
export function findById(SID: string) {
  return new Promise(async (resolve, reject) => {
    await db<Item>("item as i")
      .leftJoin<Brand>("brand as b", "b.id", "i.brand_id")
      .leftJoin<Category>("category as c", "c.id", "b.type")
      .leftJoin<Location>("location as l", "i.location", "l.id")
      .select(
        "i.SID as SID",
        "b.name as name",
        "b.model as model",
        "i.brand_id as brand_id",
        "c.name as type",
        "i.status as status",
        "i.location as location",
        "l.name as location_name",
        "i.edara as edara",
        db.raw("CASE WHEN ?? = 0 THEN 'فرع' ELSE 'إدارة' END AS `eof`", ["i.edara"]),
        "i.quantity as quantity",
        "b.quantityType as quantityType",
        "i.createdAt as createdAt",
        "i.addedBy as addedBy"
      )
      .where({ SID })
      .first()
      .then((item) => {
        resolve(item);
      })
      .catch((err: SQLError | any) => {
        reject(new Error(err));
      });
  });
}

/**
 * Find Items in Specific Category
 * @param type Category`s ID
 * @returns Array Of Items || Error Object
 */
export function findByType(type: number) {
  return new Promise(async (resolve, reject) => {
    await db<Item>("item as i")
      .leftJoin<Brand>("brand as b", "b.id", "i.brand_id")
      .leftJoin<Category>("category as c", "c.id", "b.type")
      .leftJoin<Location>("location as l", "i.location", "l.id")
      .select(
        "i.SID as SID",
        "b.name as name",
        "b.model as model",
        "i.brand_id as brand_id",
        "c.name as type",
        "i.status as status",
        "i.location as location",
        "l.name as location_name",
        "i.edara as edara",
        db.raw("CASE WHEN ?? = 0 THEN 'فرع' ELSE 'إدارة' END AS eof", ["i.edara"]),
        "i.quantity as quantity",
        "b.quantityType as quantityType",
        "i.createdAt as createdAt",
        "i.addedBy as addedBy"
      )
      .where("b.type", type)
      .orderBy(["location"])
      .then((items: any[]) => {
        resolve(items);
      })
      .catch((err: SQLError | any) => {
        console.log(err);
        reject(new Error(err));
      });
  });
}

/**
 * Update Item`s Data
 * @param SID Serial Number
 * @param data New Data
 * @returns Success MSG || Error Object
 */
export function updateItem(SID: string, data: any) {
  return new Promise(async (resolve, reject) => {
    db.transaction(async (trx) => {
      const item = await trx("item").select("*").where({ SID }).first();

      let queries: any[] = [];
      let quantity: number =
        data.quantity == item.quantity ? item.quantity : data.quantity;
      data.SID =
        data.SID === "-"
          ? "GEN-" + crypto.randomBytes(3).toString("hex").toUpperCase()
          : data.SID;

      const old_brand = await trx("brand")
        .select("*")
        .where({ id: item.brand_id })
        .first();

      //  IF Brand Changed
      if (data.brand_id !== item.brand_id) {
        const new_brand = await trx("brand")
          .select("*")
          .where({ id: data.brand_id })
          .first();

        queries.push(
          trx("brand")
            .where({ id: item.brand_id })
            .first()
            .update({
              total: db.raw(`?? - ${item.quantity}`, ["total"]),
            })
            .transacting(trx)
        );

        queries.push(
          trx("brand")
            .where({ id: data.brand_id })
            .first()
            .update({
              total: db.raw(`?? + ${quantity}`, ["total"]),
            })
            .transacting(trx)
        );

        //  IF New Brand Category is Different from Old Brand Category
        if (old_brand.type !== new_brand.type) {
          queries.push(
            trx("category")
              .where({ id: old_brand.type })
              .first()
              .update({
                total: db.raw(`?? - ${item.quantity}`, ["total"]),
              })
              .transacting(trx)
          );
          queries.push(
            trx("category")
              .where({ id: new_brand.type })
              .first()
              .update({
                total: db.raw(`?? + ${quantity}`, ["total"]),
              })
              .transacting(trx)
          );
        } else {
          if (data.quantity !== item.quantity) {
            queries.push(
              trx("category")
                .where({ id: old_brand.type })
                .first()
                .update({
                  total: db.raw(`?? + ${data.quantity - item.quantity}`, [
                    "total",
                  ]),
                })
                .transacting(trx)
            );
          }
        }
      } else {
        if (data.quantity !== item.quantity) {
          queries.push(
            trx("brand")
              .where({ id: item.brand_id })
              .first()
              .update({
                total: db.raw(`?? + ${data.quantity - item.quantity}`, [
                  "total",
                ]),
              })
              .transacting(trx)
          );
          queries.push(
            trx("category")
              .where({ id: old_brand.type })
              .first()
              .update({
                total: db.raw(`?? + ${data.quantity - item.quantity}`, [
                  "total",
                ]),
              })
              .transacting(trx)
          );
        }
      }

      queries.push(
        trx("item").where({ SID }).first().update(data).transacting(trx)
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
 * Update Items` Location For Document
 * @param items Array Of Items
 * @param location New Location
 * @returns Success MSG || Error Object
 */
export function updateItemsLocation(items: any[], location: number, doc_id: number) {
  return new Promise(async (resolve, reject) => {
    await db
      .transaction(async (trx) => {
        let queries: any[] = [];
        items.forEach((item) => {
          if (item.quantity == item.total) {
            queries.push(
              db<Item>("item")
                .where({ SID: item.SID })
                .update({ location })
                .transacting(trx)
            );
          } else {
            let SID = item.SID + "-" +
            crypto.randomBytes(2).toString("hex").toUpperCase();
            queries.push(
              db<Item>("item")
                .insert({
                  SID,
                  brand_id: item.brand_id,
                  status: item.status,
                  quantity: item.quantity,
                  edara: item.edara,
                  location,
                  addedBy: item.addedBy,
                })
                .transacting(trx)
            );
            queries.push(
              db<Item>("item")
                .where({ SID: item.SID })
                .update({ quantity: db.raw(`?? - ${item.quantity}`, ["quantity"]), })
                .transacting(trx)
            )
            queries.push(
              db("document_item")
                .where({ "item_id": item.SID, document_id: doc_id })
                .update({ item_id: SID })
                .transacting(trx)
            )
          }
          
        
        });

        return Promise.all(queries).then(trx.commit).catch(trx.rollback);
      })
      .then(function (values) {
        resolve(values);
      })
      .catch(function (error: SQLError | any) {
        reject(error);
      });
  });
}

/**
 * Delete Item
 * @param SID Serial Number
 * @returns Success MSG || Error Object
 */
export function removeItem(SID: string) {
  return new Promise(async (resolve, reject) => {
    db.transaction(async (trx) => {
      const item = await trx("item").select("*").where({ SID }).first();

      let queries: any[] = [];

      queries.push(
        trx("brand")
          .where({ id: item.brand_id })
          .first()
          .update({
            total: db.raw(`?? - ${item.quantity}`, ["total"]),
          })
          .transacting(trx)
      );

      const brand = await trx("brand")
        .select("*")
        .where({ id: item.brand_id })
        .first();

      queries.push(
        trx("category")
          .where({ id: brand.type })
          .first()
          .update({
            total: db.raw(`?? - ${item.quantity}`, ["total"]),
          })
          .transacting(trx)
      );

      queries.push(
        trx("item").where({ SID }).first().delete().transacting(trx)
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
    await db<Item>("item")
      .where({ SID })
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
