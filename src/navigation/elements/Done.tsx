import { Button, ButtonProps } from 'react-native';

function Done({ onPress, title = 'Xong', ...rest }: ButtonProps) {
  return <Button title={title} color="white" onPress={onPress} {...rest}></Button>;
}

export default Done;
