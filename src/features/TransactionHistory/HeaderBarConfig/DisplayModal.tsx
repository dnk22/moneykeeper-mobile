import {
  CheckboxComponent,
  ModalComponent,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectTransactionListConfig } from 'store/app/app.selector';
import { updateTransactionListDisplayConfig } from 'store/app/app.slice';
import { get } from 'lodash';
import styles from './styles';

const displaySettings = [
  { label: 'Tổng thu trong ngày', key: 'income' },
  { label: 'Tổng chi trong ngày', key: 'expense' },
  { label: 'Số dư sau mỗi giao dịch', key: 'amount' },
  { label: 'Ghi chú', key: 'description' },
];

function DisplayModal({
  isVisible,
  onToggleModal,
}: {
  isVisible: boolean;
  onToggleModal: () => void;
}) {
  const dispatch = useAppDispatch();
  const display = useAppSelector((state) => selectTransactionListConfig(state));

  const updateTransactionViewConfig = (key: string) => {
    dispatch(
      updateTransactionListDisplayConfig({
        [key]: !get(display, key, false),
      }),
    );
  };

  return (
    <ModalComponent
      style={{ justifyContent: 'center' }}
      styleDefaultContent={{
        borderRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
      }}
      isVisible={isVisible}
      onToggleModal={onToggleModal}
    >
      <View style={styles.header}>
        <RNText style={{ fontWeight: '500' }}>Cài đặt hiển thị</RNText>
        <TouchableHighlightComponent onPress={onToggleModal}>
          <SvgIcon name="closeCircle" />
        </TouchableHighlightComponent>
      </View>
      {displaySettings.map((item) => {
        return (
          <TouchableHighlightComponent
            onPress={() => updateTransactionViewConfig(item.key)}
            key={item.key}
          >
            <View style={[styles.item, styles.displayItem]}>
              <CheckboxComponent type="checkbox" disabled check={get(display, item.key, false)} />
              <RNText fontSize={16}>{item.label}</RNText>
            </View>
          </TouchableHighlightComponent>
        );
      })}
    </ModalComponent>
  );
}

export default DisplayModal;
