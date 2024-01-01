
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabsProps } from 'antd';
import { useTabsContext } from '@nocobase/client';
export const usePrjTabsProps = () => {
    const contextProps = useTabsContext();
    const [searchParams, setSearchParams] = useSearchParams();
    console.log('contextProps', contextProps);
    contextProps.activeKey =  searchParams.get('tab');
    contextProps.onChange = useCallback<TabsProps['onChange']>(
        (key) => {
          setSearchParams([['tab', key]], {
            replace: true,
          });
        },
        [setSearchParams],
      );
  
    //   contextProps.activeKey = searchParams.get('tab');
  return {
  
  };
};
