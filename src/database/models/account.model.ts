import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators';
import { ACCOUNTS } from 'database/constants';

export default class AccountModel extends Model {
  static table = ACCOUNTS;

  static associations: Associations = {
    transactions: { type: 'has_many', foreignKey: 'accountId' },
  };

  @text('accountName') accountName!: string;
  @text('accountLogo') accountLogo!: string;
  @field('initialAmount') initialAmount!: number;
  @field('accountTypeId') accountTypeId!: number;
  @field('accountTypeName') accountTypeName!: string;
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
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  //credit card
  @field('numberDayOfYear') creditCardLimit!: number;
  @field('creditCardIsReminder') creditCardIsReminder!: boolean;
  @field('creditCardReminderList') creditCardReminderList!: string;
  @field('creditCardPaymentDay') creditCardPaymentDay!: number;
  @field('creditCardStatementDay') creditCardStatementDay!: number;
  @field('creditCardDayAfterStatement') creditCardDayAfterStatement!: number;

  @children('transaction') transaction!: any;
}
