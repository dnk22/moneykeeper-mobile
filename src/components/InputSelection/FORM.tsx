import { TextInput } from 'react-native';
import { useController } from 'react-hook-form';

function Form({ name, control, rules }: any) {
  const {
    field: { value },
  } = useController({
    name,
    control,
    rules,
  });

  return <TextInput value={value} style={{ display: 'none' }} />;
}

export default Form;
