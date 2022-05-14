import { get, post, Delete } from "./request";

export const getDocDetail = get("http://localhost:3001/api/doc/detail");

export const updateDoc = post("http://localhost:3001/api/doc/update");

export const createDoc = post("http://localhost:3001/api/doc/create");

export const setPermissionToDoc = post(
  "http://localhost:3001/api/doc/set/permission"
);

export const checkPermission = get("http://localhost:3001/api/doc/check");

export const getDocList = get("http://localhost:3001/api/doc/list");

export const deleteDoc = Delete("http://localhost:3001/api/doc/delete");
