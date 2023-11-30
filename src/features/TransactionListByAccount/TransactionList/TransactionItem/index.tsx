import { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { RNText, SvgIcon, SwipeableComponent, TouchableHighlightComponent } from 'components/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { useNavigation } from '@react-navigation/native';
import { AccountStackParamListProps } from 'navigation/types';
import { ACCOUNT_DETAIL, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import { TransactionModel } from 'database/models';
import styles from './styles';
import { deleteTransactionById } from 'services/api/transactions';
import { formatNumber } from 'utils/math';

type TransactionItemProps = {
  data: TransactionModel;
};

function TransactionItem({ data }: TransactionItemProps) {
  const { colors } = useCustomTheme();
  const tapPosition = useRef<number>(0);
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_DETAIL>['navigation']>();

  const onTransactionItemPress = (e: any) => {
    if (e.nativeEvent.locationX === tapPosition.current) {
      navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, { transactionId: data?.id });
    }
  };

  const onOk = () => {
    if (data?.id) {
      deleteTransactionById(data.id);
    }
  };

  const onConfirmDelete = () => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa?', [
      {
        text: 'Hủy bỏ',
        style: 'cancel',
      },
      { text: 'Đồng ý', style: 'destructive', onPress: () => onOk() },
    ]);
  };

  const onPressIn = ({ nativeEvent }: { nativeEvent: any }) => {
    tapPosition.current = nativeEvent.locationX;
  };

  return (
    <View style={styles.container}>
      <SwipeableComponent containerStyle={styles.swipe} onDelete={onConfirmDelete}>
        <TouchableHighlightComponent
          delayLongPress={100} // Leave room for a user to be able to click
          onLongPress={() => {
            tapPosition.current = 0;
          }} // A callback that does nothing
          onPressIn={onPressIn}
          onPressOut={onTransactionItemPress}
          style={{ borderRadius: 0 }}
        >
          <View style={[styles.record, { backgroundColor: colors.surface }]}>
            <View style={styles.transactionCategoryInfo}>
              <SvgIcon name={data?.categoryIcon} />
              <View>
                <RNText>{data?.categoryName}</RNText>
                {data?.descriptions && (
                  <RNText color="gray" fontSize={11}>
                    {data.descriptions}
                  </RNText>
                )}
              </View>
            </View>
            <View style={styles.amountInfo}>
              <RNText>{formatNumber(data?.amount, true)}</RNText>
              <RNText fontSize={13} color="gray">
                {`(${formatNumber(data?.amount, true)})`}
              </RNText>
            </View>
          </View>
        </TouchableHighlightComponent>
      </SwipeableComponent>
      <View style={styles.childLine} />
    </View>
  );
}

export default TransactionItem;
