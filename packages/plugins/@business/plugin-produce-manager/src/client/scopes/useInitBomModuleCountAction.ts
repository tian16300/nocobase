import { useAPIClient, useRecord } from "@nocobase/client";

export const useInitBomModuleCountAction = (props: any) => {
  const api = useAPIClient();
  const record = useRecord();
  const prjId = record.id;
  return {
    async run() {
      const res = await api.resource('prj').getPrjModules({
        prjId: prjId
      });
      alert('项目模块');
    }
  };
};
