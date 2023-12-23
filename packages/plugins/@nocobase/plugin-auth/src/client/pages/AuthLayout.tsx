import { css } from '@emotion/css';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card, Space, Typography } from 'antd';
import { PoweredBy, useAPIClient, useRequest, useSystemSettings } from '@nocobase/client';
import { AuthenticatorsContext } from '../authenticator';
const { Title } = Typography;
export function AuthLayout(props: any) {
  const { data } = useSystemSettings();
  const api = useAPIClient();
  const { data: authenticators = [], error } = useRequest(() =>
    api
      .resource('authenticators')
      .publicList()
      .then((res) => {
        return res?.data?.data || [];
      }),
  );

  if (error) {
    throw error;
  }

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: 'url(/storage/uploads/sys/login.jpg)',
        backgroundSize: 'cover',
      }}
    >
      <div style={{ maxWidth: 1920, margin: '0 auto', height: '100%', position: 'relative' }}>
        <div className="sys-logo" style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <Space align="center">
            <div
              style={{
                width: 64,
                height: 64,
                backgroundImage: 'url(/storage/uploads/sys/favicon/apple-touch-icon.png)',
                backgroundSize: 'cover',
              }}
            ></div>
            <div>
              <Title level={3} style={{ fontWeight: 'bold', marginBottom: 4 }}>
                {' '}
                {data?.data?.title}
              </Title>
              <div>{data?.data?.companyName}</div>
            </div>
          </Space>
        </div>
        <div
          style={{
            width: 400,
            position: 'absolute',
            top: '30vh',
            right: '30vw',
          }}
        >
          <Card
            style={{
              boxShadow: '0 2px 20px 1px rgba(79,79,79,.1)',
              background: 'linear-gradient(rgba(255,255,255,.5), white)',
              borderRadius: '20px',
            }}
            bodyStyle={{
              padding: '36px 30px',
            }}
          >
            {/* {data?.data?.title} */}
            <Title level={4} style={{ marginBottom: '20px' }}>
              用户登录
            </Title>
            <AuthenticatorsContext.Provider value={authenticators as any}>
              <Outlet />
            </AuthenticatorsContext.Provider>
            <div
              className={css`
                position: absolute;
                bottom: 24px;
                width: 100%;
                left: 0;
                text-align: center;
              `}
            ></div>
          </Card>
        </div>
        <div className="powered-by" style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}
