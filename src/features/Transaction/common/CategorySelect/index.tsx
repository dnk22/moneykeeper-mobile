import InputSelection from 'components/InputSelection';

function CategorySelect({ name, control, errors }) {
  return (
    <InputSelection
      required
      name={name}
      control={control}
      error={errors[name]}
      icon={icon}
      title="Chọn danh mục"
      value={transactionCategorySelected?.categoryName}
      onSelect={onSlec}
    />
  );
}
export default CategorySelect;
