/** read  */
import { TSearchBankParams } from 'utils/types';
import { getBanksDataLocal, importDefaultBanksData, queryGetBankById } from 'database/querying';

export async function fetchBankData({ type, text }: TSearchBankParams) {
  const res = await getBanksDataLocal({ type, text });
  if (res) {
    return res;
  } else {
    return [];
  }
}

export async function importBankDataLocal() {
  return await importDefaultBanksData();
}

export async function getBankById(id: string) {
  return await queryGetBankById(id);
}
