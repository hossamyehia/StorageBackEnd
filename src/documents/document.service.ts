import { db } from "../config/database.config";
import Doucment from "./document.model";
import DocumentItem from "./document_item.model";
import SQLError from "../shared/models/SQLError.model";

/**
 * Create Document For Withdraw Items
 * @param rank recipient`s Rank
 * @param name recipient`s Name
 * @param sid recipient`s Army ID
 * @param custodian Custodian`s ID
 * @param location New Location
 * @returns Success Msg || Error Object
 */
export function createDocument(
  rank: string,
  name: string,
  sid: string,
  custodian: number,
  location: number
) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document")
      .insert({
        rank,
        name,
        sid,
        custodian,
        location,
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
 * Find All Documents
 * @returns Array Of All Documents || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document as d")
      .leftJoin("user as c", "c.id", "d.custodian")
      .leftJoin("user as o", "o.id", "d.officer")
      .leftJoin("user as m", "m.id", "d.manager")
      .leftJoin("location as l", "l.id", "d.location")
      .select(
        "d.id as id",
        "d.rank as rank",
        "d.name as name",
        "d.sid as sid",
        "d.custodian as custodian_id",
        "c.rank as custodian_rank",
        "c.name as custodian",
        "o.rank as officer_rank",
        "o.name as officer",
        "m.rank as manager_rank",
        "m.name as manager",
        "d.tagged as tagged",
        "d.ratified as ratified",
        "d.closed as closed",
        "d.location as location_id",
        "l.name as location",
        "d.createdAt as createdAt"
      )
      .then((documents) => {
        resolve(documents);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Specific document Without Details "Items"
 * @param id Document`s ID
 * @returns Document`s Data || Error Object
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document as d")
      .leftJoin("user as c", "c.id", "d.custodian")
      .leftJoin("user as o", "o.id", "d.officer")
      .leftJoin("user as m", "m.id", "d.manager")
      .leftJoin("location as l", "l.id", "d.location")
      .select(
        "d.id as id",
        "d.rank as rank",
        "d.name as name",
        "d.sid as sid",
        "d.custodian as custodian_id",
        "c.rank as custodian_rank",
        "c.name as custodian",
        "o.rank as officer_rank",
        "o.name as officer",
        "m.rank as manager_rank",
        "m.name as manager",
        "d.tagged as tagged",
        "d.closed as closed",
        "d.ratified as ratified",
        "d.location as location_id",
        "l.name as location",
        "d.createdAt as createdAt"
      )
      .where({ "d.id": id })
      .first()
      .then((document) => {
        resolve(document);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Document Data
 * @param id Document`s ID
 * @returns Document Data || Error Object
 */
export function findForAPIs(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document as d")
      .select("id", "tagged", "ratified", "closed", "location")
      .where({ id })
      .first()
      .then((document) => {
        resolve(document);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find All Documents Created By specific custodian
 * @param custodian Custodian`s ID
 * @returns Array Of Custodian`s Documents || Error Object
 */
export function findByCustodian(custodian: number) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document as d")
      .leftJoin("user as c", "c.id", "d.custodian")
      .leftJoin("user as o", "o.id", "d.officer")
      .leftJoin("user as m", "m.id", "d.manager")
      .leftJoin("location as l", "l.id", "d.location")
      .select(
        "d.id as id",
        "d.rank as rank",
        "d.name as name",
        "d.sid as sid",
        "d.custodian as custodian_id",
        "c.rank as custodian_rank",
        "c.name as custodian",
        "o.rank as officer_rank",
        "o.name as officer",
        "m.rank as manager_rank",
        "m.name as manager",
        "d.tagged as tagged",
        "d.ratified as ratified",
        "d.closed as closed",
        "d.location as location_id",
        "l.name as location",
        "d.createdAt as createdAt"
      )
      .where({ custodian })
      .then((documents) => {
        resolve(documents);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find All Open Documents Created By specific custodian
 * @param custodian Custodian`s ID
 * @returns Array Of Custodian`s Documents || Error Object
 */
export function findOpenByCustodian(custodian: number) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document as d")
      .leftJoin("user as c", "c.id", "d.custodian")
      .leftJoin("user as o", "o.id", "d.officer")
      .leftJoin("user as m", "m.id", "d.manager")
      .leftJoin("location as l", "l.id", "d.location")
      .select(
        "d.id as id",
        "d.rank as rank",
        "d.name as name",
        "d.sid as sid",
        "c.name as custodian",
        "o.name as officer",
        "m.name as manager",
        "d.tagged as tagged",
        "d.ratified as ratified",
        "d.closed as closed",
        "d.location as location_id",
        "l.name as location",
        "d.createdAt as createdAt"
      )
      .where({ custodian, "d.closed": false })
      .then((documents) => {
        resolve(documents);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Documents That is Ratified Or isn`t ratified
 * @param ratified Ratify Value "Ratified Or Not"
 * @returns Array Of Documents || Error Object
 */
export function findByRatify(ratified: boolean = false) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document as d")
      .leftJoin("user as c", "c.id", "d.custodian")
      .leftJoin("user as o", "o.id", "d.officer")
      .leftJoin("user as m", "m.id", "d.manager")
      .leftJoin("location as l", "l.id", "d.location")
      .select(
        "d.id as id",
        "d.rank as rank",
        "d.name as name",
        "d.sid as sid",
        "d.custodian as custodian_id",
        "c.rank as custodian_rank",
        "c.name as custodian",
        "o.rank as officer_rank",
        "o.name as officer",
        "m.rank as manager_rank",
        "m.name as manager",
        "d.tagged as tagged",
        "d.ratified as ratified",
        "d.closed as closed",
        "d.location as location_id",
        "l.name as location",
        "d.createdAt as createdAt"
      )
      .where({ ratified })
      .then((documents) => {
        
        resolve(documents);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Documents That is Tagged Or isn`t Tagged
 * @param tagged tag Value "Tagged Or Not"
 * @returns Array Of Documents || Error Object
 */
export function findByTag(tagged: boolean = false) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document as d")
      .leftJoin("user as c", "c.id", "d.custodian")
      .leftJoin("user as o", "o.id", "d.officer")
      .leftJoin("user as m", "m.id", "d.manager")
      .leftJoin("location as l", "l.id", "d.location")
      .select(
        "d.id as id",
        "d.rank as rank",
        "d.name as name",
        "d.sid as sid",
        "d.custodian as custodian_id",
        "c.rank as custodian_rank",
        "c.name as custodian",
        "o.rank as officer_rank",
        "o.name as officer",
        "m.rank as manager_rank",
        "m.name as manager",
        "d.tagged as tagged",
        "d.ratified as ratified",
        "d.closed as closed",
        "d.location as location_id",
        "l.name as location",
        "d.createdAt as createdAt"
      )
      .where({ tagged })
      .then((documents) => {
        resolve(documents);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Update Document`s Data
 * @param id Document ID
 * @param data New Data
 * @returns Operation Result || Error Object
 */
export function updateDocument(id: number, data: any) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document")
      .where({ id })
      .first()
      .update(
        data as {
          rank?: string;
          name?: string;
          sid?: string;
          location?: number;
        }
      )
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Ratify Specific Document
 * @param id Document`s ID
 * @returns Operation Result || Error Object
 */
export function ratify(id: number, user_id?: number) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document")
      .where({ id })
      .first()
      .update({ ratified: true, manager: user_id })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Tag Specific Document
 * @param id Document`s ID
 * @returns Operation Result || Error Object
 */
export function tag(id: number, user_id?: number) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document")
      .where({ id })
      .first()
      .update({ tagged: true, officer: user_id })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Remove Specific Document
 * @param id Document`s ID
 * @returns Operation Result || Error Object
 */
export function removeDocument(id: number){
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document")
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
 
/**
 * Close Document
 * @param id Document`s ID
 * @returns Operation Result || Error Object
 */
export function closeDocument(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Doucment>("document")
      .where({ id })
      .first()
      .update({ closed: true })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Add Amount "Count" of Item to Specific Document
 * @param document_id Document`s ID
 * @param item_id Item`s ID
 * @param quantity Amount Of The Item That will change
 * @returns Operation Result || Error Object
 */
export function appendItem(
  document_id: number,
  item_id: string,
  quantity: number
) {
  return new Promise(async (resolve, reject) => {
    await db<DocumentItem>("document_item")
      .insert({
        document_id,
        item_id,
        quantity,
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
 * Find Document`s Items
 * @param id Document`s ID
 * @returns Array Of Items || Error Object
 */
export function findDetails(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<DocumentItem>("document_item as di")
      .leftJoin("item as i", "i.SID", "di.item_id")
      .leftJoin("brand as b", "i.brand_id", "b.id")
      .leftJoin("category as c", "c.id", "b.type")
      .select(
        "i.SID as SID",
        "b.name as name",
        "b.model as model",
        "i.brand_id as brand_id",
        "i.edara as edara",
        "c.name as type",
        "di.quantity as quantity",
        "i.quantity as total",
        "b.quantityType as quantityType",
        "i.addedBy as addedBy",
        "i.status as status"
      )
      .where({ "di.document_id": id })
      .then((items) => {
        resolve(items);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Get Document`s Items Count
 * @param id Document`s ID
 * @returns Count Number || Error Object
 */
export function countItems(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<DocumentItem>("document_item")
      .count('item_id as count')
      .where({ document_id: id })
      .first()
      .then((count) => {
        resolve(count);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Remove Item From Specific Document
 * @param document_id Document`s ID
 * @param item_id Item`s ID
 * @returns Operation Result || Error Object
 */
export function popItem(document_id: number, item_id: string) {
  return new Promise(async (resolve, reject) => {
    await db<DocumentItem>("document_item")
      .where({ document_id, item_id })
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
