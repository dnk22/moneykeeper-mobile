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
import { TRegister } from 'utils/types/auth';
import { useAuth } from 'services/auth/AuthProvider';
import styles from './styles';
import { ROUTES } from 'navigation/constants/routes';
import { useDispatch } from 'react-redux';
import { updateAppAuthState } from 'store/app/app.slice';

function SignUpScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthStackNavigationProps>();
  const { colors } = useCustomTheme();
  const [isAcceptTerm, setAcceptTerm] = useState(true);
  const { appSignup } = useAuth();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      displayName: 'Khánh Duy',
      email: 'duynk198@gmail.com',
      password: '000000',
    },
  });

  const onSubmit = async (data: TRegister) => {
    const { data: response } = await appSignup(data);
    if (response) {
      dispatch(
        updateAppAuthState({
          isLoggedIn: true,
          isOnboarded: false,
        }),
      );
    }
  };

  const onNavigateToSignIn = () => {
    navigation.popTo(ROUTES.SIGN_IN);
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
          name="displayName"
          label="Họ tên"
          control={control}
          placeholder="Điền họ tên"
          style={[styles.formInput, { backgroundColor: colors.background }]}
          autoComplete="name"
          autoCapitalize="words"
          autoCorrect={false}
          textContentType="name"
          autoFocus
          returnKeyType="next"
        />
        <InputField
          name="email"
          label="Email"
          control={control}
          placeholder="Điền email"
          style={[styles.formInput, { backgroundColor: colors.background }]}
          autoComplete="email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <InputField
          name="password"
          label="Mật khẩu"
          control={control}
          placeholder="Điền mật khẩu"
          style={[styles.formInput, { backgroundColor: colors.background }]}
          secureTextEntry
          autoComplete="password"
          textContentType="newPassword"
          returnKeyType="done"
          autoCorrect={false}
          autoCapitalize="none"
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
          disabled={!isAcceptTerm}
          style={[
            styles.formInput,
            styles.submit,
            { backgroundColor: isAcceptTerm ? colors.primary : colors.primaryVariant },
          ]}
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
