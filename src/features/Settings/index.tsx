import React from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import { SvgIcon, TouchableHighlightComponent } from 'components/index';
import { settingRoutes } from './constants';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

function Settings() {
  const navigation = useNavigation();

  function onNavigateToScreen(link: any) {
    navigation.navigate(link);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cài đặt</Text>
        <TouchableHighlightComponent activeOpacity={0.5}>
          <View style={[styles.group, styles.premium]}>
            <Text style={styles.premiumSubTitle}>Mở khóa tất cả tính năng</Text>
            <Text style={styles.premiumTitle}>Your Time Pro</Text>
          </View>
        </TouchableHighlightComponent>
        {Object.values(settingRoutes).map(({ key, child }) => (
          <View style={styles.group} key={key}>
            {child.map(({ link, name, icon }, index) => (
              <TouchableHighlightComponent
                activeOpacity={0.5}
                key={link}
                onPress={() => onNavigateToScreen(link)}
              >
                <View style={[styles.item, index !== child.length - 1 && styles.itemBorderBottom]}>
                  <SvgIcon name={icon} preset="settingsIcon" style={styles.itemIcon} />
                  <Text style={styles.itemText}>{name}</Text>
                  <SvgIcon
                    name="forward"
                    color="gray"
                    preset="forwardLink"
                    style={styles.itemNavigation}
                  />
                </View>
              </TouchableHighlightComponent>
            ))}
          </View>
        ))}
        <Text style={styles.version}>Version 1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Settings;
