import { createAsyncThunk } from '@reduxjs/toolkit';
import { FB_PATH } from 'services/firebase/config';
import { appSettingsFb } from 'services/firebase/db/appSettings';
import { TSettings } from 'utils/types/store.type';

// TODO: add sync queue
export const updateCategoriesConfig = createAsyncThunk(
  'categories/updateConfig',
  async (config: Partial<TSettings['categories']>, thunkAPI) => {
    try {
      await appSettingsFb.updateSettings({
        path: FB_PATH.SETTINGS_CHILD.CATEGORIES,
        newSettings: config,
      });
      return config;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
