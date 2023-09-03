import { Plugin } from '@nocobase/client';
import DicManagerProvider from './DicManagerProvider';

class DicManagerPlugin extends Plugin {
  async load() { 
    this.app.use(DicManagerProvider);
  }
}

export default DicManagerPlugin;
