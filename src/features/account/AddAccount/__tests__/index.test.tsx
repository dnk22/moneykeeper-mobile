import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import configureStore from 'redux-mock-store';
import AddAccount from '../index';

const mockStore = configureStore([]);
const mockNavigation = {
  goBack: jest.fn(),
  setOptions: jest.fn(),
};
const mockRoute = {
  params: {},
};

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
  useRoute: () => mockRoute,
}));

jest.mock('database/querying', () => ({
  queryAccountById: jest.fn(() => Promise.resolve(null)),
  queryGetBankById: jest.fn(() =>
    Promise.resolve({ id: '1', icon: 'bank-icon', bankName: 'Test Bank' }),
  ),
}));

jest.mock('services/api/accounts', () => ({
  requestUpdateAccount: jest.fn(() => Promise.resolve('account-id-1')),
  requestDeleteAccount: jest.fn(() => Promise.resolve()),
}));

describe('AddAccount Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      account: {
        statements: {},
      },
    });
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <NavigationContainer>
          <AddAccount />
        </NavigationContainer>
      </Provider>,
    );

  it('renders initial form correctly', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    expect(getByPlaceholderText('Tên tài khoản')).toBeTruthy();
    expect(getByPlaceholderText('Ghi chú')).toBeTruthy();
    expect(getByText('Không tính vào báo cáo')).toBeTruthy();
  });

  it('handles account name input', async () => {
    const { getByPlaceholderText } = renderComponent();
    const accountNameInput = getByPlaceholderText('Tên tài khoản');

    fireEvent.changeText(accountNameInput, 'Test Account');
    expect(accountNameInput.props.value).toBe('Test Account');
  });

  it('shows bank selection when appropriate account type is selected', async () => {
    const { getByText } = renderComponent();

    // Open account type modal
    const accountTypeButton = getByText('Tiền mặt');
    fireEvent.press(accountTypeButton);

    // Select bank account type
    const bankAccountOption = getByText('Tài khoản ngân hàng');
    fireEvent.press(bankAccountOption);

    await waitFor(() => {
      expect(getByText('Chọn ngân hàng')).toBeTruthy();
    });
  });

  it('handles form submission correctly', async () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    // Fill required fields
    fireEvent.changeText(getByPlaceholderText('Tên tài khoản'), 'Test Account');

    // Submit form
    const saveButton = getByText('Lưu');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('shows credit card specific fields for credit card type', async () => {
    const { getByText } = renderComponent();

    // Open account type modal
    const accountTypeButton = getByText('Tiền mặt');
    fireEvent.press(accountTypeButton);

    // Select credit card type
    const creditCardOption = getByText('Thẻ tín dụng');
    fireEvent.press(creditCardOption);

    await waitFor(() => {
      expect(getByText('Hạn mức thẻ')).toBeTruthy();
    });
  });

  it('handles account deletion in edit mode', async () => {
    mockRoute.params = { accountId: 'test-account-id' };
    const { getByText } = renderComponent();

    const deleteButton = getByText('Xóa');
    fireEvent.press(deleteButton);

    // Confirm deletion
    const confirmButton = getByText('Đồng ý');
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
