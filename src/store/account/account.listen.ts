import { TAccount } from 'src/types/models';
import { isPassedDate } from 'utils/date';
import { PayloadAction } from '@reduxjs/toolkit';
import { createTriggerNotification } from 'share/notifications';

export async function onAddOrUpdateCountDown({ payload }: PayloadAction<TAccount>) {}
