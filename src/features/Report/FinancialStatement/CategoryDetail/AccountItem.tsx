import { IconComponent, RNText, TouchableHighlightComponent } from 'components/index';
import { View } from 'react-native';
import { formatNumber } from 'utils/math';
import { useAppDispatch } from 'store/index';
import { dataLevelProps } from '../types';
import { setDataDetailLv2, setPageView } from '../reducer/financialStatement.slice';
import styles from './styles';
import { MATERIAL_COLOR } from 'utils/constant';

function AccountItem({
  item,
  totalAmount,
  index,
}: {
  item: dataLevelProps;
  totalAmount: number;
  index?: number;
}) {
  const dispatch = useAppDispatch();

  const setDataDetail = () => {
    dispatch(setDataDetailLv2(item.data));
    dispatch(setPageView({ page: 1, resetLv2: false }));
  };

  const percent = () => {
    return `${((item.value / totalAmount) * 100).toFixed(2)}%`;
  };

  return (
    <TouchableHighlightComponent onPress={setDataDetail}>
      <View style={styles.item}>
        <View style={styles.col}>
          {item.logo ? (
            <IconComponent name={item.logo} />
          ) : (
            <View style={[styles.personLogo, { backgroundColor: MATERIAL_COLOR[index || 0] }]}>
              <RNText color="white">{String(item.relatedPerson).charAt(0)}</RNText>
            </View>
          )}
          <View style={styles.accountName}>
            <RNText style={styles.accountName}>{item.accountName || item.relatedPerson}</RNText>
            <RNText fontSize={13} preset="subTitle">
              Tổng số dư
            </RNText>
          </View>
        </View>
        <View style={[styles.accountName, styles.amountCol]}>
          <RNText fontSize={12} style={styles.amount} preset="subTitle">
            {percent()}
          </RNText>
          <RNText fontSize={15} style={styles.amount}>
            {formatNumber(item.value, true)}
          </RNText>
        </View>
      </View>
    </TouchableHighlightComponent>
  );
}
export default AccountItem;
