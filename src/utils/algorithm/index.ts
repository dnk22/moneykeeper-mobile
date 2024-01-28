import { TAccount, TTransactions } from 'database/types';
import { GroupedTransactionProps, StatementViewProps } from 'utils/types';

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

export function addStatementDates(data: { month: Date | string }[], statementDay: number) {
  return data.map((item) => {
    const endDate = new Date(new Date(item.month).setDate(statementDay));
    const startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - 1);
    return { ...item, startDate, endDate };
  });
}

export function generateMonthlyStatements(
  referenceDates: { date: string }[],
  statementDay: number,
): StatementViewProps[] {
  const months: number[] = [];
  const latestStatementMonth = new Date();
  latestStatementMonth.setDate(statementDay);
  latestStatementMonth.setHours(23, 59, 59, 999);

  /** get all month available */
  referenceDates.forEach((item) => {
    const statementDayOfMonth = new Date(item.date);
    statementDayOfMonth.setDate(statementDay);
    statementDayOfMonth.setHours(23, 59, 59, 999);
    if (new Date(item.date).getTime() <= new Date(statementDayOfMonth).getTime()) {
      months.push(statementDayOfMonth.getTime());
    } else {
      statementDayOfMonth.setMonth(statementDayOfMonth.getMonth() + 1);
      months.push(statementDayOfMonth.getTime());
    }
  });

  /** remove duplicate */
  const uniqueMonths = Array.from(
    new Set(months.filter((item) => item <= latestStatementMonth.getTime())),
  );
  return uniqueMonths.map((month) => {
    /** get start Date */
    const startDate = new Date(month);
    startDate.setMonth(new Date(month).getMonth() - 1);
    startDate.setDate(new Date(startDate).getDate() + 1);
    return {
      startDate: new Date(startDate),
      month: new Date(month),
      endDate: new Date(month),
    };
  });
}

export function groupTransactionsByDay(data: TTransactions[]): GroupedTransactionProps[] {
  const groupedData: GroupedTransactionProps[] = [];

  data.forEach((item) => {
    const date = new Date(item.dateTimeAt);
    const day = date.toISOString().split('T')[0];

    // Find the index of the existing date in the result array
    const index = groupedData.findIndex((group) => group.date === day);

    // If the date is not found, add a new object with the date and an empty data array
    if (index === -1) {
      groupedData.push({ date: day, data: [] });
    }

    // Push the item to the corresponding data array
    groupedData.find((group) => group.date === day)?.data.push(item);
  });

  return groupedData;
}
