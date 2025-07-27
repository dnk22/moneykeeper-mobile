import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { field, text, date, children, readonly } from '@nozbe/watermelondb/decorators';
import { ACCOUNTS, BALANCE, TRANSACTIONS } from 'database/constants';

export default class AccountModel extends Model {
  static table = ACCOUNTS;

  static associations: Associations = {
    [TRANSACTIONS]: { type: 'has_many', foreignKey: 'accountId' },
    [BALANCE]: { type: 'has_many', foreignKey: 'accountId' },
  };

  @text('remoteId') remoteId!: string;
  @text('accountName') accountName!: string;
  @text('accountLogo') accountLogo!: string;
  @field('initialAmount') initialAmount!: number;
  @field('accountTypeId') accountTypeId!: number;
  @field('bankId') bankId!: string;
  @field('currency') currency!: string;
  @text('descriptions') descriptions!: string;
  @field('isActive') isActive!: boolean;
  @field('excludeReport') excludeReport!: boolean;
  @field('userId') userId!: string;
  @field('sortOrder') sortOrder!: number;
  @field('termType') termType!: number;
  @field('termMonth') termMonth!: number;
  @field('interestRate') interestRate!: number;
  @field('interestPaymentType') interestPaymentType!: number;
  @field('dueType') dueType!: number;
  @date('startDate') startDate!: Date;
  @date('endDate') endDate!: Date;
  @field('interestPaymentToAccount') interestPaymentToAccount!: string;
  @field('savingFromAccountId') savingFromAccountId!: string;
  @field('numberDayOfYear') numberDayOfYear!: number;

  //credit card
  @field('isCCReminder') isCCReminder!: boolean;
  @field('creditCardReminderList') creditCardReminderList!: string;
  @field('creditCardStatementDay') creditCardStatementDay!: number;
  @field('creditCardDayAfterStatement') creditCardDayAfterStatement!: number;

  // tracking
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;

  // @children(TRANSACTIONS) financeTransaction!: any;
  @children(BALANCE) balance!: any;

  async markAsDeleted() {
    // delete all transaction and balance record related
    await super.markAsDeleted();
    await this.balance.destroyAllPermanently();
    // await this.financeTransaction.destroyAllPermanently();
  }
}
