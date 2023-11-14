import { Q } from '@nozbe/watermelondb';
import { CONTACT } from 'database/constants';
import { database } from 'database/index';
import { ContactModel } from 'database/models';

export const queryAllContact = async (text = ' ') => {
  try {
    return await database.read(async () => {
      return await database
        .get<ContactModel>(CONTACT)
        .query(
          Q.where('_status', Q.notEq('deleted')),
          Q.where('contactName', Q.like(`%${Q.sanitizeLikeString(text)}%`)),
          Q.sortBy('contactName', Q.asc),
        )
        .unsafeFetchRaw();
    });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const queryCheckContactExist = async (text: string) => {
  const queryString = `SELECT count(contactName) as contactCount FROM ${CONTACT} WHERE _status != 'deleted' AND contactName='${text}'`;
  return await database.read(async () => {
    return await database
      .get<ContactModel>(CONTACT)
      .query(Q.unsafeSqlQuery(queryString))
      .unsafeFetchRaw();
  });
};

export const queryAddNewContact = async (text: string) => {
  const checkExistContact = await queryCheckContactExist(text);
  if (!!checkExistContact[0].contactCount) {
    return {
      success: true,
    };
  }
  return await database.write(async () => {
    database.get<ContactModel>(CONTACT).create((item) => {
      item.contactName = text;
    });
    return {
      success: true,
    };
  });
};
export const queryUpdateContact = async ({ id, text }: { id: string; text: string }) => {
  return await database.write(async () => {
    const contactItem = await database.get<ContactModel>(CONTACT).find(id);
    await contactItem.update((item) => {
      item.contactName = text;
    });
    return {
      success: true,
    };
  });
};

export const queryDeleteContact = async (id: string) => {
  return await database.write(async () => {
    const contactItem = await database.get<ContactModel>(CONTACT).find(id);
    await contactItem.markAsDeleted();
    return {
      success: true,
    };
  });
};
