// src/database/local/SyncQueueLocalDataSource.ts

import { database } from 'database/index';
import { SYNC_QUEUE } from 'database/constants';
import SyncQueueModel, { TSyncQueue } from 'database/models/syncQueue.model';
import { Q } from '@nozbe/watermelondb';

export class SyncQueueLocalDataSource {
  private static instance: SyncQueueLocalDataSource;
  private syncQueueCollection = database.collections.get<SyncQueueModel>(SYNC_QUEUE);

  private constructor() {}

  public static getInstance(): SyncQueueLocalDataSource {
    if (!SyncQueueLocalDataSource.instance) {
      SyncQueueLocalDataSource.instance = new SyncQueueLocalDataSource();
    }
    return SyncQueueLocalDataSource.instance;
  }

  /**
   * Cập nhật trạng thái của một mục trong hàng đợi đồng bộ.
   */
  public async updateSyncQueueItem(itemData: TSyncQueue): Promise<SyncQueueModel | any> {
    const dataConverted = {
      ...itemData,
      payload: JSON.stringify(itemData.payload),
    };
    return await database.write(async () => {
      // Tìm mục sync queue dựa trên recordId và tableName
      const itemsToUpdate = await this.syncQueueCollection
        .query(Q.where('recordId', itemData.recordId), Q.where('tableName', itemData.tableName))
        .fetch();

      // Có thì update, không thì tạo mới
      if (itemsToUpdate.length > 0) {
        const itemToUpdate = itemsToUpdate[0];
        await itemToUpdate.update((item) => {
          Object.assign(item, dataConverted);
        });
        return itemToUpdate;
      } else {
        const newItem = await this.syncQueueCollection.create((item) => {
          Object.assign(item, dataConverted);
        });
        return newItem;
      }
    });
  }

  /**
   * Xóa một mục khỏi hàng đợi đồng bộ (sau khi đã đồng bộ thành công).
   */
  public async removeSyncQueueItem(itemId: string): Promise<void> {
    return await database.write(async () => {
      const itemToDelete = await this.syncQueueCollection.find(itemId);
      await itemToDelete.destroyPermanently(); // Xóa vĩnh viễn khỏi DB
    });
  }

  /**
   * Lấy một mục theo ID.
   */
  public async getSyncQueueItemById(itemId: string): Promise<SyncQueueModel | null> {
    try {
      return await database.read(async () => {
        return await this.syncQueueCollection.find(itemId);
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Xóa tất cả các mục trong hàng đợi đồng bộ.
   */
  public async clearAllSyncQueueItems(): Promise<void> {
    await database.write(async () => {
      await this.syncQueueCollection.query().destroyAllPermanently();
    });
  }
}

export const syncQueueLocalQuery = SyncQueueLocalDataSource.getInstance();
