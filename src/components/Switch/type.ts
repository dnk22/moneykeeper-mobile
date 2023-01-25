import { Control } from 'react-hook-form';
import { SwitchProps } from 'react-native';

export type ISwitchProps = SwitchProps;
export interface ISwitchFieldProps extends ISwitchProps {
  name: string;
  control: Control<any, any>;
}
