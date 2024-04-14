import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ProgressLineChart, RNText, FlatListComponent } from 'components/index';
import { useFocusEffect } from '@react-navigation/native';
import { DEBT_LOAN_REPORT_DETAIL } from 'navigation/constants';
import { ReportParamListProps } from 'navigation/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';
import { queryGetDebtLoanDetailByPerson } from 'database/querying';
import { TGetDebtLoanDetailByPerson } from 'utils/types/request.type';
import { formatNumber } from 'utils/math';
import { useCustomTheme } from 'resources/theme';
import { showToast } from 'utils/system';
import { formatDateLocal } from 'utils/date';
import { SCREEN_WIDTH } from 'share/dimensions';
import DebtLoanItemDetail from './DebtLoanItemDetail';
import styles from './styles';

export default function DebtLoanDetail({
  route,
}: {
  route: ReportParamListProps<typeof DEBT_LOAN_REPORT_DETAIL>['route'];
}) {
  const {
    params: { personName, type },
  } = route;
  const { colors } = useCustomTheme();
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
          setData({
            original: res,
            formatted: Object.values(formatData),
          });
        })
        .catch(() => {
          showToast({
            type: 'error',
            text2: 'Vui lòng thử lại',
          });
        });
    }, [personName, type]),
  );

  return (
    <View style={styles.container}>
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
                  'dd/MM/yyyy hh:mm',
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
                  formatDateLocal(data?.original[0]?.dateTimeAt, 'dd/MM/yyyy hh:mm')}
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
