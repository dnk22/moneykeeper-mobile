import React from 'react';
import { View, ImageBackground } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import InputField from 'components/InputField';
import PressableHaptic from 'components/PressableHaptic';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { Apple, Nexo, Messages2, Google } from 'iconsax-react-native';
import { ROUTES } from 'navigation/constants/routes';
import navigation from 'navigation/helpers/navigate';
import { TLogin } from 'utils/types/auth';
import validation from './validation';
import { useAuth } from 'services/auth/AuthProvider';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { updateAppAuthState, updateAppLoading } from 'store/app/app.slice';
import { getDefaultAppData } from '../helper';

function SignInScreen() {
  const dispatch = useDispatch();
  const { appLogin } = useAuth();
  const { colors } = useCustomTheme();

  const methods = useForm<TLogin>({
    // resolver: yupResolver(validation),
    defaultValues: {
      email: 'duynk198@gmail.com',
      password: '000000',
    },
  });

  const onSubmit = async (formData: TLogin) => {
    dispatch(updateAppLoading(true));
    try {
      const { data } = await appLogin(formData);
      if (data) {
        if (data.isOnBoard) {
          await getDefaultAppData();
        }
        dispatch(
          updateAppAuthState({
            isLoggedIn: true,
            isOnboarded: data.isOnBoard,
          }),
        );
      }
    } catch (error) {
    } finally {
      dispatch(updateAppLoading(false));
    }
  };

  const onNavigateToForgotPassword = () => {
    navigation.navigate(ROUTES.FORGOT_PASSWORD);
  };

  const onNavigateToSignUp = () => {
    navigation.navigate(ROUTES.SIGN_UP);
  };

  const onGoogleLogin = () => {
    console.log('Login with Google');
  };

  const onAppleLogin = () => {
    console.log('Login with Apple');
  };

  const onPhoneLogin = () => {
    console.log('Login with Phone');
  };

  const Methods = [
    {
      name: 'google',
      icon: <Google style={styles.socialIcon} color={colors.primary} variant="Bulk" />,
      onPress: onGoogleLogin,
    },
    {
      name: 'apple',
      icon: <Apple style={styles.socialIcon} color={colors.primary} variant="Bulk" />,
      onPress: onAppleLogin,
    },
    {
      name: 'phone',
      icon: <Messages2 style={styles.socialIcon} color={colors.primary} variant="Bulk" />,
      onPress: onPhoneLogin,
    },
  ];

  return (
    <FormProvider {...methods}>
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
              Đăng nhập bằng tài khoản của bạn
            </RNText>
            <View style={{ flexDirection: 'row' }}>
              <RNText color="white" preset="textXSmall">
                Không có tài khoản?
              </RNText>
              <PressableHaptic onPress={onNavigateToSignUp}>
                <RNText color="white" preset="textXSmall" style={styles.signup}>
                  Đăng ký ngay
                </RNText>
              </PressableHaptic>
            </View>
          </View>
        </ImageBackground>
        <View style={[styles.bottomBlock, { backgroundColor: colors.surface }]}>
          <InputField
            name="email"
            label="Email"
            placeholder="Điền email"
            style={[styles.formInput, { backgroundColor: colors.background }]}
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            name="password"
            label="Mật khẩu"
            placeholder="Điền mật khẩu"
            style={[styles.formInput, { backgroundColor: colors.background }]}
            secureTextEntry
          />
          <View style={styles.forgotPassword}>
            <PressableHaptic onPress={onNavigateToForgotPassword}>
              <RNText color={colors.link} preset="textSmall">
                Quên mật khẩu?
              </RNText>
            </PressableHaptic>
          </View>
          <TouchableHighlightComponent
            onPress={methods.handleSubmit(onSubmit)}
            underlayColor={colors.primaryVariant}
            style={[styles.formInput, styles.submit, { backgroundColor: colors.primary }]}
          >
            <RNText color="white" preset="textMedium" style={{ textAlign: 'center' }}>
              Đăng nhập
            </RNText>
          </TouchableHighlightComponent>
          <View style={styles.otherMethods}>
            <View style={[styles.divider, { backgroundColor: colors.divider }]}>
              <RNText
                style={[styles.otherMethodsText, { backgroundColor: colors.surface }]}
                color={colors.textSecondary}
                preset="textSmall"
              >
                hoặc đăng nhập bằng
              </RNText>
            </View>
            <View style={styles.socialButtonContainer}>
              {Methods.map((method) => (
                <TouchableHighlightComponent
                  key={method.name}
                  onPress={method.onPress}
                  style={[
                    styles.socialButton,
                    { backgroundColor: colors.background, borderColor: colors.divider },
                  ]}
                >
                  {method.icon}
                </TouchableHighlightComponent>
              ))}
            </View>
          </View>
        </View>
      </View>
    </FormProvider>
  );
}

export default SignInScreen;
