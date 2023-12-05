import { useAPIClient, useBlockRequestContext } from '@nocobase/client';
import {  message } from 'antd';
export const syncUsersFromDingTalk = () => {
  const api = useAPIClient();
  const {service} = useBlockRequestContext();
  return {
    confirm:{
        title: '同步钉钉用户',
        content: '确认同步钉钉用户？'
    },
    async onClick() {
     const res =  await api
        .resource('users')
        .syncFromDingTalk();
     if(res){
        message.success(res.data?.data);
        service?.refresh();
     }
    }
  };
};
