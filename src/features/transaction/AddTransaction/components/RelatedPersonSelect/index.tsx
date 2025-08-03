import React, { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFormContext } from 'react-hook-form';
import Contact from 'features/common/Contact';
import InputSelection from 'components/InputSelection';
import BottomSheet from 'components/BottomSheetModal';

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
        fieldName={fieldName}
        displayValue={watch(fieldName)}
        placeholder={title}
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
