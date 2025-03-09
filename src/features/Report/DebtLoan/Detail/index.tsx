import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import RNText from 'components/Text';
import FlatListComponent from 'components/FlatList';
import { useFocusEffect } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes'; 
import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_LEND_BORROW_NAME } from 'utils/constants';
import { queryGetDebtLoanDetailByPerson } from 'database/querying';
import { TGetDebtLoanDetailByPerson } from 'utils/types/request.type';
import { formatNumber } from 'utils/math';
import { useCustomTheme } from 'resources/theme';
import { showToast } from 'utils/system';
import { ReportParamListProps } from 'navigation/types';
import { formatDateLocal } from 'utils/date';
import { useAppSelector } from 'store/index';
import { selectLendBorrowData } from 'store/transactionCategory/transactionCategory.selector';
import DebtLoanItemDetail from './DebtLoanItemDetail';
import styles from './styles';
import PressableHaptic from 'components/PressableHaptic';
import ProgressLineChart from 'components/ProgressLineChart';
import SvgIcon from 'components/SvgIcon';

export default function DebtLoanDetail({
  navigation,
  route,
}: {
  navigation: ReportParamListProps<typeof ROUTES.DEBT_LOAN_REPORT_DETAIL>['navigation'];
  route: ReportParamListProps<typeof ROUTES.DEBT_LOAN_REPORT_DETAIL>['route'];
}) {
  const {
    params: { personName, type },
  } = route;
  const { colors } = useCustomTheme();
  const lendBorrowData = useAppSelector((state) => selectLendBorrowData(state));
  const [data, setData] = useState<{
    original: TGetDebtLoanDetailByPerson[];
    formatted: { data: TGetDebtLoanDetailByPerson[]; date: string }[];
  }>({
    original: [],
    formatted: [],
  });

  const total = useMemo(
    () =>
      Math.abs(
        data?.original
          .filter((item) => item.categoryType === type)
          .reduce((prev, curr) => (prev += curr.amount), 0),
      ),
    [data?.original, type],
  );

  const collected = useMemo(
    () =>
      Math.abs(
        data?.original.reduce(
          (acc, curr) => (curr.categoryType !== type ? acc + curr.amount : acc),
          0,
        ),
      ),
    [data?.original, type],
  );

  const remain = total - collected;

  const progressData = [
    {
      value: collected,
      color: 'green',
    },
    {
      value: total - collected,
      color: colors.divider,
    },
  ];

  const handlePayment = () => {
    // if type get REPAYMENT , COLLECT_DEBTS else
    const categoryNameTarget = type
      ? TRANSACTION_LEND_BORROW_NAME.REPAYMENT
      : TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS;
    const categoryId = Object.keys(lendBorrowData).find(
      (key) => lendBorrowData[key] === categoryNameTarget,
    );
    navigation.navigate(ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT, {
      amount: +remain,
      categoryId,
      relatedPerson: personName,
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    return <DebtLoanItemDetail item={item} />;
  };

  useFocusEffect(
    useCallback(() => {
      queryGetDebtLoanDetailByPerson({ relatedPerson: personName, type })
        .then((res) => {
          const formatData: any = res.reduce((result, item) => {
            // Extracting date from the dateTimeAt property
            const date = new Date(item.dateTimeAt).toDateString();
            // Adding the item to the corresponding date group
            if (!result[date]) {
              result[date] = { date: date, data: [] };
            }
            result[date].data.push(item);
            return result;
          }, {});

          const sortedData: any = Object.values(formatData)
            .reverse()
            .map((item) => {
              item.data = [...item.data].sort((el, el2) => el2._id - el._id);
              return item;
            });

          setData({
            original: res,
            formatted: sortedData,
          });
        })
        .catch(() => {
          showToast({
            type: 'error',
            text2: 'Không tải được thông tin',
          });
        });
    }, [personName, type]),
  );

  return (
    <View style={styles.container}>
      {!!remain && (
        <PressableHaptic
          style={[styles.btnAction, { backgroundColor: colors.primary }]}
          onPress={handlePayment}
        >
          <SvgIcon
            name={type === TRANSACTION_CATEGORY_TYPE.EXPENSE ? 'payIn' : 'payOut'}
            size={26}
            color="white"
          />
        </PressableHaptic>
      )}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.row}>
          <View style={[styles.col, { alignItems: 'flex-start' }]}>
            <RNText style={styles.title}>{!type ? 'Đã thu' : 'Đã trả'}</RNText>
            <RNText style={styles.value} color="green">
              {formatNumber(collected, true)}
            </RNText>
          </View>
          <View style={styles.col}>
            <RNText style={styles.title}>
              {type === TRANSACTION_CATEGORY_TYPE.EXPENSE ? 'Tổng cho vay:' : 'Tổng vay:'}
            </RNText>
            <RNText style={styles.value}>{formatNumber(total, true)}</RNText>
          </View>
          <View style={[styles.col, { alignItems: 'flex-end' }]}>
            <RNText style={styles.title}>{!type ? 'Phải thu' : 'Còn nợ'}</RNText>
            <RNText style={styles.value} color="red">
              {formatNumber(remain, true)}
            </RNText>
          </View>
        </View>
        <View style={styles.progressLine}>
          <ProgressLineChart data={progressData} />
        </View>
        <View style={[styles.row, styles.dateView]}>
          <RNText style={styles.title} fontSize={14}>
            Bắt đầu:
          </RNText>
          <View style={[styles.row, styles.itemDate]}>
            <RNText style={styles.value} fontSize={13}>
              {!!data?.original &&
                formatDateLocal(
                  data?.original[data?.original.length - 1]?.dateTimeAt,
                  'dd/MM/yyyy HH:mm',
                )}
            </RNText>
            <RNText style={styles.title}>-</RNText>
            <RNText style={styles.value} fontSize={13}>
              {!!data?.original && data?.original[data?.original.length - 1]?.accountName}
            </RNText>
          </View>
        </View>
        {!remain && (
          <View style={[styles.row, styles.dateView]}>
            <RNText style={styles.title} fontSize={14}>
              Kết thúc:
            </RNText>
            <View style={[styles.row, styles.itemDate]}>
              <RNText style={styles.value} fontSize={13}>
                {!!data?.original &&
                  formatDateLocal(data?.original[0]?.dateTimeAt, 'dd/MM/yyyy HH:mm')}
              </RNText>
              <RNText style={styles.title}>-</RNText>
              <RNText style={styles.value} fontSize={13}>
                {!!data?.original && data?.original[0]?.accountName}
              </RNText>
            </View>
          </View>
        )}
      </View>
      <View style={styles.flatList}>
        <FlatListComponent id="date" data={data.formatted} renderItem={renderItem} />
      </View>
    </View>
  );
}
