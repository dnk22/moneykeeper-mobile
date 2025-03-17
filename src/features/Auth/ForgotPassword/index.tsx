import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import RNText from 'components/Text';
import { View, ActivityIndicator } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import InputField from 'components/InputField';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import PressableScale from 'components/PressableHaptic';
import { Google, Messages1 } from 'iconsax-react-native';

function ForgotPassword() {
  const { colors } = useCustomTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      otp: '',
    },
  });
  const [otpMethod, setOtpMethod] = useState('email'); // 'email' or 'google'
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValidation = {
    required: 'Email không được để trống',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email không hợp lệ',
    },
  };

  const otpValidation = {
    required: 'Mã OTP không được để trống',
    pattern: {
      value: /^[0-9]{6}$/,
      message: 'Mã OTP phải có 6 số',
    },
  };

  const onSubmit = async (data) => {
    setLoading(true);
    if (!otpSent && otpMethod === 'email') {
      // Call API to send OTP
      try {
        // await sendOTP(data.email);
        setOtpSent(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      // Verify OTP and navigate to reset password
      try {
        // await verifyOTP(data.email, data.otp);
        // navigation.navigate('ResetPassword');
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };

  const renderMethodSelector = () => (
    <View style={styles.methodSelector}>
      <PressableScale
        onPress={() => setOtpMethod('email')}
        style={[
          styles.methodOption,
          otpMethod === 'email' && [
            styles.methodOptionActive,
            { backgroundColor: colors.primary + '20' },
          ],
        ]}
      >
        <Messages1 size="24" color={otpMethod === 'email' ? colors.primary : colors.text} />
        <View style={styles.methodTextContainer}>
          <RNText
            preset="headingSmall"
            style={[styles.methodTitle, otpMethod === 'email' && { color: colors.primary }]}
          >
            Email
          </RNText>
          <RNText preset="textSmall" style={styles.methodDescription}>
            OTP qua email
          </RNText>
        </View>
      </PressableScale>

      <PressableScale
        onPress={() => setOtpMethod('google')}
        style={[
          styles.methodOption,
          otpMethod === 'google' && [
            styles.methodOptionActive,
            { backgroundColor: colors.primary + '20' },
          ],
        ]}
      >
        <Google size="24" color={otpMethod === 'google' ? colors.primary : colors.text} />
        <View style={styles.methodTextContainer}>
          <RNText
            preset="headingSmall"
            style={[styles.methodTitle, otpMethod === 'google' && { color: colors.primary }]}
          >
            Google
          </RNText>
          <RNText preset="textSmall" style={styles.methodDescription}>
            Authenticator
          </RNText>
        </View>
      </PressableScale>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
        {renderMethodSelector()}

        {otpMethod === 'email' && (
          <InputField
            name="email"
            label="Email"
            control={control}
            rules={emailValidation}
            placeholder="Nhập email của bạn"
            style={[styles.formInput, { backgroundColor: colors.background }]}
            error={errors.email?.message}
          />
        )}

        {(otpSent || otpMethod === 'google') && (
          <InputField
            name="otp"
            label="OTP Code"
            control={control}
            rules={otpValidation}
            placeholder="Nhập mã OTP"
            style={[styles.formInput, { backgroundColor: colors.background }]}
            error={errors.otp?.message}
            keyboardType="number-pad"
            maxLength={6}
          />
        )}

        <TouchableHighlightComponent
          onPress={handleSubmit(onSubmit)}
          underlayColor={colors.primaryVariant}
          style={[styles.formInput, styles.submit, { backgroundColor: colors.primary }]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <RNText color="white" preset="textMedium" style={{ textAlign: 'center' }}>
              {!otpSent && otpMethod === 'email' ? 'Gửi OTP' : 'Xác nhận'}
            </RNText>
          )}
        </TouchableHighlightComponent>
      </View>
    </View>
  );
}

export default ForgotPassword;
