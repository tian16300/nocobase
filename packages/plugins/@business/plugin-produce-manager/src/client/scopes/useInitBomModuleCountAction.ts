import { useAPIClient, useRecord } from '@nocobase/client';
import { message } from 'antd';
export const useInitBomModuleCountAction = (props: any) => {
  const api = useAPIClient();
  const record = useRecord();
  const prjId = record.id;
  return {
    async run() {
      const res = await api.resource('bom_wl_list').getPrjModules({
        prjId: prjId,
      });
      if (res.status === 200) {
        message.success('操作成功');
      }
    },
  };
};
