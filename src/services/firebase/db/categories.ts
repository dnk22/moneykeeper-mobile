// src/services/user/Categories.ts
import { FB_PATH } from '../config';
import { FirebaseResponse } from '../types';
import { databaseService } from '../services/database';
import { convertDataToFb } from 'utils/algorithm';
import { TTransactionsCategory } from 'database/types';
import { CategoriesDataDefault } from 'utils/data/transactionCategory.default';

export class Categories {
  private static instance: Categories;

  private constructor() {}

  public static getInstance(): Categories {
    if (!Categories.instance) {
      Categories.instance = new Categories();
    }
    return Categories.instance;
  }

  public async addNewCategory({
    category,
  }: {
    category: Partial<TTransactionsCategory>;
  }): Promise<FirebaseResponse<void>> {
    const updatedCategory = convertDataToFb(category);
    return await databaseService.set(`${FB_PATH.CATEGORIES}/${category.id}`, updatedCategory);
  }

  public async updateCategory({
    category,
  }: {
    category: Partial<TTransactionsCategory>;
  }): Promise<FirebaseResponse<void>> {
    const updatedCategory = convertDataToFb(category);
    return await databaseService.update(`${FB_PATH.CATEGORIES}/${category.id}`, updatedCategory);
  }

  public async deleteCategoryById(categoryId: string): Promise<FirebaseResponse<void>> {
    return await databaseService.remove(`${FB_PATH.CATEGORIES}/${categoryId}`);
  }

  public async setInitCategories(): Promise<FirebaseResponse<void>> {
    return await databaseService.set(FB_PATH.CATEGORIES, CategoriesDataDefault);
  }
}

export const categoriesFb = Categories.getInstance();
