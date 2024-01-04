import { TAccount } from 'database/types';

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

export const groupAccountDataByValue = (
  data: TAccount[],
  sortKey?: 'accountName' | 'sortOrder',
) => {
  if (!data.length) return [];
  const groupedData: {
    [key: string]: {
      title: string;
      data: TAccount[];
    };
  } = {};
  data.forEach((item: TAccount) => {
    if (!groupedData[item.accountTypeId]) {
      groupedData[item.accountTypeId] = { title: '', data: [] };
    }
    groupedData[item.accountTypeId].title = item.accountTypeName;
    groupedData[item.accountTypeId].data.push(item);
  });

  // Sort data within each group by categoryName or sortOrder
  if (sortKey) {
    Object.values(groupedData).forEach(({ data }: { data: TAccount[] }) => {
      if (data && data.length > 1) {
        return data.sort(sortDataByKey(sortKey));
      }
    });
  }

  return Object.values(groupedData);
};

export function getKeyByValue(obj: Record<string, string>, value?: string): string {
  const keys = Object.keys(obj) as Array<keyof Record<string, string>>;
  for (const key of keys) {
    if (obj[key] === value) {
      return key;
    }
  }
  return '';
}

export const sortDataByKey = (property: string) => (a: any, b: any) => {
  const valueA = typeof a[property] === 'string' ? a[property].toLowerCase() : a[property];
  const valueB = typeof b[property] === 'string' ? b[property].toLowerCase() : b[property];

  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB;
  }

  return valueA.localeCompare(valueB);
};
