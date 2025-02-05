/** read  */
import { getBanksDataLocal, importDefaultBanksData, queryGetBankById } from 'database/querying';
import { TSearchBankParams } from 'utils/types/request.type';

export async function fetchBankData({ type, text }: TSearchBankParams) {
  const res = await getBanksDataLocal({ type, text });
  if (res) {
    return res;
  } else {
    return [];
  }
}

export async function getBankById(id: string) {
  return await queryGetBankById(id);
}
