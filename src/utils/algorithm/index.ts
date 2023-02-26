import { TAccount } from 'database/types/index';

/**
 * Find object in array with @param
 * Return value, if @param id is valid string
 *
 * @param id is string
 */

export function findObjectInArrayById(array: any, id: string) {
  const idIndex = array.map((x) => x.id).indexOf(id);
  return {
    idx: idIndex,
    value: array[idIndex],
  };
}

/**
 * merge deep object with @target and @source
 * Return new object
 */

export const deepMerge = (target: any, source: any): any => {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        if (Array.isArray(source[key])) {
          target[key] = [...(target[key] || []), ...source[key]];
        } else {
          target[key] = deepMerge(target[key] || {}, source[key]);
        }
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
};

export const groupDataByValue = (data: TAccount[]) => {
  if (!data.length) return [];
  const groupedData: any = {};
  data.forEach((item) => {
    if (!groupedData[item.account_type]) {
      groupedData[item.account_type] = { title: '', data: [] };
    }
    groupedData[item.account_type].title = item.account_type_details?.name;
    groupedData[item.account_type].data.push(item);
  });
  return Object.values(groupedData);
};
