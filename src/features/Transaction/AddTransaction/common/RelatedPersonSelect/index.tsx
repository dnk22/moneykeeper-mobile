import React, { useContext, useEffect, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFormContext } from 'react-hook-form';
import { BottomSheet, InputSelection } from 'components/index';
import Contact from 'features/Contact';
import { TransactionContext } from '../../constant';

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
  const { lendBorrowData } = useContext(TransactionContext);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOnSelectContact = () => {
    bottomSheetModalRef.current?.present();
  };

  const onSelectContact = (name: string) => {
    setValue('relatedPerson', name);
    bottomSheetModalRef.current?.close();
  };

  useEffect(() => {
    const noteText = getValues('descriptions') ? getValues('descriptions').split(':') : '';
    if (
      (!getValues('descriptions') && getValues('relatedPerson')) ||
      Object.values(lendBorrowData).includes(noteText[0].trim())
    ) {
      setValue(
        'descriptions',
        `${lendBorrowData[getValues('categoryId')]} : ${getValues('relatedPerson')}`,
      );
    }
  }, [getValues('categoryId'), getValues('relatedPerson')]);

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
      <BottomSheet ref={bottomSheetModalRef} index={1}>
        <Contact onItemPress={onSelectContact} readOnly />
      </BottomSheet>
    </>
  );
}
export default RelatedPersonSelect;
