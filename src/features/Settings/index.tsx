import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { settingRoutes } from './constants';
import { useNavigation } from '@react-navigation/native';
import { useCustomTheme } from 'resources/theme';
import Text from 'components/Text';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import SvgIcon from 'components/SvgIcon';
import styles from './styles';

function Settings() {
  const navigation = useNavigation();
  const { colors } = useCustomTheme();

  function onNavigateToScreen(link: any) {
    navigation.navigate(link);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cài đặt</Text>
        {Object.values(settingRoutes).map(({ key, child }) => (
          <View style={styles.group} key={key}>
            {child.map(({ link, name, icon }, index) => (
              <TouchableHighlightComponent
                activeOpacity={0.5}
                key={link}
                onPress={() => onNavigateToScreen(link)}
                style={{
                  backgroundColor: colors.surface,
                }}
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
      </ScrollView>
    </SafeAreaView>
  );
}

export default Settings;
