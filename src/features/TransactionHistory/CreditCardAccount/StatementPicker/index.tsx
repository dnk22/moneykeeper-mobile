import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  BottomSheet,
  Empty,
  PressableHaptic,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { formatDateLocal } from 'utils/date';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { queryUniqueTransactionDates } from 'database/querying';
import { generateMonthlyStatements } from 'utils/algorithm';
import { StatementViewProps } from 'utils/types';
import { TransactionHistoryContext } from '../context';
import styles from '../styles';

type StatementPickerProps = {
  onChange: (statement: StatementViewProps) => void;
};
const defaultStatement = {
  month: undefined,
};

function StatementPicker({ onChange }: StatementPickerProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>();
  const { colors, accountId, statementInfo, refreshData } = useContext(TransactionHistoryContext);
  const [viewStatementList, setViewStatementList] = useState<StatementViewProps[]>([
    defaultStatement,
  ]);
  const [viewMonth, setViewMonth] = useState<StatementViewProps>(defaultStatement);

  const getAllStatements = () => {
    queryUniqueTransactionDates(accountId).then((res) => {
      if (res.length) {
        const convertDataToRangeDate = generateMonthlyStatements(
          res,
          statementInfo.statementDate,
        );
        setViewStatementList([defaultStatement, ...convertDataToRangeDate]);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      getAllStatements();
    }, [refreshData]),
  );

  useEffect(() => {
    onChange(viewMonth);
  }, [viewMonth]);

  const onSelectStatement = (value: StatementViewProps) => {
    setViewMonth(value);
  };

  const keyExtractor = useCallback((item: StatementViewProps, index: number) => index, []);

  const renderItemStatement = ({ item }: { item: StatementViewProps }) => {
    const isItemAll = !item.month;
    return (
      <TouchableHighlightComponent
        onPress={() => {
          onSelectStatement(item);
          bottomSheetModalRef?.current.close();
        }}
      >
        <View style={styles.itemStatement}>
          <View style={styles.itemStatementMonth}>
            <RNText
              fontSize={isItemAll ? 16 : 14}
              style={{
                textTransform: 'capitalize',
                fontWeight: isItemAll ? '500' : 'normal',
              }}
              color={item.month === viewMonth.month ? colors.primary : colors.text}
            >
              {!isItemAll ? formatDateLocal(item.month, 'MMMM, yyyy') : 'Xem tất cả lịch sử'}
            </RNText>
          </View>
          <SvgIcon name="forward" preset="forwardLink" />
        </View>
      </TouchableHighlightComponent>
    );
  };

  return (
    <>
      <View style={styles.viewByMonth}>
        {Object.keys(viewMonth).length > 0 && (
          <View>
            <RNText fontSize={17} style={{ textTransform: 'capitalize', fontWeight: '500' }}>
              {viewMonth.month
                ? formatDateLocal(viewMonth.month, 'MMMM, yyyy')
                : 'Tất cả lịch sử'}
            </RNText>
            {viewMonth.month && (
              <RNText fontSize={10} style={{ fontStyle: 'italic' }} color="gray">
                {`(${formatDateLocal(viewMonth.startDate, 'dd/MM/yyyy')} - ${formatDateLocal(
                  viewMonth.endDate,
                  'dd/MM/yyyy',
                )})`}
              </RNText>
            )}
          </View>
        )}
        <PressableHaptic
          style={[styles.otherStatement, { backgroundColor: colors.primary }]}
          onPress={() => bottomSheetModalRef?.current.present()}
        >
          <RNText color="white">Xem sao kê</RNText>
        </PressableHaptic>
      </View>
      <BottomSheet ref={bottomSheetModalRef}>
        <BottomSheetFlatList
          data={viewStatementList}
          initialNumToRender={8}
          renderItem={renderItemStatement}
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
    </>
  );
}
export default StatementPicker;
