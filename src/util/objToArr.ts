type Obj = Record<string, any>;

export const objToArray = (obj: Obj) => {
  if (Array.isArray(obj)) {
    return obj;
  }
  const data_array: Partial<Obj>[] = [];
  if (obj && typeof obj === "object") {
    Object.keys(obj).map((item) => {
      const stashObj: Partial<Obj> = {};
      stashObj[item] = obj[item];
      data_array.push(stashObj);
    });
  }
  return data_array;
};
