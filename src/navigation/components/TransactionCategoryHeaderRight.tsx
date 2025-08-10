import { Edit2 } from 'iconsax-react-native';
import { Button, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';

function TransactionCategoryHeaderRight({
  onPress,
  isEditable,
}: {
  onPress: () => void;
  isEditable: boolean;
}) {
  const { colors } = useCustomTheme();
  return (
    <View style={{ width: 50, alignItems: 'flex-end' }}>
      {isEditable ? (
        <Button title="Hủy" onPress={onPress} />
      ) : (
        <Edit2 size="30" color={colors.text} onPress={onPress} />
      )}
    </View>
  );
}
export default TransactionCategoryHeaderRight;
