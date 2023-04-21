import { Button, ButtonProps } from 'react-native';

function ButtonText({ onPress, title = 'Xong', ...rest }: ButtonProps) {
  return <Button title={title} color="white" onPress={onPress} {...rest}></Button>;
}

export default ButtonText;
