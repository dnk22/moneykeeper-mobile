import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import InputCalculator from 'features/AddTransaction/common/InputCalculator';
import { useCustomTheme } from 'resources/theme';

import SvgIcon from 'components/SvgIcon';
import InputField from 'components/InputField';
import FormAction from 'components/common/FormAction';
import SwitchField from 'components/Switch/SwitchField';
import RNText from 'components/Text';

import { ACCOUNT_TYPE_LIST } from 'utils/constants/account';
import { FormProvider } from 'react-hook-form';
import { AccountStackRouteProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import AccountTypeSection from './AccountTypeSection';
import BankSection from './BankSection';
import CreditCardSection from './CreditCardSection';
import useFormHooks from './hooks';
import styles from './styles';

const ACCOUNT_TYPES_WITHOUT_BANK = [ACCOUNT_TYPE_LIST[0].id, ACCOUNT_TYPE_LIST[5].id];

function AddAccount() {
  const { params } = useRoute<AccountStackRouteProps<typeof ROUTES.ADD_ACCOUNT>>();
  const { colors } = useCustomTheme();

  const { methods, onFormSubmit, isCreditCard, accountTypeId, onConfirmDeleteAccount } =
    useFormHooks(params?.accountId);

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={[styles.form, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={60}
        >
          <InputCalculator
            text={isCreditCard ? 'Hạn mức thẻ' : 'Số dư ban đầu'}
            name={isCreditCard ? 'creditCardLimit' : 'initialAmount'}
            control={methods.control}
            inputTextColor="#007FFF"
          />
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={styles.itemGroup}>
              <SvgIcon name="clipboard" style={styles.icon} />
              <View style={styles.groupContent}>
                <InputField
                  name="accountName"
                  control={methods.control}
                  placeholder="Tên tài khoản"
                  style={styles.formInput}
                  rules={{ required: true }}
                  maxLength={50}
                />
              </View>
            </View>
            <View style={styles.itemGroup}>
              <SvgIcon name="textWord" style={styles.icon} />
              <View style={styles.groupContent}>
                <InputField
                  name="descriptions"
                  control={methods.control}
                  placeholder="Ghi chú"
                  style={styles.formInput}
                  maxLength={50}
                />
              </View>
            </View>
          </View>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <AccountTypeSection
              accountTypeId={accountTypeId}
              accountWithoutBank={ACCOUNT_TYPES_WITHOUT_BANK}
            />
            {!ACCOUNT_TYPES_WITHOUT_BANK.includes(accountTypeId) && (
              <BankSection bankIdParam={params?.bankId} />
            )}
          </View>
          {isCreditCard && <CreditCardSection colors={colors} />}
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={[styles.itemGroup, styles.itemGroupBetween]}>
              <RNText preset="title">Không tính vào báo cáo</RNText>
              <SwitchField name="excludeReport" control={methods.control} />
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
        </KeyboardAwareScrollView>
      </View>
    </FormProvider>
  );
}

export default AddAccount;
