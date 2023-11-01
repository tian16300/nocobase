import { css } from '@emotion/css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useToken } from '../schema-component';
import { useSystemSettings } from '../system-settings';

export const PoweredBy = () => {
  const { i18n } = useTranslation();
  const { token } = useToken();
  const { data } = useSystemSettings();
  const urls = {
    'en-US': 'https://www.nocobase.com',
    'zh-CN': 'https://cn.nocobase.com',
  };
  return (
    <div
      className={css`
        text-align: center;
        color: ${token.colorTextDescription};
        a {
          color: ${token.colorTextDescription};
          &:hover {
            color: ${token.colorText};
          }
        }
      `}
    >
      {data?.data?.poweredBy}
    </div>
  );
};
