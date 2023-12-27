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

export const groupDataByValue = (data: any) => {
  if (!data.length) return [];
  const groupedData: any = {};
  data.forEach((item: TAccount) => {
    if (!groupedData[item.accountTypeId]) {
      groupedData[item.accountTypeId] = { title: '', data: [] };
    }
    groupedData[item.accountTypeId].title = item.accountTypeName;
    groupedData[item.accountTypeId].data.push(item);
  });
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

function convertDataToQuery(data: TTransactions[]) {
  // Extract unique id values from the data array
  const uniqueIds = data.map((record) => `'${record.id}'`);
  // Define the common conditions for the WHERE clause
  const commonConditions = `id IN (${uniqueIds.join(', ')})`;
  // Start building the SQL query
  let updateQuery = `UPDATE ${BALANCE} SET `;

  data.forEach((record, index) => {
    const { id, closingAmount, transactionDateAt } = record;
    // Construct the CASE statement for each record
    const caseStatement = `CASE WHEN id = ${id} THEN ${closingAmount} END`;
    // Add a comma and space after the SET if not the first record
    if (index !== 0) {
      updateQuery += ', ';
    }
    // Add the cod_user field with the CASE statement
    updateQuery += `cod_user = COALESCE(${caseStatement}, cod_user)`;
  });

  // Add the common conditions to the WHERE clause
  updateQuery += ` WHERE ${commonConditions};`;

  console.log(updateQuery);
}
