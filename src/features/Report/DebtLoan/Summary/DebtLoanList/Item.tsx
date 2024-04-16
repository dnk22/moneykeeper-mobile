import { View } from 'react-native';
import { PressableHaptic, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { useNavigation } from '@react-navigation/native';
import { ReportParamListProps } from 'navigation/types';
import {
  MATERIAL_COLOR,
  TRANSACTION_CATEGORY_TYPE,
  TRANSACTION_LEND_BORROW_NAME,
} from 'utils/constant';
import { formatNumber } from 'utils/math';
import { DebtLoanTypes } from 'utils/types';
import { CREATE_TRANSACTION_FROM_ACCOUNT, DEBT_LOAN_REPORT_DETAIL } from 'navigation/constants';
import { useCustomTheme } from 'resources/theme';
import { MenuAction, MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { useAppSelector } from 'store/index';
import { selectLendBorrowData } from 'store/transactionCategory/transactionCategory.selector';
import styles from './styles';

function Item({ data, index }: { data: DebtLoanTypes; index: number }) {
  const navigation =
    useNavigation<ReportParamListProps<typeof DEBT_LOAN_REPORT_DETAIL>['navigation']>();
  const { colors } = useCustomTheme();
  const lendBorrowData = useAppSelector((state) => selectLendBorrowData(state));

  const menuData: MenuAction[] = [
    {
      id: String(data.value),
      title: formatNumber(Math.abs(data.value), true),
    },
    {
      id: '0',
      title: 'Khác',
    },
  ];

  const onNavigationToDebtLoanDetail = () => {
    navigation.navigate(DEBT_LOAN_REPORT_DETAIL, {
      personName: data.relatedPerson,
      type: data.categoryType,
    });
  };

  const onHandlePressAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    // if type LEND get COLLECT_DEBTS , REPAYMENT else
    const categoryNameTarget = data.categoryType
      ? TRANSACTION_LEND_BORROW_NAME.REPAYMENT
      : TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS;
    const categoryId = Object.keys(lendBorrowData).find(
      (key) => lendBorrowData[key] === categoryNameTarget,
    );
    navigation.navigate(CREATE_TRANSACTION_FROM_ACCOUNT, {
      amount: +event,
      categoryId,
      relatedPerson: data.relatedPerson,
    });
  };

  return (
    <TouchableHighlightComponent
      style={styles.personContainer}
      onPress={onNavigationToDebtLoanDetail}
    >
      <View style={styles.item}>
        <View style={styles.col}>
          <View style={[styles.personLogo, { backgroundColor: MATERIAL_COLOR[index || 0] }]}>
            <RNText color="white">{String(data.relatedPerson).charAt(0)}</RNText>
          </View>
          <RNText style={styles.accountName}>{data.relatedPerson}</RNText>
        </View>
        <View style={styles.col}>
          <RNText fontSize={15} style={styles.amount}>
            {formatNumber(Math.abs(data.value), true)}
          </RNText>
          {!!data.value && (
            <PressableHaptic
              onPress={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <MenuView
                title={
                  data.categoryType === TRANSACTION_CATEGORY_TYPE.EXPENSE ? 'Thu nợ' : 'Trả nợ'
                }
                onPressAction={onHandlePressAction}
                actions={menuData}
              >
                <View style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                  <SvgIcon
                    name={
                      data.categoryType === TRANSACTION_CATEGORY_TYPE.EXPENSE ? 'payIn' : 'payOut'
                    }
                    size={24}
                    color="white"
                  />
                </View>
              </MenuView>
            </PressableHaptic>
          )}
        </View>
      </View>
    </TouchableHighlightComponent>
  );
  ``;
}
export default Item;
