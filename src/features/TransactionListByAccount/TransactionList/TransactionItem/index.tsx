import { memo, useRef } from 'react';
import { Alert, View } from 'react-native';
import { RNText, SvgIcon, SwipeableComponent, TouchableHighlightComponent } from 'components/index';
import { useNavigation } from '@react-navigation/native';
import { AccountStackParamListProps } from 'navigation/types';
import { ACCOUNT_DETAIL, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types';
import { deleteTransactionById } from 'services/api/transactions';
import { formatNumber } from 'utils/math';
import isEqual from 'react-fast-compare';
import styles from './styles';
import { showToast } from 'utils/system';

function TransactionItem({
  data,
  onRefreshTransactionList,
}: {
  data: TTransactions;
  onRefreshTransactionList: () => void;
}) {
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
      deleteTransactionById(data)
        .then(({ success }) => {
          if (success) {
            onRefreshTransactionList();
          }
        })
        .catch(({ error }) => {
          showToast({
            type: 'error',
            text2: error,
          });
        });
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
              <View style={styles.detailInfo}>
                <RNText>{data?.categoryName}</RNText>
                {data?.descriptions && (
                  <RNText color="gray" fontSize={11} style={styles.textDescription}>
                    {data.descriptions}
                  </RNText>
                )}
              </View>
            </View>
            <View style={styles.amountInfo}>
              <RNText color={data?.amount < 0 ? 'red' : 'green'}>
                {formatNumber(Math.abs(data?.amount), true)}
              </RNText>
              <RNText fontSize={13} color="gray">
                {`(${formatNumber(data?.closingAmount, true)})`}
              </RNText>
            </View>
          </View>
        </TouchableHighlightComponent>
      </SwipeableComponent>
      <View style={styles.childLine} />
    </View>
  );
}

export default memo(TransactionItem, isEqual);
