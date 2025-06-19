import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCustomTheme } from 'resources/theme';
import Text from 'components/Text';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import SvgIcon from 'components/SvgIcon';
import { ROUTES } from 'navigation/constants/routes';
import { useAuth } from 'services/auth/AuthProvider';
import { settingRoutes } from './constants';
import styles from './styles';
import PressableHaptic from 'components/PressableHaptic';
import { Logout } from 'iconsax-react-native';

function Settings() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { isLoggedIn, appLogout } = useAuth();
  const { user = {} } = {}; // Add this hook

  function onNavigateToScreen(link: string) {
    navigation.navigate(link);
  }

  const handleLogout = async () => {
    await appLogout();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cài đặt</Text>

        <TouchableHighlightComponent
          borderRadius={0}
          activeOpacity={0.5}
          onPress={() => !isLoggedIn && navigation.navigate(ROUTES.AUTH)}
        >
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={styles.item}>
              <SvgIcon name="user" preset="settingsIcon" />
              <View style={styles.itemTitle}>
                <Text>{isLoggedIn ? user?.name || 'User' : 'Đăng nhập'}</Text>
                <SvgIcon
                  name="forward"
                  color="gray"
                  preset="forwardLink"
                  style={styles.itemNavigation}
                />
              </View>
            </View>
          </View>
        </TouchableHighlightComponent>

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
        <PressableHaptic
          style={[styles.item, styles.logout, { backgroundColor: colors.surface }]}
          onPress={handleLogout}
        >
          <Logout color={colors.error} variant="Broken" />
          <Text>Đăng xuất</Text>
        </PressableHaptic>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Settings;
