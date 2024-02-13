
require : 
    Khi chọn type , reset category
    Khi chọn category có type khác transaction type , change transaction type 

- Chọn category : handleOnSelectTransactionCategory
    + set screen name
    + map screen name with category type 
    + navigation to category select screen
    khi category có type khác với transaction type thì thay đổi type mới bằng category type
---------------------------------------------------------------------------------------
Flow transaction: 
Add new : 
    - Expense Income: 
        + add data into transaction table
        + update useCount category
        + balance : - add data balance table : 
                    - update all balance after transaction date
    - Transfer:
        + add data into transaction table
        + balance : - add data to balance table (accountId and toAccountId)
                    - update all balance after transaction date
Update :
    Expense Income : 
        + update data in transaction table
        + check category : update if needed
        + check balance : 
            transfer => expenseIncome: remove balance from toAccount (if new accountId equal toAccountId, remove balance from accountId)
        + update all balance after transaction date - accountId
    Transfer : 
        + update data in transaction table
        + check balance : 
            update balance data with account and toAccountId if needed
            - exception: expenseIncome => transfer: add new balance from toAccount
        + update all balance after transaction date - accountId and toAccountId
Remove : 
    + remove transaction table
    + balance : 
        - transfer : remove balance in accountId and toAccountId, update all balance after transaction date (accountId and toAccountId)
        - normal : remove balance in accountId, update all balance after transaction date (accountId and toAccountId)
---------------------------------------------------------------------------------------
Flow Account: 
Add new :
    + add data to account table
        - credit card : 
            add statement date to redux store 
            add reminder date to redux store
        else add normal flow by data from user input
Update : 
    + update data in account table
        normal account => credit card : 
            update statement and reminder to store (follow by Flow above)
        credit card => normal account : 
            remove statement and reminder from redux store
            remove trigger notifications of statement and payment
    + update all balance after transaction date
Remove : 
    + remove data in account table 
    + remove all balance with accountId
    + remove statement and payment from redux store
    + update all balance after transaction date