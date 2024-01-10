import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {
  BottomSheet,
  Empty,
  PressableHaptic,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { ACCOUNT_CREDIT_CARD_DETAIL, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { AccountStackParamListProps } from 'navigation/types';
import { ButtonText, TransactionListByAccountConfig } from 'navigation/elements';
import { formatDateLocal } from 'utils/date';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { queryGetAllStatement } from 'database/querying';
import { useAppSelector } from 'store/index';
import { selectAccountStatementList } from 'store/account/account.selector';
import { addStatementDates } from 'utils/algorithm';
import Summary from './Summary';
import TransactionList from './TransactionList';
import styles from './styles';

function CreditCardAccount() {
  const { colors } = useCustomTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_CREDIT_CARD_DETAIL>['navigation']>();
  const { params } =
    useRoute<AccountStackParamListProps<typeof ACCOUNT_CREDIT_CARD_DETAIL>['route']>();
  const statementList = useAppSelector((state) => selectAccountStatementList(state));
  const [viewStatementList, setViewStatementList] = useState<any>([
    { month: false },
    ...addStatementDates([{ month: new Date() }], statementList[params.accountId]),
  ]);
  const [viewMonth, setViewMonth] = useState<any>(viewStatementList[0]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Use `setOptions` to update the button that submit form
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isSelectMode ? (
          <ButtonText title="Xóa" onPress={onHandleDeleteMultiTransaction} />
        ) : (
          <TransactionListByAccountConfig onPressSelectMode={onHandleSelectMode} />
        ),
    });
  }, [isSelectMode]);

  const getAllStatements = () => {
    queryGetAllStatement({ accountId: params.accountId }).then((res) => {
      if (res.length) {
        const convertDataToRangeDate = addStatementDates(res, statementList[params.accountId]);
        setViewStatementList([{ month: false }, ...convertDataToRangeDate]);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      getAllStatements();
    }, []),
  );

  const onSelectStatement = (value) => {
    setViewMonth(value);
  };

  const keyExtractor = useCallback((item: any) => item['month'], []);

  const renderItem = ({ item }: { item: { month: string } }) => {
    return (
      <TouchableHighlightComponent
        onPress={() => {
          onSelectStatement(item);
          bottomSheetModalRef?.current.close();
        }}
      >
        <View style={styles.itemStatement}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <RNText fontSize={18} style={{ textTransform: 'capitalize' }}>
              {item.month ? formatDateLocal(item.month, 'MMMM, yyyy') : 'Xem tất cả'}
            </RNText>
            {item.month === viewMonth.month && (
              <RNText style={{ textTransform: 'capitalize' }} color={colors.primary}>
                (Hiện tại)
              </RNText>
            )}
          </View>
          <SvgIcon name="forward" preset="forwardLink" />
        </View>
      </TouchableHighlightComponent>
    );
  };

  const onHandleDeleteMultiTransaction = () => {};

  const onHandleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
  };

  const handleOnCreateTransaction = () => {
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, { accountId: params?.accountId });
  };

  return (
    <View style={styles.container}>
      <PressableHaptic
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={handleOnCreateTransaction}
      >
        <SvgIcon name="add" size={30} color="white" />
      </PressableHaptic>
      <Summary accountId={params.accountId} creditCardLimit={params.creditCardLimit} />
      <View style={styles.viewByMonth}>
        <RNText fontSize={18} style={{ textTransform: 'capitalize', fontWeight: '500' }}>
          {viewMonth.month ? formatDateLocal(viewMonth.month, 'MMMM, yyyy') : 'Tất cả bản ghi'}
        </RNText>
        <PressableHaptic onPress={() => bottomSheetModalRef?.current.present()}>
          <RNText color={colors.primary}>Xem sao kê khác</RNText>
        </PressableHaptic>
      </View>
      <TransactionList accountId={params.accountId} monthData={viewMonth} />
      <BottomSheet ref={bottomSheetModalRef}>
        <BottomSheetFlatList
          data={viewStatementList}
          initialNumToRender={8}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<Empty text="Chưa có kỳ sao kê nào!" />}
          ItemSeparatorComponent={({ highlighted }) => (
            <View
              style={[
                { height: 0.8, width: '90%', backgroundColor: colors.divider, alignSelf: 'center' },
                highlighted,
              ]}
            />
          )}
        />
      </BottomSheet>
    </View>
  );
}
export default CreditCardAccount;
