/** read  */
import { TSearchBankParams } from 'utils/types';
import { getBanksDataLocal, queryGetBankById } from 'database/querying';

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
