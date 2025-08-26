import { useEffect, useState } from 'react';
import { TransactionCategoryParamProps } from 'navigation/types';
import { useForm, useWatch } from 'react-hook-form';
import { TTransactionsCategory } from 'database/types';
import { ROUTES } from 'navigation/constants/routes';
import { TransactionCategoryModel } from 'database/models';
import { deleteCategoryById, updateTransactionCategory } from 'services/api/transactionsCategory';
import { categoriesLocalQuery } from 'database/querying/categories';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constants';
import { showToast } from 'utils/system';

function useHook({
  route,
  navigation,
}: {
  route: TransactionCategoryParamProps<typeof ROUTES.UPDATE_TRANSACTION_CATEGORY>['route'];
  navigation: TransactionCategoryParamProps<
    typeof ROUTES.UPDATE_TRANSACTION_CATEGORY
  >['navigation'];
}) {
  const { params } = route;
  const [parentGroup, setParentGroup] = useState<TransactionCategoryModel | undefined>(undefined);

  const formMethods = useForm<TTransactionsCategory>({
    defaultValues: {
      isSystem: false,
      useCount: 0,
      parentId: null,
    },
  });
  const { handleSubmit, reset, setValue, getValues } = formMethods;
  const parentId = useWatch({ control: formMethods.control, name: 'parentId' });

  useEffect(() => {
    if (params?.transactionCategoryId) {
      categoriesLocalQuery.getCategoryById(params.transactionCategoryId).then((res) => {
        reset(res);
      });
    }
  }, [params?.transactionCategoryId]);

  useEffect(() => {
    if (params?.icon) {
      setValue('icon', params.icon);
    }
  }, [params?.icon]);

  useEffect(() => {
    setValue('categoryType', params?.type || TRANSACTION_CATEGORY_TYPE.EXPENSE);
  }, [params?.type]);

  useEffect(() => {
    if (params?.parentId) {
      setValue('parentId', params.parentId);
    } else {
      handleOnDeleteParent();
    }
  }, [params?.parentId]);

  useEffect(() => {
    if (parentId) {
      categoriesLocalQuery.getCategoryById(parentId).then((res) => {
        setParentGroup(res);
      });
    } else {
      setValue('parentId', null);
      setParentGroup(undefined);
    }
  }, [parentId]);

  const handleOnSelectParent = () => {
    navigation.navigate(ROUTES.PARENT_LIST, {
      type: params.type || getValues('categoryType'),
    });
  };

  const handleOnDeleteParent = () => {
    setValue('parentId', null);
    setParentGroup(undefined);
  };

  const handleOnDeleteIcon = () => {
    setValue('icon', '');
  };

  const handleOnDeleteRecord = async () => {
    const id = getValues('id');
    if (id) {
      deleteCategoryById(id).then(() => {
        navigation.goBack();
      });
    }
  };

  const onFormSubmit = (category: TTransactionsCategory) => {
    updateTransactionCategory({ category })
      .then(() => {
        navigation.goBack();
      })
      .catch(() => {
        showToast({
          type: 'error',
          text2: 'Cập nhật danh mục thất bại',
        });
      });
  };

  return {
    formMethods,
    parentGroup,
    handleSubmit,
    handleOnSelectParent,
    handleOnDeleteRecord,
    handleOnDeleteParent,
    handleOnDeleteIcon,
    onFormSubmit,
  };
}

export default useHook;
