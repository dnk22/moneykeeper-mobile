import { ACCOUNT_TYPE_LIST } from 'utils/constants/account';
import { dataLevelProps } from './types';

export function convertFinancialData(data: any, isOwnedViewType: boolean) {
  if (!data.length) return [];
  const groupedData: {
    [key: string]: dataLevelProps;
  } = {};
  data.forEach((item: any) => {
    const accountTypeName = ACCOUNT_TYPE_LIST[item.accountTypeId].name;
    if (!groupedData[accountTypeName]) {
      groupedData[accountTypeName] = { accountName: '', data: [], value: 0, logo: '' };
    }
    const value = isOwnedViewType ? item.value : Math.abs(item.value);
    groupedData[accountTypeName].accountName = accountTypeName;
    groupedData[accountTypeName].logo = item.accountTypeId;
    groupedData[accountTypeName].value = groupedData[accountTypeName].value += value || 0;
    groupedData[accountTypeName].data.push(item);
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
