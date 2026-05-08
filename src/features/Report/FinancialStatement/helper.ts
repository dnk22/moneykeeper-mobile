import { getAccountTypeById } from 'utils/constants/account';
import { dataLevelProps } from './types';

export function convertFinancialData(data: any, isOwnedViewType: boolean) {
  if (!data.length) return [];
  const groupedData: {
    [key: string]: dataLevelProps;
  } = {};
  (data || []).forEach((item: any) => {
    const accountType = getAccountTypeById(item.accountTypeId);

    if (!groupedData[accountType.name]) {
      groupedData[accountType.name] = { accountName: '', data: [], value: 0, logo: '' };
    }
    const value = isOwnedViewType ? item.value : Math.abs(item.value);
    groupedData[accountType.name].accountName = accountType.name;
    groupedData[accountType.name].logo = accountType.icon;
    groupedData[accountType.name].value = groupedData[accountType.name].value += value || 0;
    groupedData[accountType.name].data.push(item);
  });
  return Object.values(groupedData);
}

export function convertDebtLoanData(data: any, isOwnedViewType: boolean) {
  if (!data.length) return [];
  const groupedData: {
    [key: string]: dataLevelProps;
  } = {};
  (data || []).forEach((item: any) => {
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
