import * as accountIcon from 'assets/images/account';
import * as bankIcon from 'assets/images/banks';
import * as transactionCategoryIcon from 'assets/images/transactionCategory';
import * as transactionTypeIcon from 'assets/images/transactionType';
import * as reportIcon from 'assets/images/report';
const transferUp = require('assets/images/transactionCategory/transferUp.png');
const transferDown = require('assets/images/transactionCategory/transferDown.png');
import * as commonIcon from 'assets/images/common';

const imgSrc = {
  ...accountIcon,
  ...bankIcon,
  ...transactionCategoryIcon,
  ...transactionTypeIcon,
  ...commonIcon,
  ...reportIcon,
  transferDown,
  transferUp,
};

export default imgSrc;
