import { IconProps } from 'components/SvgIcon/const';

interface ISettingsRouteItem {
  link: string;
  name: string;
  icon: IconProps;
}
interface ISettingRoutes {
  [key: string]: { key: string; child: ISettingsRouteItem[] };
}
export const settingRoutes: ISettingRoutes = {
  settings: {
    key: 'settings',
    child: [
      {
        link: 'general',
        name: 'Cài đặt chung',
        icon: 'settings',
      },
      {
        link: 'appearance',
        name: 'Giao diện',
        icon: 'text',
      },
      {
        link: 'notifications',
        name: 'Thông báo',
        icon: 'bellBadge',
      },
      {
        link: 'sync',
        name: 'Đồng bộ cloud',
        icon: 'cloudSync',
      },
    ],
  },
  more: {
    key: 'more',
    child: [
      {
        link: 'help-feedback',
        name: 'Giúp đỡ & Phản hồi',
        icon: 'claim',
      },
      {
        link: 'Term',
        name: 'Terms of Service',
        icon: 'questionCircle',
      },
    ],
  },
};
