# Add Account Feature Test Cases

## Component: AddAccount (index.tsx)

### Form Rendering & Basic Functionality
- [x] Renders initial form with all required fields
  - Account name input field
  - Description input field
  - Exclude from report toggle
  - Initial amount/Credit limit field based on account type

### Account Type Selection & Display
- [x] Shows appropriate initial amount field label based on account type
  - Shows "Số dư ban đầu" for regular accounts
  - Shows "Hạn mức thẻ" for credit cards
- [x] Handles account type change correctly
  - Displays bank selection for appropriate account types
  - Hides bank selection for cash/investment accounts
  - Resets related fields when changing account types

### Bank Selection
- [x] Shows bank selection field for appropriate account types
  - Visible for bank accounts
  - Visible for credit cards
  - Hidden for cash accounts
- [x] Navigates to bank selection screen
- [x] Updates form with selected bank information

### Credit Card Specific Features
- [x] Shows credit card specific fields when credit card type is selected
  - Credit limit input
  - Statement day selection
  - Payment due date selection
  - Reminder settings

### Form Submission
- [x] Validates required fields before submission
  - Account name is required
  - Bank selection required for bank/credit card accounts
- [x] Handles successful form submission
  - Saves account data
  - Updates Redux store for credit card statements
  - Navigates back to previous screen
- [x] Handles submission errors
  - Shows error toast
  - Keeps form in editable state

### Edit Mode
- [x] Loads existing account data correctly
- [x] Updates fields with existing values
- [x] Handles account deletion
  - Shows confirmation dialog
  - Deletes account on confirmation
  - Updates Redux store
  - Navigates back on success

### Error Cases
- [ ] Handles network errors during submission
- [ ] Validates duplicate account names
- [ ] Handles invalid bank IDs
- [ ] Validates credit card payment dates

## Component: BankSection

### Rendering
- [x] Renders with correct placeholder text based on account type
  - "Chọn ngân hàng" for bank accounts
  - "Chọn nhà cung cấp" for e-wallets

### Bank Selection
- [x] Navigates to bank selection screen when pressed
- [x] Displays selected bank information when bankId is provided
- [x] Updates form values when bank is selected
  - Sets bankId
  - Sets account logo
  - Updates display name

### State Management
- [x] Updates bank selection on focus return
- [ ] Handles bank data fetch errors
- [ ] Clears selection when account type changes to non-bank type

## Future Test Cases

### Performance
- [ ] Test re-rendering optimization
- [ ] Test form state updates efficiency
- [ ] Test modal opening/closing performance

### Accessibility
- [ ] Test screen reader compatibility
- [ ] Test keyboard navigation
- [ ] Test color contrast compliance

### Edge Cases
- [ ] Handle very long bank/account names
- [ ] Test with maximum number of reminders
- [ ] Test with various currency formats
- [ ] Test form state persistence

### Integration Tests
- [ ] Test integration with bank list feature
- [ ] Test integration with transaction history
- [ ] Test integration with account statement notifications

Notes:
- [x] indicates implemented test cases
- [ ] indicates pending test cases
- Tests are located in `/src/features/AddAccount/__tests__/`
- Main test files: `index.test.tsx` and `BankSection.test.tsx`
