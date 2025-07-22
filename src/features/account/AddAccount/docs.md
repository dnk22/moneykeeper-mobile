# Add/Edit Account Flow Documentation

## Overview

This feature allows users to create new accounts or edit existing ones in the MoneyKeeper app. It supports various account types including bank accounts, e-wallets, and credit cards.

## Components Structure

```
AddAccount/
├── index.tsx (Main component)
├── styles.ts (Shared styles)
├── utility.ts (Helper functions)
├── AccountTypeSection/
│   ├── index.tsx
│   └── ModalPicker/
│       ├── index.tsx
│       └── styles.ts
├── BankSection/
│   └── index.tsx
└── CreditCardSection/
    ├── index.tsx
    └── Notifications/
        ├── index.tsx
        └── styles.ts
```

## Flow Steps

1. **Initial Form Setup**

   - Form is initialized using `react-hook-form` with default values from `ADD_ACCOUNT_DEFAULT_VALUES`
   - If editing existing account (has `accountId` param), fetch account data and populate form
   - Setup navigation header with save button

2. **Account Type Selection**

   - User can select account type through `AccountTypeSection`
   - Opens modal picker with available account types (Cash, Bank, Credit Card, etc.)
   - When type changes:
     - Reset relevant fields ( initialAmount)
     - Clear bank selection if switching to type that doesn't need bank

3. **Bank Selection (Conditional)**

   - Only shown for account types that need bank selection (Bank, Credit Card, E-wallet)
   - Bank picker navigates to a separate bank selection screen
   - Selected bank updates:
     - Bank ID
     - Account logo
     - Bank name display

4. **Credit Card Specific Fields (Conditional)**

   - Only shown when account type is Credit Card
   - Includes:
     - Credit limit instead of initial balance
     - Statement day selection
     - Payment due date selection
     - Payment reminders configuration with options:
       - On due date
       - 3 days before
       - 1 week before

5. **Common Fields**

   - Account name (required)
   - Initial balance (except for credit cards)
   - Description (optional)
   - Exclude from reports toggle

6. **Form Submission Process**

### Create New Account Flow

1. **Form Initialization**

   - Form opens with `ADD_ACCOUNT_DEFAULT_VALUES`
   - No accountId in navigation params
   - Initial balance set to 0
   - Credit card limit set to 0 (if credit card type)

2. **Required Validations**

   - Account name cannot be empty
   - Account type must be selected
   - Bank must be selected (for bank/credit card types)
   - Credit card specific fields if applicable:
     - Statement day must be set
     - Payment due date must be set

3. **Submission Steps**

   ```typescript
   const handleFormSubmit = (data: TAccount) => {
     // 1. Format account data
     const requestData = formatAccountData(data);

     // 2. Call API to create/update account
     requestUpdateAccount({ id: data?.id, account: requestData })
       .then((accountId) => {
         // 3. Handle credit card specific settings
         if (isCreditCard) {
           dispatch(
             updateAccountStatement({
               [accountId]: {
                 statementDate,
                 paymentDate,
                 isReminder,
                 reminderList,
               },
             }),
           );
         }
         // 4. Navigate back
         navigation.goBack();
       })
       .catch(showError);
   };
   ```

4. **Success Actions**

   - Account saved to local database
   - Redux store updated (for credit cards)
   - Navigate back to previous screen
   - Success toast shown

5. **Error Handling**
   - Validation errors shown inline
   - API errors shown in toast
   - Form remains editable

### Update Existing Account Flow

1. **Form Initialization**

   - Has accountId in navigation params
   - Fetch existing account data:

   ```typescript
   useEffect(() => {
     if (params?.accountId) {
       queryAccountById(params.accountId).then((account) => reset(account));
     }
   }, [params?.accountId]);
   ```

   - Populate all fields with existing data

2. **Field Updates**

   - Any field can be modified
   - Bank can be changed
   - Account type cannot be changed
   - Credit card settings fully editable

3. **Update Validation**

   - Same validations as create flow
   - Additional checks for existing transactions
   - Verify account name uniqueness

4. **Update Submission**

   - Same formatting as create flow
   - Updates existing record instead of creating new
   - Maintains transaction history
   - Updates statement settings if credit card

5. **Special Cases**

   - Credit Card Updates:
     ```typescript
     if (requestData.accountTypeId === ACCOUNT_CATEGORY_ID.CREDITCARD) {
       // Update statement notifications
       dispatch(
         updateAccountStatement({
           [accountId]: {
             statementDate: requestData.creditCardStatementDay,
             paymentDate: requestData.creditCardDayAfterStatement,
             isReminder: requestData.isCCReminder,
             reminderList: requestData.creditCardReminderList,
           },
         }),
       );
     } else {
       // Remove statement settings if changed from credit card
       dispatch(removeAccountStatement(accountId));
     }
     ```

6. **Success/Error Handling**
   - Success:
     - Data saved
     - Redux updated
     - Navigate back
     - Success toast
   - Error:
     - Toast error message
     - Form remains in edit state
     - No navigation

### Data Processing

```typescript
// Format account data before submission
const formatAccountData = (data: TAccount) => ({
  ...data,
  // Set initial amount based on account type
  initialAmount: data.accountTypeId !== ACCOUNT_CATEGORY_ID.CREDITCARD ? +data?.initialAmount : 0,
  // Handle credit card reminder settings
  creditCardReminderList: data.isCCReminder ? data.creditCardReminderList : '',
});
```

### Account Type-Specific Behaviors

1. **Regular Account**

   - Initial balance required
   - Bank selection optional
   - No statement settings

2. **Bank Account**

   - Initial balance required
   - Bank selection required
   - Bank logo automatically set
   - No statement settings

3. **Credit Card**

   - Credit limit instead of balance
   - Bank selection required
   - Statement day required
   - Payment day required
   - Optional reminder settings

4. **E-Wallet**

   - Initial balance required
   - Provider selection required
   - No statement settings

5. **Account Deletion (Edit Mode Only)**
   - Shows delete confirmation
   - Warns about related transaction deletion
   - Removes account and related data
   - Updates Redux store

## Key Features

### Data Persistence

- Account data saved to local database
- Credit card statement settings stored in Redux
- Bank information linked via relations

### Validation

- Required fields: Account name, Account type
- Bank selection required for relevant account types
- Credit card specific validations

### UI/UX Considerations

- Keyboard aware scrolling
- Form field grouping
- Consistent styling with app theme
- Modal pickers for better mobile experience

## State Management

- Form state: React Hook Form
- App state: Redux (for statement notifications)
- Local state: Modal visibility, selections

## Notes

- Credit card accounts have special handling for statements and reminders
- Account types determine available fields and validations
- Bank selection is deeply integrated with the bank management feature
