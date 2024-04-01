import { View } from 'react-native';
import {
  IconComponent,
  PressableHaptic,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { useNavigation } from '@react-navigation/native';
import { formatNumber } from 'utils/math';
import { MATERIAL_COLOR, ACCOUNT_CATEGORY_ID } from 'utils/constant';
import { ACCOUNT_CREDIT_CARD_DETAIL, ACCOUNT_NORMAL_DETAIL } from 'navigation/constants';
import { dataLevelProps } from '../types';
import styles from './styles';

function ItemLevel2({
  item,
  totalAmount,
  index,
  onActionPress,
}: {
  item: dataLevelProps;
  totalAmount: number;
  index?: number;
  onActionPress?: (value: dataLevelProps) => void;
}) {
  const navigation = useNavigation<any>();

  const percent = () => {
    return `${Number(((item.value / totalAmount) * 100).toFixed(2))}%`;
  };

  const onNavigationToAccount = () => {
    if (item.relatedPerson) {
    } else {
      const { id, accountName, accountTypeId } = item;
      switch (accountTypeId) {
        case ACCOUNT_CATEGORY_ID.CREDITCARD:
          navigation.navigate(ACCOUNT_CREDIT_CARD_DETAIL, {
            accountId: id,
            accountName,
            creditCardLimit: 90000,
          });
          break;
        default:
          navigation.navigate(ACCOUNT_NORMAL_DETAIL, { accountId: id, accountName });
          break;
      }
    }
  };

  return (
    <TouchableHighlightComponent onPress={onNavigationToAccount}>
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
            <View style={styles.amountView}>
              <RNText fontSize={15} style={styles.amount}>
                {formatNumber(item.value, true)}
              </RNText>
              <RNText fontSize={12} style={styles.amount} preset="subTitle">
                {`(${percent()})`}
              </RNText>
            </View>
          </View>
        </View>
        <PressableHaptic onPress={() => onActionPress && onActionPress(item)}>
          <SvgIcon name="settingDot" />
        </PressableHaptic>
      </View>
    </TouchableHighlightComponent>
  );
}
export default ItemLevel2;
