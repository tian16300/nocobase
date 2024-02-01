
import { useAPIClient, useRecord } from '@nocobase/client';
// import { useGroupTableBlockResource } from '@domain/plugin-common/client';
import { message } from 'antd';
export const useInitBomModuleCountAction = (props: any) => {
  const api = useAPIClient();
  const record = useRecord();
  const prjId = record.id;
  // const { field } = useGroupTableBlockResource();
  return {
    async run() {
      const res = await api.resource('bom_wl_list').getPrjModules({
        prjId: prjId,
      });
      if (res.status === 200) {
        message.success('操作成功');
        // 刷新group
        // field?.data?.group?.service.refresh();
      }
    },
  };
};
