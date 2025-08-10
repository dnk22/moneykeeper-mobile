export const VIEW_OPTION: { [key: string]: 'useCount' | 'lastUseAt' } = {
  useCount: 'useCount',
  lastUseAt: 'lastUseAt',
};

export const MENU_DATA: Array<{
  id: string;
  title: string;
  state: 'on' | 'off';
}> = [
  {
    id: VIEW_OPTION.useCount,
    title: 'Hay sử dụng',
    state: 'off',
  },
  {
    id: VIEW_OPTION.lastUseAt,
    title: 'Sử dụng gần đây',
    state: 'on',
  },
];

export const mapTitle: { [key: string]: string } = {
  [VIEW_OPTION.lastUseAt]: 'Sử dụng gần đây',
  [VIEW_OPTION.useCount]: 'Hay sử dụng',
};
