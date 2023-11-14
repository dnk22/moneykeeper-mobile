import React, { useMemo, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFormContext } from 'react-hook-form';
import { BottomSheet, InputSelection } from 'components/index';
import Contact from 'features/Contact';

type RelatedPersonSelectProps = {
  title: string;
};

function RelatedPersonSelect({ title }: RelatedPersonSelectProps) {
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<any>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOnSelectContact = () => {
    bottomSheetModalRef.current?.present();
  };

  const onSelectContact = (name: string) => {
    console.log(name, 'name');
    setValue('relatedPerson', name);
    bottomSheetModalRef.current?.close();
  };

  return (
    <>
      <InputSelection
        required
        icon="people"
        name="relatedPerson"
        value={watch('relatedPerson')}
        title={title}
        control={control}
        error={errors['relatedPerson']}
        onSelect={handleOnSelectContact}
      />
      <BottomSheet ref={bottomSheetModalRef} snapPoints={['80%']}>
        <Contact onItemPress={onSelectContact} />
      </BottomSheet>
    </>
  );
}
export default RelatedPersonSelect;
