import React from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useCustomTheme } from 'resources/theme';

import InputField from 'components/InputField';
import FormAction from 'components/common/FormAction';
import SwitchField from 'components/Switch/SwitchField';
import RNText from 'components/Text';
import InputCalculator from 'components/InputCalculator';
import { Autobrightness, Stickynote } from 'iconsax-react-native';

import { ACCOUNT_CATEGORY_ID } from 'utils/constants/account';
import { FormProvider } from 'react-hook-form';
import { AccountParamListProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import AccountTypeSection from './AccountTypeSection';
import BankSection from './BankSection';
import CreditCardSection from './CreditCardSection';
import useFormHooks from './hooks';
import styles from './styles';

const ACCOUNT_TYPES_NOT_BANK = [ACCOUNT_CATEGORY_ID.MONEY];

function AddAccount() {
  const { params } = useRoute<AccountParamListProps<typeof ROUTES.ADD_ACCOUNT>['route']>();
  const { colors } = useCustomTheme();

  const { methods, onFormSubmit, isCreditCard, accountTypeId, onConfirmDeleteAccount } =
    useFormHooks({
      accountId: params?.accountId,
      accountTypeIdParam: params?.accountTypeId,
    });

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <InputCalculator
          text={isCreditCard ? 'Hạn mức thẻ' : 'Số dư ban đầu'}
          name="initialAmount"
          inputTextColor="#007FFF"
          autoFocus
        />
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={styles.itemGroup}>
            <Autobrightness size="22" color={colors.text} style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="accountName"
                placeholder="Tên tài khoản"
                style={styles.formInput}
                rules={{ required: true }}
                maxLength={50}
              />
            </View>
          </View>
          <View style={styles.itemGroup}>
            <Stickynote size="22" color={colors.text} style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="descriptions"
                placeholder="Ghi chú"
                style={styles.formInput}
                maxLength={50}
              />
            </View>
          </View>
        </View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <AccountTypeSection accountTypeId={accountTypeId} />
          {!ACCOUNT_TYPES_NOT_BANK.includes(accountTypeId) && (
            <BankSection bankIdParam={params?.bankId} />
          )}
        </View>
        {isCreditCard && <CreditCardSection colors={colors} />}
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText preset="title">Không tính vào báo cáo</RNText>
            <SwitchField name="excludeReport" />
          </View>
          <RNText fontSize={12} style={styles.subText}>
            Ghi chép này sẽ không thống kê vào các báo cáo.
          </RNText>
        </View>
        <FormAction
          isShowDelete={!!params?.accountId}
          onSubmit={onFormSubmit}
          onDelete={onConfirmDeleteAccount}
        />
        <View style={{ height: 100 }} />
      </View>
    </FormProvider>
  );
}

export default AddAccount;
