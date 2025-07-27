import { banksLocalQuery } from 'database/querying/banks';
import { TBank } from 'database/types';
import { ApiResponse } from 'services/axios';
import { showToast } from 'utils/system';
import { TSearchBankParams } from 'utils/types/request.type';

export async function fetchBankList(
  payload: TSearchBankParams = {},
): Promise<ApiResponse<TBank[]>> {
  try {
    return {
      status: 200,
      data: await banksLocalQuery.getAllBanks(payload),
    };
  } catch (error) {
    showToast({
      type: 'error',
      text2: 'Có lỗi xảy ra',
    });
    return {
      status: 200,
      data: [],
    };
  }
}
