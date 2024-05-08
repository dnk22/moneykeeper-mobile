import React, { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFormContext } from 'react-hook-form';
import { BottomSheet, InputSelection } from 'components/index';
import Contact from 'features/Contact';

function RelatedPersonSelect({
  title,
  fieldName,
  required,
}: {
  title: string;
  fieldName: string;
  required?: boolean;
}) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<any>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOnSelectContact = () => {
    bottomSheetModalRef.current?.present();
  };

  const onSelectContact = (name: string) => {
    setValue(fieldName, name);
    bottomSheetModalRef.current?.close();
  };

  return (
    <>
      <InputSelection
        required={required}
        defaultIcon={'user'}
        name={fieldName}
        value={watch(fieldName)}
        title={title}
        control={control}
        error={errors[fieldName]}
        onSelect={handleOnSelectContact}
        onDelete={() => setValue(fieldName, '')}
      />
      <BottomSheet ref={bottomSheetModalRef} index={1}>
        <Contact onItemPress={onSelectContact} readOnly />
      </BottomSheet>
    </>
  );
}
export default RelatedPersonSelect;
