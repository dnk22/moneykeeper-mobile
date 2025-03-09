import { View } from 'react-native';
import RNText from 'components/Text';
import IconComponent from 'components/IconComponent';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import PressableHaptic from 'components/PressableHaptic';
import SvgIcon from 'components/SvgIcon';
import { useNavigation } from '@react-navigation/native';
import { formatNumber } from 'utils/math';
import {
  MATERIAL_COLOR,
  ACCOUNT_CATEGORY_ID,
  TRANSACTION_CATEGORY_TYPE,
  TRANSACTION_LEND_BORROW_NAME,
} from 'utils/constants';
import { MenuAction, MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { ROUTES } from 'navigation/constants/routes';
import { dataLevelProps } from '../types';
import styles from './styles';
import { useAppSelector } from 'store/index';
import { selectLendBorrowData } from 'store/transactionCategory/transactionCategory.selector';

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
  const lendBorrowData = useAppSelector((state) => selectLendBorrowData(state));

  const menuData: MenuAction[] = [
    {
      id: String(item.value),
      title: formatNumber(Math.abs(item.value), true),
    },
    {
      id: '0',
      title: 'Số khác',
    },
  ];

  const percent = () => {
    return `${totalAmount ? Number(((item.value / totalAmount) * 100).toFixed(2)) : 0}%`;
  };

  const onNavigationToAccount = () => {
    if (item.relatedPerson) {
      navigation.navigate(ROUTES.DEBT_LOAN_REPORT_DETAIL, {
        personName: item.relatedPerson,
        type: item.categoryType,
      });
    } else {
      const { id, accountName, accountTypeId } = item;
      switch (accountTypeId) {
        case ACCOUNT_CATEGORY_ID.CREDITCARD:
          navigation.navigate(ROUTES.ACCOUNT_CREDIT_CARD_DETAIL, {
            accountId: id,
            accountName,
            creditCardLimit: 90000,
          });
          break;
        default:
          navigation.navigate(ROUTES.ACCOUNT_NORMAL_DETAIL, { accountId: id, accountName });
          break;
      }
    }
  };

  const onDebLoanAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    if (!item.categoryName) {
      return;
    }
    // if type LEND get COLLECT_DEBTS , REPAYMENT else
    const categoryNameTarget = item.categoryType
      ? TRANSACTION_LEND_BORROW_NAME.REPAYMENT
      : TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS;
    const categoryId = Object.keys(lendBorrowData).find(
      (key) => lendBorrowData[key] === categoryNameTarget,
    );
    navigation.navigate(ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT, {
      amount: +event,
      categoryId,
      relatedPerson: item.relatedPerson,
    });
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
        {item.categoryName ? (
          <PressableHaptic
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <MenuView
              title={item.categoryType === TRANSACTION_CATEGORY_TYPE.EXPENSE ? 'Thu nợ' : 'Trả nợ'}
              onPressAction={onDebLoanAction}
              actions={menuData}
            >
              <SvgIcon name="settingDot" />
            </MenuView>
          </PressableHaptic>
        ) : (
          <PressableHaptic onPress={() => onActionPress && onActionPress(item)}>
            <SvgIcon name="settingDot" />
          </PressableHaptic>
        )}
      </View>
    </TouchableHighlightComponent>
  );
}
export default ItemLevel2;
