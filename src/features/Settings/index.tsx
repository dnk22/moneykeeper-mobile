import React, { memo } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import isEqual from 'react-fast-compare';
import styles from './styles';
import SvgIcon from 'components/SvgIcon';
import { settingRoutes } from './constants';

function Settings() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cài đặt</Text>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={[styles.group, styles.premium]}>
            <Text style={styles.premiumSubTitle}>Mở khóa tất cả tính năng</Text>
            <Text style={styles.premiumTitle}>Your Time Pro</Text>
          </View>
        </TouchableOpacity>
        {Object.values(settingRoutes).map(({ key, child }) => (
          <View style={styles.group} key={key}>
            {child.map(({ link, name, icon }, index) => (
              <TouchableOpacity activeOpacity={0.5} key={link}>
                <View
                  style={[
                    styles.item,
                    index !== child.length - 1 && styles.itemBorderBottom,
                  ]}
                >
                  <SvgIcon
                    name={icon}
                    preset="settingsIcon"
                    style={styles.itemIcon}
                  />
                  <Text style={styles.itemText}>{name}</Text>
                  <SvgIcon
                    name="forward"
                    color="gray"
                    preset="forwardLink"
                    style={styles.itemNavigation}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <Text style={styles.version}>Version 1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default memo(Settings, isEqual);
