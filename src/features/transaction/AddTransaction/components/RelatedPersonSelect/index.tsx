import React, { useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Contact from 'features/common/Contact';
import InputSelection from 'components/InputSelection';
import BottomSheet, { TrueSheet } from 'components/BottomSheetModal';

function RelatedPersonSelect({
  title,
  fieldName,
  required,
}: {
  title: string;
  fieldName: string;
  required?: boolean;
}) {
  const { setValue, control } = useFormContext<any>();
  const bottomSheetModalRef = useRef<TrueSheet>(null);

  const fieldValue = useWatch({
    control,
    name: fieldName,
  });

  const handleOnSelectContact = () => {
    bottomSheetModalRef.current?.present();
  };

  const onSelectContact = (name: string) => {
    setValue(fieldName, name);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <>
      <InputSelection
        iconName="user"
        iconSize={26}
        required={required}
        fieldName={fieldName}
        displayValue={fieldValue}
        placeholder={title}
        onSelect={handleOnSelectContact}
        onDelete={() => setValue(fieldName, '')}
      />
      <BottomSheet ref={bottomSheetModalRef}>
        <Contact onItemPress={onSelectContact} readOnly />
      </BottomSheet>
    </>
  );
}
export default RelatedPersonSelect;
