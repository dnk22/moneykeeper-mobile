import { Button, View } from 'react-native';

function TransactionCategoryHeaderRight({
  onPress,
  isUpdateMode,
}: {
  onPress: () => void;
  isUpdateMode: boolean;
}) {
  return (
    <View>
      {isUpdateMode ? (
        <Button title="Hủy" onPress={onPress} />
      ) : (
        <Button title="Sửa" onPress={onPress} />
      )}
    </View>
  );
}
export default TransactionCategoryHeaderRight;
