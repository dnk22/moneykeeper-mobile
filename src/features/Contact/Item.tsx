import React, { useRef, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { GestureResponderEvent } from 'react-native-modal';
import {
  PressableHaptic,
  RNText,
  SvgIcon,
  SwipeableComponent,
  TouchableHighlightComponent,
} from 'components/index';
import { TContact } from 'database/types';
import { deleteContact, updateContact } from 'services/api/contacts';
import styles from './styles';

function NormalItem({
  item,
  colors,
  onItemPress,
  onEditSuccess,
}: {
  item: TContact;
  colors: any;
  onItemPress: (item: string) => void;
  onEditSuccess: () => void;
}) {
  const tapPosition = useRef<number>(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormError, setIsFormError] = useState(false);
  const [contact, setContact] = useState(item.contactName);

  const onEditContact = (e: GestureResponderEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditMode) {
      onSubmitUpdateContact();
      return;
    }
    setIsEditMode(!isEditMode);
  };

  const onSubmitUpdateContact = () => {
    if (contact === item.contactName) {
      setIsEditMode(false);
      return;
    }
    if (!contact) {
      setIsFormError(true);
      return;
    }
    updateContact({ id: item.id, text: contact }).then((res) => {
      if (res.success) {
        setIsFormError(false);
        setIsEditMode(false);
        onEditSuccess();
      }
    });
  };

  const onPressIn = ({ nativeEvent }: { nativeEvent: any }) => {
    tapPosition.current = nativeEvent.locationX;
  };

  const onPressOut = (e: any) => {
    if (e.nativeEvent.locationX === tapPosition.current) {
      onItemPress(item.contactName);
    }
  };

  const onOk = () => {
    deleteContact(item.id).then((res) => {
      if (res.success) {
        onEditSuccess();
      }
    });
  };

  const onDeleteContact = () => {
    Alert.alert(`Xóa ${item.contactName}`, 'Xác nhận xóa?', [
      {
        text: 'Hủy bỏ',
        style: 'cancel',
      },
      { text: 'Đồng ý', style: 'destructive', onPress: () => onOk() },
    ]);
  };

  return (
    <SwipeableComponent onDelete={onDeleteContact}>
      <TouchableHighlightComponent
        style={{ backgroundColor: colors.surface }}
        delayLongPress={100} // Leave room for a user to be able to click
        onLongPress={() => {
          tapPosition.current = 0;
        }} // A callback that does nothing
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={[styles.contactItem, { borderBottomColor: colors.divider }]}>
          {isEditMode ? (
            <TextInput
              style={styles.inputForm}
              placeholder="Vui lòng nhập tên"
              placeholderTextColor={isFormError ? 'red' : undefined}
              onChangeText={setContact}
              value={contact}
            />
          ) : (
            <>
              <View style={[styles.contactAvt, { backgroundColor: colors.background }]}>
                <RNText>{item.contactName.charAt(0).toLocaleUpperCase()}</RNText>
              </View>
              <RNText style={{ flex: 1 }}>{item.contactName}</RNText>
            </>
          )}
          <PressableHaptic style={{ padding: 5, paddingRight: 3 }} onPress={onEditContact}>
            {isEditMode ? (
              <SvgIcon name="doneCircle" color="green" />
            ) : (
              <SvgIcon name="contactEdit" />
            )}
          </PressableHaptic>
          {isEditMode && (
            <PressableHaptic
              style={{ padding: 5, paddingRight: 3 }}
              onPress={() => setIsEditMode(false)}
            >
              <SvgIcon name="closeCircle" color="red" />
            </PressableHaptic>
          )}
        </View>
      </TouchableHighlightComponent>
    </SwipeableComponent>
  );
}
export default NormalItem;
