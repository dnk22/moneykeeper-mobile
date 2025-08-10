import { TRANSACTION_CATEGORY } from 'database/constants';
import { SyncQueueAction } from 'database/models/syncQueue.model';
import { queryDeleteTransactionCategoryById, syncQueueLocalQuery } from 'database/querying';
import { categoriesLocalQuery } from 'database/querying/categories';
import { categoriesFb } from 'services/firebase/db/categories';

export const updateTransactionCategory = async ({ category }: { category: any }) => {
  try {
    if (category?.id) {
      const id = category.id;
      delete category.id; // Remove id from category to avoid conflicts
      await categoriesLocalQuery.updateCategory({ id, category });

      // sync to firebase
      categoriesFb.updateCategory({ category }).catch(async () => {
        await syncQueueLocalQuery.updateSyncQueueItem({
          recordId: id,
          tableName: TRANSACTION_CATEGORY,
          payload: category,
          action: SyncQueueAction.UPDATE,
        });
      });
    } else {
      const newCategory = await categoriesLocalQuery.addCategory(category);
      // sync to firebase
      categoriesFb.addNewCategory({ category: newCategory }).catch(async () => {
        await syncQueueLocalQuery.updateSyncQueueItem({
          recordId: newCategory.id,
          tableName: TRANSACTION_CATEGORY,
          payload: newCategory,
          action: SyncQueueAction.CREATE,
        });
      });
    }
  } catch (error) {
    return { status: false, errorMessage: 'fail' };
  }
};

/** delete */
export const deleteCategoryById = async (id: string) => {
  try {
    // delete from local database
    await categoriesLocalQuery.deleteCategoryById(id);

    // sync to firebase
    categoriesFb.deleteCategoryById(id).catch(async () => {
      await syncQueueLocalQuery.updateSyncQueueItem({
        recordId: id,
        tableName: TRANSACTION_CATEGORY,
        payload: { id },
        action: SyncQueueAction.DELETE,
      });
    });
  } catch (error) {
    return { status: false, errorMessage: 'fail' };
  }
};
