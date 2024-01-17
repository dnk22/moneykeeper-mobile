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
import { queryTransactionLisGroupByDate } from 'database/querying';
import { generateMonthlyStatements } from 'utils/algorithm';
import { STATEMENT_TYPE, StatementViewProps } from 'utils/types';
import { isEmpty } from 'lodash';
import { TransactionHistoryContext } from '../context';
import styles from '../styles';

const defaultStatement = { type: STATEMENT_TYPE.ALL };

type StatementPickerProps = {
  onChange: (statement: StatementViewProps) => void;
};

function StatementPicker({ onChange }: StatementPickerProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>();
  const { colors, accountId, statementList, refreshData } = useContext(TransactionHistoryContext);
  const [viewStatementList, setViewStatementList] = useState<StatementViewProps[]>([
    defaultStatement,
  ]);
  const [viewMonth, setViewMonth] = useState<StatementViewProps>({});

  const getAllStatements = () => {
    queryTransactionLisGroupByDate(accountId).then((res) => {
      if (res.length) {
        const convertDataToRangeDate = generateMonthlyStatements(
          res,
          statementList[accountId].statementDate,
        );

        setViewStatementList([defaultStatement, ...convertDataToRangeDate]);
        const currentStatementIndex = convertDataToRangeDate.findIndex(
          (item) => item.type === STATEMENT_TYPE.NOW,
        );
        if (currentStatementIndex !== -1) {
          setViewMonth(convertDataToRangeDate[currentStatementIndex]);
        } else {
          setViewMonth(viewStatementList[0]);
        }
        return;
      }
      setViewStatementList([defaultStatement]);
      setViewMonth(viewStatementList[0]);
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
    const isItemAll = item.type === STATEMENT_TYPE.ALL;
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
              color={item.type === viewMonth.type ? colors.primary : colors.text}
            >
              {item.type !== STATEMENT_TYPE.NOW && !isItemAll
                ? formatDateLocal(item.month, 'MMMM, yyyy')
                : item.type === STATEMENT_TYPE.NOW
                ? 'Kỳ hiện tại'
                : 'Xem tất cả lịch sử'}
            </RNText>
            {item.type === STATEMENT_TYPE.FUTURE && <RNText fontSize={11}>(Tương lai)</RNText>}
          </View>
          <SvgIcon name="forward" preset="forwardLink" />
        </View>
      </TouchableHighlightComponent>
    );
  };

  return (
    <>
      <View style={styles.viewByMonth}>
        {!isEmpty(viewMonth) && (
          <View>
            <RNText fontSize={17} style={{ textTransform: 'capitalize', fontWeight: '500' }}>
              {![STATEMENT_TYPE.NOW, STATEMENT_TYPE.ALL].includes(viewMonth.type)
                ? formatDateLocal(viewMonth.month, 'MMMM, yyyy')
                : viewMonth.type === STATEMENT_TYPE.NOW
                ? 'Kỳ hiện tại'
                : 'Xem tất cả lịch sử'}
            </RNText>
            {![STATEMENT_TYPE.ALL].includes(viewMonth.type) && (
              <RNText fontSize={10} style={{ fontStyle: 'italic' }} color="gray">
                {`(${formatDateLocal(viewMonth.startDate, 'dd/MM/yyyy')} - ${formatDateLocal(
                  viewMonth.endDate,
                  'dd/MM/yyyy',
                )})`}
              </RNText>
            )}
          </View>
        )}
        <PressableHaptic onPress={() => bottomSheetModalRef?.current.present()}>
          <RNText color={colors.primary}>Sao kê khác</RNText>
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
