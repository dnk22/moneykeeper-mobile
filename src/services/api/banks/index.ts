/** read  */
import { TSearchBankParams } from 'utils/types';
import { getBanksDataLocal } from 'database/querying';

export async function fetchBankData({ type, text }: TSearchBankParams) {
  const res = await getBanksDataLocal({ type, text });
  if (res) {
    return res;
  } else {
    return [];
  }
}
