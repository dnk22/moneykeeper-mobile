import React, { useState } from 'react';
import PressableHaptic from 'components/PressableHaptic';
import { RNText, SvgIcon } from 'components/index';
import { View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useCustomTheme } from 'resources/theme';

function MoreDetail({ children }: { children: React.ReactNode }) {
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
  const { colors } = useCustomTheme();

  const handleOnShowDetail = () => {
    setIsShowDetails(!isShowDetails);
  };

  return (
    <View>
      <Collapsible collapsed={!isShowDetails}>{children}</Collapsible>
      <PressableHaptic
        style={[
          {
            alignItems: 'center',
            paddingVertical: 10,
            backgroundColor: colors.surface,
            borderRadius: 10,
            marginBottom: 10,
          },
        ]}
        onPress={handleOnShowDetail}
      >
        <RNText>{isShowDetails ? 'Ẩn chi tiết' : 'Hiển thị chi tiết'}</RNText>
        <SvgIcon name={isShowDetails ? 'arrowUp' : 'arrowDown'} size={16} />
      </PressableHaptic>
    </View>
  );
}
export default MoreDetail;
