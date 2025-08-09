import { TTransactionsCategory } from 'database/types';
import { normalizeText } from 'utils/algorithm';

export function filterAndBuildParentChild({
  data,
  searchText = '',
  sortBy,
}: {
  data: TTransactionsCategory[];
  searchText: string;
  sortBy?: 'useCount' | 'sortOrder' | 'categoryName';
}) {
  const keyword = normalizeText(searchText.trim());
  if (!keyword) return buildParentChild(data, sortBy);

  const parents: TTransactionsCategory[] = [];
  const childrenMap: Record<string, TTransactionsCategory[]> = {};
  const parentsDirectMatch = new Set<string>();
  const parentsWithMatchedChildren = new Set<string>();
  const matchedChildrenMap: Record<string, TTransactionsCategory[]> = {};

  for (const item of data) {
    if (item.parentId === null) {
      parents.push(item);
    } else if (item.parentId) {
      if (!childrenMap[item.parentId]) childrenMap[item.parentId] = [];
      childrenMap[item.parentId].push(item);
    }

    const normalizedName = normalizeText(item.categoryName);

    if (item.parentId === null && normalizedName.includes(keyword)) {
      parentsDirectMatch.add(item.id);
    }

    if (item.parentId !== null && item.parentId !== undefined && normalizedName.includes(keyword)) {
      parentsWithMatchedChildren.add(item.parentId);
      if (!matchedChildrenMap[item.parentId]) matchedChildrenMap[item.parentId] = [];
      matchedChildrenMap[item.parentId].push(item);
    }
  }

  let result: (TTransactionsCategory & { children: TTransactionsCategory[] })[] = [];

  for (const parent of parents) {
    if (parentsDirectMatch.has(parent.id)) {
      result.push({
        ...parent,
        children: sortList(childrenMap[parent.id] || [], sortBy),
      });
    } else if (parentsWithMatchedChildren.has(parent.id)) {
      result.push({
        ...parent,
        children: sortList(matchedChildrenMap[parent.id] || [], sortBy),
      });
    }
  }

  result = sortList(result, sortBy);
  return result;
}

function buildParentChild(
  data: TTransactionsCategory[],
  sortBy?: 'useCount' | 'sortOrder' | 'categoryName',
) {
  const parents: TTransactionsCategory[] = [];
  const childrenMap: Record<string, TTransactionsCategory[]> = {};

  for (const item of data) {
    if (item.parentId === null) {
      parents.push(item);
    } else if (item.parentId) {
      if (!childrenMap[item.parentId]) childrenMap[item.parentId] = [];
      childrenMap[item.parentId].push(item);
    }
  }

  const result = parents.map((parent) => ({
    ...parent,
    children: sortList(childrenMap[parent.id] || [], sortBy),
  }));

  return sortList(result, sortBy);
}

function sortList<T extends TTransactionsCategory>(
  arr: T[],
  sortBy?: 'useCount' | 'sortOrder' | 'categoryName',
) {
  if (!sortBy) return arr;

  return [...arr].sort((a, b) => {
    switch (sortBy) {
      case 'useCount':
        return (b.useCount ?? 0) - (a.useCount ?? 0);
      case 'sortOrder':
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      case 'categoryName':
        return a.categoryName.localeCompare(b.categoryName, 'vi');
      default:
        return 0;
    }
  });
}
