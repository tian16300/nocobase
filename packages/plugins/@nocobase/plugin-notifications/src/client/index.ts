import { Plugin } from '@nocobase/client';
import { NotificationSetting } from './page';

class NotificationPlugin extends Plugin {
  async load() {
    this.app.pluginSettingsManager.add('notification-settings',{
      title: '通知设置',
      icon:'BellOutlined',
      name: 'notification-settings',
      Component: NotificationSetting
    });
  }
}

export default NotificationPlugin;
