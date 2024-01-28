import { memo, useContext, useRef } from 'react';
import { Alert, View } from 'react-native';
import {
  RNText,
  SwipeableComponent,
  TouchableHighlightComponent,
  IconComponent,
} from 'components/index';
import isEqual from 'react-fast-compare';
import { useNavigation } from '@react-navigation/native';
import { AccountStackParamListProps } from 'navigation/types';
import { ACCOUNT_NORMAL_DETAIL, CREATE_TRANSACTION_FROM_ACCOUNT } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import { TTransactions } from 'database/types';
import { deleteTransactionById } from 'services/api/transactions';
import { formatNumber } from 'utils/math';
import { showToast } from 'utils/system';
import { TRANSACTION_TYPE } from 'utils/constant';
import { TransactionHistoryContext } from '../../context';
import styles from './styles';

function TransactionItem({
  data,
  display,
}: {
  data: TTransactions;
  display: Record<string, boolean>;
}) {
  const { colors } = useCustomTheme();
  const tapPosition = useRef<number>(0);
  const navigation =
    useNavigation<AccountStackParamListProps<typeof ACCOUNT_NORMAL_DETAIL>['navigation']>();
  const { onRefreshData } = useContext(TransactionHistoryContext);

  const onTransactionItemPress = (e: any) => {
    if (e.nativeEvent.locationX === tapPosition.current) {
      navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, { transactionId: data?.id });
    }
  };

  const onOk = () => {
    if (data?.id) {
      deleteTransactionById(data.id)
        .then(({ success }) => {
          if (success) {
            onRefreshData();
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

  const renderCategoryName = () => {
    switch (data.transactionType) {
      case TRANSACTION_TYPE.TRANSFER:
        return `Chuyển khoản ${data.amount >= 0 ? 'từ' : 'tới'} ${data.accountName}`;
      case TRANSACTION_TYPE.ADJUSTMENT:
        return 'Cân bằng số dư';
      default:
        return data?.categoryName;
    }
  };
  const renderCategoryIcon = () => {
    switch (data.transactionType) {
      case TRANSACTION_TYPE.TRANSFER:
        return data.amount >= 0 ? 'transferDown' : 'transferUp';
      default:
        return data?.categoryIcon;
    }
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
              <IconComponent name={renderCategoryIcon()} />
              <View style={styles.detailInfo}>
                <RNText>{renderCategoryName()}</RNText>
                {data?.descriptions && display.description && (
                  <RNText color="gray" fontSize={11} style={styles.textDescription}>
                    {data?.descriptions}
                  </RNText>
                )}
              </View>
            </View>
            <View style={styles.amountInfo}>
              <RNText color={data?.amount < 0 ? 'red' : 'green'}>
                {formatNumber(Math.abs(data?.amount), true)}
              </RNText>
              {display.amount && (
                <RNText fontSize={13} color="gray">
                  {`(${formatNumber(data?.closingAmount, true)})`}
                </RNText>
              )}
            </View>
          </View>
        </TouchableHighlightComponent>
      </SwipeableComponent>
      <View style={styles.childLine} />
    </View>
  );
}

export default memo(TransactionItem, isEqual);
