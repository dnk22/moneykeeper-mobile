import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import SvgIcon from '../SvgIcon';

interface IModalNavigationHeaderBarProps {
  text: {
    title?: string;
    confirm?: string;
  };
  onBack?: () => void;
}

function ModalNavigationHeaderBar({
  text,
  onBack,
}: IModalNavigationHeaderBarProps) {
  const { colors } = useCustomTheme();
  const titleStyle = !onBack ? 'center' : 'left';
  return (
    <>
      <View style={styles.container}>
        <View style={styles.center}>
          <Text
            style={[
              { color: colors.text, textAlign: titleStyle },
              styles.titleText,
            ]}
          >
            {text.title || 'Modal'}
          </Text>
        </View>
        {onBack && (
          <TouchableOpacity style={styles.right} onPress={onBack}>
            <SvgIcon name="closeCircle" color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

export default memo(ModalNavigationHeaderBar, isEqual);
