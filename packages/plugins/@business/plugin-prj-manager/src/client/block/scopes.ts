import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabsProps } from 'antd';
import { css } from '@nocobase/client';
export const usePrjTabsProps = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const onTabChange = useCallback<TabsProps['onChange']>(
    (key) => {
      const prjId = searchParams.get('id');
      const params: { tab: string; id?: string } = {
        tab: key,
      };
      if (prjId) {
        params.id = prjId;
      }
      setSearchParams(params);
    },
    [setSearchParams],
  );
  const activeKey = searchParams.get('tab');
  return {
    ...(activeKey ? { activeKey } : {}),
    onChange: onTabChange,
    className: css`
      .ant-tabs-tabpane
        > .nb-grid
        > .nb-grid-row
        > .nb-grid-col
        > .nb-block-item.ant-nb-card-item
        > .ant-card
        > .ant-card-body {
        padding: 0;
      }
    `,
  };
};
