import { Control } from 'react-hook-form';

export interface ISegmentedControlFieldProps {
  name: string;
  control: Control<any, any>;
  style: any;
  values: string[];
  [key: string]: any;
}
