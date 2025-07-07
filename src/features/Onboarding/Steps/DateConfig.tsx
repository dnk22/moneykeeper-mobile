import { View } from 'react-native';
import Text from 'components/Text';
import FastImage from 'react-native-fast-image';
import { welcome } from 'assets/images/Illustration';
import { welComeStyles, commonStyle } from './styles';

function DateConfig() {
  return (
    <View style={welComeStyles.containerCenter}>
      <FastImage
        defaultSource={welcome}
        source={welcome}
        style={welComeStyles.image}
        resizeMode="contain"
      />
      <Text fontSize={26} style={commonStyle.title}>
        Hành trình tài chính của bạn
      </Text>
      <View style={welComeStyles.note}>
        <Text fontSize={12} numberOfLines={3} style={welComeStyles.subTitle}>
          Tiết kiệm dễ dàng, chi tiêu thông minh.
        </Text>
        <Text fontSize={12} numberOfLines={3} style={welComeStyles.subTitle}>
          Hãy cùng chúng tôi tạo nên thói quen tốt mỗi ngày bạn nhé!
        </Text>
      </View>
    </View>
  );
}

export default DateConfig;
