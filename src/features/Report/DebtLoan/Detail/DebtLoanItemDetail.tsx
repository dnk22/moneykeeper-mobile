import { View } from 'react-native';
import { IconComponent, RNText } from 'components/index';
import { formatDateLocal, formatDayOfTheWeek } from 'utils/date';
import { TGetDebtLoanDetailByPerson } from 'utils/types/request.type';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { MATERIAL_COLOR } from 'utils/constant';
import { formatNumber } from 'utils/math';

type DebtLoanItemDetailProps = {
  item: {
    date: any;
    data: TGetDebtLoanDetailByPerson[];
  };
};

function DebtLoanItemDetail({ item }: DebtLoanItemDetailProps) {
  const { colors } = useCustomTheme();
  // Generate a random number between 1 and 10
  const randomNumber = Math.floor(Math.random() * 50) + 1;

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
        {item.data.map((pack) => {
          return (
            <View
              key={pack.id}
              style={[styles.row, styles.childItem, { backgroundColor: colors.surface }]}
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
                <RNText fontSize={15}>{formatNumber(pack.amount, true)}</RNText>
                <View style={styles.accountName}>
                  <IconComponent name={pack.accountLogo} size={14} />
                  <RNText style={styles.descriptions} fontSize={11} color={'gray'}>
                    {pack.accountName}
                  </RNText>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
}

export default DebtLoanItemDetail;
