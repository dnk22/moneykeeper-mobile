import { Pressable, View } from 'react-native';
import RNText from 'components/Text';
import { formatDateLocal, formatDayOfTheWeek } from 'utils/date';
import { TGetDebtLoanDetailByPerson } from 'utils/types/request.type';
import { useCustomTheme } from 'resources/theme';
import { MATERIAL_COLOR } from 'utils/constants';
import { formatNumber } from 'utils/math';
import { useNavigation } from '@react-navigation/native';
import { CREATE_TRANSACTION_FROM_ACCOUNT } from 'utils/constants/navigation.constant';
import styles from './styles';
import IconComponent from 'components/IconComponent';

function DebtLoanItemDetail({
  item,
}: {
  item: {
    date: any;
    data: TGetDebtLoanDetailByPerson[];
  };
}) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  // Generate a random number between 1 and 50
  const randomNumber = Math.floor(Math.random() * 50) + 1;

  const onNavigationToTransactionDetail = (transactionId: string) => {
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, {
      transactionId,
    });
  };

  return (
    <>
      <View style={[styles.itemDetailContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.headerItem}>
          <View style={[styles.headerColor, { backgroundColor: MATERIAL_COLOR[randomNumber] }]} />
          <RNText fontSize={30} style={styles.day}>
            {formatDateLocal(item.date, 'dd')}
          </RNText>
          <View>
            <RNText fontSize={15}>{formatDayOfTheWeek(item.date)}</RNText>
            <RNText color="gray" fontSize={13}>
              {formatDateLocal(item.date, 'MM/yyyy')}
            </RNText>
          </View>
        </View>
      </View>
      <View>
        {(item.data || []).map((pack) => {
          return (
            <Pressable
              key={pack.id}
              style={[styles.row, styles.childItem, { backgroundColor: colors.surface }]}
              onPress={() => onNavigationToTransactionDetail(pack.id)}
            >
              <View style={styles.row}>
                <IconComponent name={pack.icon} />
                <View style={styles.gap2}>
                  <RNText fontSize={15}>{pack.categoryName}</RNText>
                  <RNText style={styles.descriptions} fontSize={11} color={'gray'}>
                    {pack.descriptions}
                  </RNText>
                </View>
              </View>
              <View style={[styles.colRight, styles.gap2]}>
                <RNText fontSize={15} color={pack.amount < 0 ? colors.error : colors.success}>
                  {formatNumber(Math.abs(pack.amount), true)}
                </RNText>
                <View style={styles.accountName}>
                  <IconComponent name={pack.accountLogo} size={14} />
                  <RNText style={styles.descriptions} fontSize={11} color={'gray'}>
                    {pack.accountName}
                  </RNText>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

export default DebtLoanItemDetail;
