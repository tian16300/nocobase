
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabsProps } from 'antd';
import { css } from '@nocobase/client';
// import { useTabsContext } from '@nocobase/client';
export const usePrjTabsProps = () => {
    // const contextProps = useTabsContext();
    const [searchParams, setSearchParams] = useSearchParams();
    // console.log('contextProps', contextProps);
    // contextProps.activeKey =  searchParams.get('tab');
    const onTabChange = useCallback<TabsProps['onChange']>(
        (key) => {
          const prjId = searchParams.get('id');
          const params:{ tab:string, id?:string } = {
            tab: key
          };
          if(prjId){
            params.id = prjId;
          }
          setSearchParams(params);
        },
        [setSearchParams],
      );
  
    //   contextProps.activeKey = searchParams.get('tab');
  return {
    activeKey : searchParams.get('tab'),
    onChange: onTabChange,
    className: css`
     .nb-block-item.ant-nb-card-item > .ant-card > .ant-card-body{
       padding: 0
     }
    `
  };
};
