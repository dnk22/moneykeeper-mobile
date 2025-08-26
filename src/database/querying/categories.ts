import { database } from 'database/index';
import CategoriesModel from 'database/models/transactionCategory.model';
import { TRANSACTION_CATEGORY } from 'database/constants';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_LEND_BORROW_NAME } from 'utils/constants';
import { Q } from '@nozbe/watermelondb';
import { CategoriesDataDefault } from 'utils/data/transactionCategory.default';
import { SQLiteQuery } from '@nozbe/watermelondb/adapters/sqlite';

export class CategoriesLocalData {
  private static instance: CategoriesLocalData;

  private categoriesCollection =
    database.collections.get<CategoriesModel>(TRANSACTION_CATEGORY);

  private constructor() {}

  public static getInstance(): CategoriesLocalData {
    if (!CategoriesLocalData.instance) {
      CategoriesLocalData.instance = new CategoriesLocalData();
    }
    return CategoriesLocalData.instance;
  }

  private throwError(code: string, message?: string): never {
    throw new Error(message || `Transaction category operation failed: ${code}`);
  }

  /**
   * Truy vấn các danh mục cho vay/mượn
   * @returns Promise chứa danh sách các danh mục cho vay/mượn
   */
  public async getLendBorrowData() {
    try {
      return await database.read(async () => {
        return this.categoriesCollection
          .query(Q.where('categoryName', Q.oneOf(Object.values(TRANSACTION_LEND_BORROW_NAME))))
          .unsafeFetchRaw();
      });
    } catch (error) {
      this.throwError('GET-LEND-BORROW', 'Failed to get lend/borrow categories');
    }
  }

  /**
   * Truy vấn danh mục thu/chi từ database
   * @param options - Các tùy chọn truy vấn
   * @param options.type - Loại danh mục (thu/chi - EXPENSE/INCOME)
   * @returns Promise chứa danh sách các danh mục theo loại, không bao gồm các danh mục cho vay/mượn
   * @throws Error khi không thể truy vấn dữ liệu
   */
  public async getExpenseIncome({ type }: { type: TRANSACTION_CATEGORY_TYPE }) {
    const lendBorrow = Object.values(TRANSACTION_LEND_BORROW_NAME).map((item) => `"${item}"`);
    const query = `SELECT id, categoryName, categoryType, parentId, dictionaryKey, icon, isSystem, sortOrder 
      FROM ${TRANSACTION_CATEGORY}
      WHERE _status!='deleted' AND categoryType=${type} AND categoryName NOT IN (${lendBorrow})`;
    try {
      return await database.read(async () => {
        return await this.categoriesCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
      });
    } catch (error) {
      this.throwError('GET-EXP-INC', 'Failed to get expense/income categories');
    }
  }

  /**
   * Truy vấn thông tin một danh mục theo ID
   * @param id - ID của danh mục cần truy vấn
   * @returns Promise chứa thông tin danh mục hoặc object rỗng nếu không tìm thấy
   */
  public async getCategoryById(id: string) {
    try {
      const query = `SELECT * FROM ${TRANSACTION_CATEGORY} WHERE id='${id}' AND _status != 'deleted'`;
      return await database.read(async () => {
        const res = await this.categoriesCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
        return res[0] || {};
      });
    } catch (error) {
      console.log(error, 'fetch getCategoryById err');
      return null;
    }
  }

  /**
   * Truy vấn danh sách danh mục cha
   * @param type - Loại danh mục cần truy vấn
   * @returns Promise chứa danh sách các danh mục cha
   */
  public async getParentCategoryList(type: TRANSACTION_CATEGORY_TYPE) {
    return await database.read(async () => {
      return await this.categoriesCollection
        .query(
          Q.and(
            Q.where('parentId', Q.eq(null)),
            Q.where('categoryType', type),
            Q.where('_status', Q.notEq('deleted')),
            Q.where(
              'categoryName',
              Q.notIn(Object.values(TRANSACTION_LEND_BORROW_NAME).map((item) => `"${item}"`)),
            ),
          ),
        )
        .unsafeFetchRaw();
    });
  }

