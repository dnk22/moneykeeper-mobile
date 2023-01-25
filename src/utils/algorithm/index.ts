/**
 * Find object in array with @param
 * Return value, if @param id is valid string
 *
 * @param id is string
 */

export function findObjectInArrayById(array: any, id: string) {
  const idIndex = array.map((x) => x.id).indexOf(id);
  return {
    idx: idIndex,
    value: array[idIndex],
  };
}
