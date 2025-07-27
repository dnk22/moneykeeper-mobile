import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { SYNC_QUEUE } from 'database/constants';

export enum SyncQueueAction {
  CREATE,
  UPDATE,
  DELETE,
}

export type TSyncQueue = {
  recordId: string;
  tableName: string;
  payload?: any;
  action?: SyncQueueAction;
};

export default class SyncQueueModel extends Model {
  static table = SYNC_QUEUE;

  @field('recordId') recordId!: string;
  @field('tableName') tableName!: string;
  @field('payload') payload!: string;
  @field('action') action!: number;
}