  /**
   * Truy vấn danh mục được sử dụng nhiều nhất hoặc gần đây nhất
   * @param options - Các tùy chọn truy vấn
   * @param options.categoryType - Loại danh mục
   * @param options.column - Cột để sắp xếp (lastUseAt hoặc useCount)
   * @returns Promise chứa danh sách các danh mục
   */
  public async getMostUsedOrRecentCategories({
    categoryType,
    column,
  }: {
    categoryType: TRANSACTION_CATEGORY_TYPE;
    column: 'lastUseAt' | 'useCount';
  }) {
    try {
      return await database.read(async () => {
        return await this.categoriesCollection
          .query(
            Q.and(
              Q.where('_status', Q.notEq('deleted')),
              Q.where('categoryType', categoryType),
              Q.where(column, Q.notEq(column === 'lastUseAt' ? null : 0)),
              Q.where('categoryName', Q.notIn(Object.values(TRANSACTION_LEND_BORROW_NAME))),
            ),
            Q.take(10),
            Q.sortBy(column, Q.desc),
          )
          .fetch();
      });
    } catch (error) {
      this.throwError('GET-MOST-USED', 'Failed to get most used categories');
    }
  }

  /**
   * Thêm một danh mục mới
   * @param category - Dữ liệu danh mục cần thêm
   * @returns Promise chứa danh mục mới được tạo
   */
  public async addCategory(category: TTransactionsCategory) {
    try {
      return await database.write(async () => {
        const res = await this.categoriesCollection.create((item) => {
          Object.assign(item, category);
        });
        return res._raw;
      });
    } catch (error) {
      this.throwError('ADD-CAT', 'Failed to add category');
    }
  }

  /**
   * Cập nhật thông tin một danh mục
   * @param id - ID của danh mục cần cập nhật
   * @param category - Dữ liệu cần cập nhật
   */
  public async updateCategory({ id, category }: { id: string; category: TTransactionsCategory }) {
    try {
      await database.write(async () => {
        const categoryCollection = await this.categoriesCollection.find(id);
        await categoryCollection.update((item) => {
          Object.assign(item, category);
        });
      });
    } catch (error) {
      this.throwError('UPDATE-CAT', 'Failed to update category');
    }
  }

  /**
   * Cập nhật số lần sử dụng của danh mục
   * @param id - ID của danh mục cần cập nhật
   */
  public async updateCategoryUseCount(id: string) {
    try {
      const date = new Date();
      return await database.write(async () => {
        const category = await this.categoriesCollection.find(id);
        return await category.update((item) => {
          item.useCount = item.useCount + 1;
          item.lastUseAt = date.getTime();
        });
      });
    } catch (error) {
      this.throwError('UPDATE-USE-COUNT', 'Failed to update category use count');
    }
  }

  /**
   * Xóa một danh mục và các danh mục con của nó
   * @param id - ID của danh mục cần xóa
   * @returns Promise chứa kết quả xóa
   */
  /**
   * Xóa một danh mục và tất cả các danh mục con của nó
   * Thao tác này sẽ xóa cả danh mục cha được chỉ định và toàn bộ danh mục con liên quan
   * @param id - ID của danh mục cha cần xóa
   * @returns Promise chứa kết quả xóa với cấu trúc:
   *          - status: boolean - true nếu xóa thành công
   *          - message: string - thông báo kết quả hoặc lỗi nếu có
   */
  public async deleteCategoryById(id: string) {
    return await database.write(async () => {
      // Tìm danh mục cha
      const parentCategory = await this.categoriesCollection.find(id);

      // Tìm tất cả danh mục con
      const childCategories = await this.categoriesCollection
        .query(Q.where('parentId', id))
        .fetch();

      if (childCategories.length > 0) {
        // Xóa tất cả danh mục con
        for (const category of childCategories) {
          await category.markAsDeleted();
        }
      }

      // Xóa danh mục cha
      return await parentCategory.markAsDeleted();
    });
  }
}

export const categoriesLocalQuery = CategoriesLocalData.getInstance();
