import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';
import BankSection from '../BankSection';

const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
  useFocusEffect: jest.fn(),
}));

jest.mock('database/querying', () => ({
  queryGetBankById: jest.fn(() =>
    Promise.resolve({ id: '1', icon: 'test-icon', bankName: 'Test Bank' }),
  ),
}));

describe('BankSection Component', () => {
  const FormWrapper = ({ children }) => {
    const methods = useForm({
      defaultValues: {
        accountTypeId: 1,
        bankId: '',
      },
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it('renders with placeholder text', () => {
    const { getByText } = render(
      <FormWrapper>
        <BankSection />
      </FormWrapper>,
    );

    expect(getByText('Chọn ngân hàng')).toBeTruthy();
  });

  it('navigates to bank selection screen when pressed', () => {
    const { getByText } = render(
      <FormWrapper>
        <BankSection />
      </FormWrapper>,
    );

    fireEvent.press(getByText('Chọn ngân hàng'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.any(Object),
      }),
    );
  });

  it('displays selected bank when bankId is provided', async () => {
    const { getByText } = render(
      <FormWrapper>
        <BankSection bankIdParam="1" />
      </FormWrapper>,
    );

    await waitFor(() => {
      expect(getByText('Test Bank')).toBeTruthy();
    });
  });
});
