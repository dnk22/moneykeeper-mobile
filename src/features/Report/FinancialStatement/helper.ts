import { AccountTypeLogo } from 'utils/data';
import { dataLevelProps } from './types';

export function convertFinancialData(data: any, isOwnedViewType: boolean) {
  if (!data.length) return [];
  const groupedData: {
    [key: string]: dataLevelProps;
  } = {};
  data.forEach((item: any) => {
    if (!groupedData[item['accountTypeName']]) {
      groupedData[item['accountTypeName']] = { accountName: '', data: [], value: 0, logo: '' };
    }
    const value = isOwnedViewType ? item.value : Math.abs(item.value);
    groupedData[item['accountTypeName']].accountName = item['accountTypeName'];
    groupedData[item['accountTypeName']].logo = AccountTypeLogo[item.accountTypeId];
    groupedData[item['accountTypeName']].value = groupedData[item['accountTypeName']].value +=
      value || 0;
    groupedData[item['accountTypeName']].data.push(item);
  });
  return Object.values(groupedData);
}

export function convertDebtLoanData(data: any, isOwnedViewType: boolean) {
  if (!data.length) return [];
  const groupedData: {
    [key: string]: dataLevelProps;
  } = {};
  data.forEach((item: any) => {
    // filter person with amount value = 0
    if (!item.value) {
      return;
    }
    if (!groupedData[item['categoryName']]) {
      groupedData[item['categoryName']] = { accountName: '', data: [], value: 0, logo: '' };
    }
    groupedData[item['categoryName']].accountName = item['categoryName'];
    groupedData[item['categoryName']].logo = isOwnedViewType ? 'lend' : 'borrowed';
    groupedData[item['categoryName']].value = groupedData[item['categoryName']].value +=
      Math.abs(item?.value) || 0;
    groupedData[item['categoryName']].data.push({ ...item, value: Math.abs(item?.value) });
  });
  return Object.values(groupedData);
}
