import { Edit2 } from 'iconsax-react-native';
import { Button, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';

function CategoryHeaderRight({
  onPress,
  isEditable,
}: {
  onPress: () => void;
  isEditable: boolean;
}) {
  const { colors } = useCustomTheme();
  return (
    <>
      {isEditable ? (
        <View style={{ width: 50, height: 50, alignItems: 'flex-end', justifyContent: 'center' }}>
          <Button title="Hủy" onPress={onPress} />
        </View>
      ) : (
        <Edit2 size="30" color={colors.text} onPress={onPress} />
      )}
    </>
  );
}
export default CategoryHeaderRight;
