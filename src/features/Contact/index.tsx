import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { debounce, size } from 'lodash';
import Contacts from 'react-native-contacts';
import {
  Empty,
  FlatListComponent,
  InputSearch,
  PressableHaptic,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { addNewContact, getAllContact } from 'services/api/contacts';
import { TContact } from 'database/types';
import { openSettings } from 'react-native-permissions';
import NormalItem from './Item';
import ContactItem from './ContactItem';
import styles from './styles';

function Contact({
  onItemPress,
  readOnly = false,
}: {
  onItemPress: (name: string) => void;
  readOnly?: boolean;
}) {
  const { colors } = useCustomTheme();
  const [searchText, setSearchText] = useState('');
  const [isContactMode, setContactMode] = useState(false);
  const [isInputFocus, setInputFocus] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [contactDataFromDevice, setContactDataFromDevice] = useState([]);
  const isHaveDataInit = useRef(false);

  const getContacts = (text?: string) => {
    getAllContact(text).then((res) => {
      isHaveDataInit.current = Boolean(res.length);
      setContactData(res);
    });
  };

  const getContactFromDevice = (text: string) => {
    if (size(contactDataFromDevice)) {
      return;
    }
    Contacts.checkPermission().then((res) => {
      switch (res) {
        case 'denied':
          openSettings().catch(() => console.warn('cannot open settings'));
          break;
        case 'authorized':
          if (!text) {
            Contacts.getAllWithoutPhotos().then((contacts) => {
              const contactConvert = contacts.map((item) => ({
                id: item.recordID,
                contactName: `${item.familyName} ${item.givenName}`,
              }));
              setContactDataFromDevice(contactConvert);
            });
            break;
          }
          Contacts.getContactsMatchingString(text).then((contacts) => {
            const contactConvert = contacts.map((item) => ({
              id: item.recordID,
              contactName: item.familyName + item.givenName,
            }));
            setContactDataFromDevice(contactConvert);
          });
          break;
        default:
          Contacts.requestPermission();
          break;
      }
    });
  };

  const onSearch = debounce((text: string) => {
    setSearchText(text);
  }, 100);

  const onAddNewContact = (contactName?: string) => {
    addNewContact(contactName || searchText).then((res) => {
      if (res.success) {
        onItemPress(contactName || searchText);
      }
    });
  };

  const renderContactItem = ({ item }: { item: TContact }) => {
    return (
      <>
        {isContactMode || readOnly ? (
          <ContactItem colors={colors} item={item} onItemPress={onAddNewContact} />
        ) : (
          <NormalItem
            colors={colors}
            item={item}
            onItemPress={onItemPress}
            onEditSuccess={() => getContacts(searchText)}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    if (isContactMode) {
      getContactFromDevice(searchText);
    } else {
      getContacts(searchText);
    }
  }, [searchText, isContactMode]);

  const data = isContactMode ? contactDataFromDevice : contactData;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <InputSearch
          placeholder={isContactMode ? 'Tìm liên hệ' : 'Tìm hoặc nhập mới liên hệ'}
          onChangeText={onSearch}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          style={{ flex: 1 }}
        />
        <PressableHaptic
          style={[styles.contactPicker, { backgroundColor: colors.surface }]}
          onPress={() => setContactMode(!isContactMode)}
        >
          <SvgIcon name="contact" color={isContactMode ? colors.primary : colors.text} />
        </PressableHaptic>
      </View>
      {isInputFocus && searchText && !Boolean(size(contactData)) && (
        <TouchableHighlightComponent onPress={() => onAddNewContact()} style={{ borderRadius: 5 }}>
          <View style={styles.addItem}>
            <View style={[styles.contactAvt, { backgroundColor: colors.surface }]}>
              <SvgIcon name="add" />
            </View>
            <RNText>{`Thêm ${searchText}`}</RNText>
          </View>
        </TouchableHighlightComponent>
      )}
      <View style={[styles.listContainer, { backgroundColor: colors.surface }]}>
        <FlatListComponent data={data} renderItem={renderContactItem} />
        {!isHaveDataInit && <Empty text="Chưa có liên hệ nào, thêm mới ngay" />}
      </View>
    </View>
  );
}
export default Contact;
