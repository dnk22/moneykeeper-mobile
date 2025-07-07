import { View, Dimensions } from 'react-native';
import { commonStyle, endBoardingStyle } from './styles';
import Text from 'components/Text';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/index';
import { updateOnboardingSettings } from 'services/api/auth';
import { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useCustomTheme } from 'resources/theme';
import { markUserAsOnboarded } from 'services/api/user';
import { updateAppAuthState } from 'store/app/app.slice';
import { showToast } from 'utils/system';

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình

function LoadingIndicator({ isCompleted }: { isCompleted: boolean }) {
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    if (!isCompleted) {
      rotation.value = withTiming(360, { duration: 1200 });
    }
  }, [isCompleted]);

  return (
    <View style={{ width: 20, height: 20, marginRight: 10 }}>
      {isCompleted ? (
        <Text>✓</Text>
      ) : (
        <Animated.View
          style={[
            animatedStyle,
            {
              width: '100%',
              height: '100%',
              borderRadius: 10,
              borderWidth: 2,
              borderColor: 'blue',
            },
          ]}
        />
      )}
    </View>
  );
}

function EndOnboarding() {
  const { colors } = useCustomTheme();
  const dispatch = useAppDispatch();
  const { appearance, report, notification } = useAppSelector((state) => state.appConfig);
  const [rowStatuses, setRowStatuses] = useState([false, false, false]); // Trạng thái của từng hàng
  const translateXValues = [useSharedValue(width), useSharedValue(width), useSharedValue(width)]; // Giá trị translateX cho từng hàng

  useEffect(() => {
    updateOnboardingSettings({ appearance, report, notification }).then((res) => {
      // Bắt đầu hiệu ứng sau khi API thành công
      startAnimation();
    });
  }, []);

  const startAnimation = async () => {
    for (let i = 0; i < 3; i++) {
      // Đợi 1.2 giây giữa các hàng
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // Cập nhật trạng thái của hàng hiện tại
      setRowStatuses((prev) => {
        const newStatuses = [...prev];
        newStatuses[i] = true;
        return newStatuses;
      });
      // Kích hoạt hoạt ảnh di chuyển từ phải qua trái
      translateXValues[i].value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });
    }
    setTimeout(() => {
      markUserAsOnboarded()
        .then(() => {
          dispatch(
            updateAppAuthState({
              isOnboarded: true,
            }),
          );
        })
        .catch(() => {
          showToast({
            type: 'error',
            text2: 'Có lỗi xảy ra, vui lòng thử lại.',
          });
        });
    }, 500);
  };

  return (
    <View style={commonStyle.containerCenter}>
      <Text color={colors.primary} fontSize={24} style={commonStyle.title} numberOfLines={2}>
        Hoàn tất thiết lập...
      </Text>
      {['Giao diện', 'Báo cáo', 'Thông báo'].map((label, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ translateY: translateXValues[index].value }],
            opacity: rowStatuses[index] ? 1 : 0,
          };
        });

        return (
          <Animated.View key={index} style={[endBoardingStyle.row, animatedStyle]}>
            <LoadingIndicator isCompleted={rowStatuses[index]} />
            <View style={endBoardingStyle.stepLoading}>
              <Text>{label}</Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

export default EndOnboarding;
