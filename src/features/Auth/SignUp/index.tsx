import React, { useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { useForm } from 'react-hook-form';
import RNText from 'components/Text';
import CheckboxComponent from 'components/Checkbox';
import InputField from 'components/InputField';
import PressableHaptic from 'components/PressableHaptic';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { useCustomTheme } from 'resources/theme';
import { Nexo } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProps } from 'navigation/types/auth';
import styles from './styles';

function SignUpScreen() {
  const navigation = useNavigation<AuthStackNavigationProps>();
  const { colors } = useCustomTheme();
  const [isAcceptTerm, setAcceptTerm] = useState(false);

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const onNavigateToSignIn = () => {
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('assets/images/auth/background.png')}
        style={[styles.topBlock, { backgroundColor: colors.primary }]}
      >
        <View style={styles.logoContainer}>
          <Nexo style={styles.logo} color="white" variant="Bulk" />
          <RNText color="white" preset="textSmall" style={styles.appName}>
            Quản lý chi tiêu
          </RNText>
        </View>
        <View style={styles.actionContainer}>
          <RNText color="white" fontSize={24} numberOfLines={2} style={styles.title}>
            Đăng ký tài khoản
          </RNText>
          <View style={{ flexDirection: 'row' }}>
            <RNText color="white" preset="textXSmall">
              Đã có tài khoản?
            </RNText>
            <PressableHaptic onPress={onNavigateToSignIn}>
              <RNText color="white" preset="textXSmall" style={styles.signup}>
                Đăng nhập ngay
              </RNText>
            </PressableHaptic>
          </View>
        </View>
      </ImageBackground>
      <View style={[styles.bottomBlock, { backgroundColor: colors.surface }]}>
        <InputField
          name="fullName"
          label="Họ tên"
          control={control}
          placeholder="Điền họ tên"
          style={[styles.formInput, { backgroundColor: colors.background }]}
        />
        <InputField
          name="email"
          label="Email"
          control={control}
          placeholder="Điền email"
          style={[styles.formInput, { backgroundColor: colors.background }]}
        />
        <InputField
          name="password"
          label="Mật khẩu"
          control={control}
          placeholder="Điền mật khẩu"
          style={[styles.formInput, { backgroundColor: colors.background }]}
        />
        <View style={styles.termAndConditions}>
          <CheckboxComponent
            type="checkbox"
            check={isAcceptTerm}
            onPress={() => setAcceptTerm(!isAcceptTerm)}
          />
          <RNText preset="subTitle" numberOfLines={2} style={{ width: '80%' }}>
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <RNText
              fontSize={12}
              color={colors.primary}
              style={{ textDecorationLine: 'underline' }}
            >
              điều khoản dịch vụ
            </RNText>{' '}
            của chúng tôi.
          </RNText>
        </View>
        <TouchableHighlightComponent
          onPress={handleSubmit(onSubmit)}
          underlayColor={colors.primaryVariant}
          style={[styles.formInput, styles.submit, { backgroundColor: colors.primary }]}
        >
          <RNText color="white" preset="textMedium" style={{ textAlign: 'center' }}>
            Đăng ký
          </RNText>
        </TouchableHighlightComponent>
      </View>
    </View>
  );
}

export default SignUpScreen;
