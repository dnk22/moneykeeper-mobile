import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';
import { BankModel } from 'database/models';
import { BANKS } from 'database/constants';
import { BANK_TYPE } from 'utils/constants/account';

export class BanksLocalDataSource {
  private static instance: BanksLocalDataSource;
  
  private banksCollection = database.collections.get<BankModel>(BANKS);

  private constructor() {}

  /**
   * Lấy instance duy nhất của class (Singleton pattern)
   * @returns Instance của BanksLocalDataSource
   */
  public static getInstance(): BanksLocalDataSource {
    if (!BanksLocalDataSource.instance) {
      BanksLocalDataSource.instance = new BanksLocalDataSource();
    }
    return BanksLocalDataSource.instance;
  }

  /**
   * Truy vấn danh sách ngân hàng với bộ lọc
   * @param options - Các tùy chọn truy vấn
   * @param options.type - Loại ngân hàng (mặc định là BANK_TYPE.BANK)
   * @param options.text - Từ khóa tìm kiếm (tìm theo tên, mã ngân hàng)
   * @returns Promise chứa danh sách ngân hàng thỏa mãn điều kiện
   * 
   * Phương thức này sẽ:
   * 1. Tạo query cơ bản theo loại ngân hàng
   * 2. Nếu có text tìm kiếm, thêm điều kiện tìm theo shortName, bankCode, bankName
   * 3. Trả về kết quả dạng raw data
   */
  public async getAllBanks({
    type = BANK_TYPE.BANK,
    text = '',
  }: {
    type?: BANK_TYPE;
    text?: string;
  }) {
    return await database.read(async () => {
      const baseQuery = Q.where('type', type.toString());

      if (!type && !text) {
        return await this.banksCollection.query().unsafeFetchRaw();
      }

      if (!text.trim()) {
        return await this.banksCollection.query(baseQuery).unsafeFetchRaw();
      }

      const searchText = Q.sanitizeLikeString(text);
      return await this.banksCollection
        .query(
          baseQuery,
          Q.or(
            Q.where('shortName', Q.like(`${searchText}%`)),
            Q.where('bankCode', Q.like(`${searchText}%`)),
            Q.where('bankName', Q.like(`${searchText}%`)),
          ),
        )
        .unsafeFetchRaw();
    });
  }

  /**
   * Kiểm tra xem có dữ liệu ngân hàng trong database hay không
   * @returns Promise chứa số lượng bản ghi ngân hàng hoặc undefined nếu có lỗi
   * 
   * Phương thức này sẽ:
   * 1. Đếm số lượng bản ghi trong bảng Banks
   * 2. Log lỗi nếu có và trả về undefined
   */
  public async isBankDataExist() {
    try {
      return await database.read(async () => {
        return await this.banksCollection.query().fetchCount();
      });
    } catch (error) {
      console.log(error, 'get bank count exist err');
    }
  }

  /**
   * Truy vấn thông tin một ngân hàng theo ID
   * @param id - ID của ngân hàng cần truy vấn
   * @returns Promise chứa thông tin ngân hàng
   * 
   * Phương thức này sẽ:
   * 1. Tìm và trả về ngân hàng theo ID
   * 2. Trả về undefined nếu không tìm thấy
   */
  public async getBankById(id: string) {
    return await database.read(async () => {
      return await this.banksCollection.find(id);
    });
  }
}

export const banksLocalQuery = BanksLocalDataSource.getInstance();

