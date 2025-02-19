import { View } from 'react-native';
import RNText from 'components/Text';
import IconComponent from 'components/IconComponent';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { formatNumber } from 'utils/math';
import { MATERIAL_COLOR } from 'utils/constants';
import { useAppDispatch } from 'store/index';
import { setDataDetailLv2, setPageView } from '../reducer/financialStatement.slice';
import { dataLevelProps } from '../types';
import styles from './styles';

function ItemLevel1({
  item,
  totalAmount,
  index,
}: {
  item: dataLevelProps;
  totalAmount: number;
  index?: number;
}) {
  const dispatch = useAppDispatch();

  const percent = () => {
    return `${Number(((item.value / totalAmount) * 100).toFixed(2))}%`;
  };

  const setDataDetail = () => {
    dispatch(setDataDetailLv2(item.accountName || ''));
    dispatch(setPageView({ page: 1, resetLv2: false }));
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
export default ItemLevel1;
