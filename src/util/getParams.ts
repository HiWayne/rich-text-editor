export const getParams = (url: string) => {
  const reg = /\/[^\/]+\/?\?./;
  if (reg.test(url)) {
    const indexAfterQuerySpec = url.indexOf("?") + 1;
    const indexOfHashSpec = url.indexOf("#");
    let strOfQueryPattern = "";
    if (indexOfHashSpec !== -1 && indexOfHashSpec >= indexAfterQuerySpec) {
      strOfQueryPattern = url.slice(indexAfterQuerySpec, indexOfHashSpec);
    } else {
      strOfQueryPattern = url.slice(indexAfterQuerySpec);
    }
    const queryTupleStringArray = strOfQueryPattern.split("&");
    const params = queryTupleStringArray.reduce(
      (obj: Record<string, any>, queryTuple: string): Record<string, any> => {
        const queryTupleArray = queryTuple.split("=");
        obj[queryTupleArray[0]] = queryTupleArray[1];
        return obj;
      },
      {}
    );
    return params;
  } else {
    return {};
  }
};
