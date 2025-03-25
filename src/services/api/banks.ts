/** read  */
import { queryGetAllBank } from 'database/querying';
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
      data: await queryGetAllBank(payload),
    };
  } catch (error) {
    showToast({
      type: 'info',
    });
    return {
      status: 200,
      data: [],
    };
  }
}
