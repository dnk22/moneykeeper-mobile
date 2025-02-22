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

  function onNavigateToScreen(link: string) {
    navigation.navigate(link);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cài đặt</Text>
        {Object.values(settingRoutes).map(({ key, child }) => (
          <View key={key} style={[styles.group, { backgroundColor: colors.surface }]}>
            {child.map(({ link, name, icon }, index) => (
              <TouchableHighlightComponent
                borderRadius={0}
                activeOpacity={0.5}
                key={link}
                onPress={() => onNavigateToScreen(link)}
              >
                <View style={styles.item}>
                  <SvgIcon name={icon} preset="settingsIcon" />
                  <View
                    style={[
                      styles.itemTitle,
                      index !== child.length - 1
                        ? {
                            borderBottomWidth: 0.2,
                            borderBottomColor: colors.divider,
                          }
                        : null,
                    ]}
                  >
                    <Text>{name}</Text>
                    <SvgIcon
                      name="forward"
                      color="gray"
                      preset="forwardLink"
                      style={styles.itemNavigation}
                    />
                  </View>
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
