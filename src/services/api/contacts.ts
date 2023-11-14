import {
  queryAddNewContact,
  queryAllContact,
  queryDeleteContact,
  queryUpdateContact,
} from 'database/querying';

export async function getAllContact(text?: string) {
  try {
    return await queryAllContact(text);
  } catch (error) {
    return [];
  }
}

export async function addNewContact(text: string) {
  try {
    return await queryAddNewContact(text);
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

export async function updateContact({ id, text }: { id: string; text: string }) {
  try {
    return await queryUpdateContact({ id, text });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

export async function deleteContact(id: string) {
  try {
    return await queryDeleteContact(id);
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}
