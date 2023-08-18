import { View } from 'react-native';
import { SvgIcon, InputField } from 'components/index';
import styles from '../../styles.common';

type RelatedPersonSelectProps = {
  control: any;
  title: string;
};

function RelatedPersonSelect({ control, title }: RelatedPersonSelectProps) {
  return (
    <View style={styles.itemGroup}>
      <SvgIcon name="people" style={styles.icon} />
      <View style={styles.groupContent}>
        <InputField
          name="relatedPerson"
          control={control}
          placeholder={title}
          style={styles.formInput}
          maxLength={20}
          rules={{ require: true }}
        />
        {/* <SvgIcon name="location" size={18} style={styles.iconForward} /> */}
      </View>
    </View>
  );
}
export default RelatedPersonSelect;
