import { css } from '@emotion/css';
import { Col, Layout, Row, Space, theme } from 'antd';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import {
  ACLRolesCheckProvider,
  CurrentAppInfoProvider,
  CurrentUser,
  NavigateIfNotSignIn,
  PinnedPluginList,
  RemoteCollectionManagerProvider,
  RemoteSchemaTemplateManagerPlugin,
  RemoteSchemaTemplateManagerProvider,
  SchemaComponent,
  findByUid,
  findMenuItem,
  useACLRoleContext,
  useAdminSchemaUid,
  useDocumentTitle,
  useRequest,
  useSystemSettings,
  useToken,
} from '../../../';
import { Plugin } from '../../../application/Plugin';
import { useAppSpin } from '../../../application/hooks/useAppSpin';
import { useCollectionManager } from '../../../collection-manager';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button } from 'antd';

const { Header, Sider, Content } = Layout;
const filterByACL = (schema, options) => {
  const { allowAll, allowMenuItemIds = [] } = options;
  if (allowAll) {
    return schema;
  }
  const filterSchema = (s) => {
    if (!s) {
      return;
    }
    for (const key in s.properties) {
      if (Object.prototype.hasOwnProperty.call(s.properties, key)) {
        const element = s.properties[key];
        if (element['x-uid'] && !allowMenuItemIds.includes(element['x-uid'])) {
          delete s.properties[key];
        }
        if (element['x-uid']) {
          filterSchema(element);
        }
      }
    }
  };
  filterSchema(schema);
  return schema;
};

const SchemaIdContext = createContext(null);
const useMenuProps = () => {
  const defaultSelectedUid = useContext(SchemaIdContext);
  return {
    selectedUid: defaultSelectedUid,
    defaultSelectedUid,
    mode: 'inline',
  };
};

const MenuEditor = (props) => {
  const { setTitle } = useDocumentTitle();
  const navigate = useNavigate();
  const params = useParams<any>();
  const isMatchAdmin = useMatch('/admin');
  const isMatchAdminName = useMatch('/admin/:name');
  const defaultSelectedUid = params.name;
  const { sideMenuRef } = props;
  const ctx = useACLRoleContext();
  const [current, setCurrent] = useState(null);
  const onSelect = ({ item }) => {
    const schema = item.props.schema;
    setTitle(schema.title);
    setCurrent(schema);
    navigate(`/admin/${schema['x-uid']}`);
  };
  const { render } = useAppSpin();
  const adminSchemaUid = useAdminSchemaUid();
  const { data, loading } = useRequest<{
    data: any;
  }>(
    {
      url: `/uiSchemas:getJsonSchema/${adminSchemaUid}`,
    },
    {
      refreshDeps: [adminSchemaUid],
      onSuccess(data) {
        const schema = filterByACL(data?.data, ctx);
        // url 为 `/admin` 的情况
        if (isMatchAdmin) {
          const s = findMenuItem(schema);
          if (s) {
            navigate(`/admin/${s['x-uid']}`);
            setTitle(s.title);
          } else {
            navigate(`/admin/`);
          }
          return;
        }

        // url 不为 `/admin/xxx` 的情况，不做处理
        if (!isMatchAdminName) return;

        // url 为 `admin/xxx` 的情况
        const s = findByUid(schema, defaultSelectedUid);
        if (s) {
          setTitle(s.title);
        } else {
          const s = findMenuItem(schema);
          if (s) {
            navigate(`/admin/${s['x-uid']}`);
            setTitle(s.title);
          } else {
            navigate(`/admin/`);
          }
        }
      },
    },
  );

  useEffect(() => {
    const properties = Object.values(current?.root?.properties || {}).shift()?.['properties'] || data?.data?.properties;
    if (properties && sideMenuRef.current) {
      const pageType = Object.values(properties).find(
        (item) => item['x-uid'] === params.name && item['x-component'] === 'Menu.Item',
      );
      if (pageType) {
        sideMenuRef.current.style.display = 'none';
      } else {
        sideMenuRef.current.style.display = 'block';
      }
    }
  }, [data?.data, params.name, sideMenuRef]);

  const schema = useMemo(() => {
    const s = filterByACL(data?.data, ctx);
    if (s?.['x-component-props']) {
      s['x-component-props']['useProps'] = useMenuProps;
    }
    return s;
  }, [data?.data]);
  if (loading) {
    return render();
  }
  return (
    <SchemaIdContext.Provider value={defaultSelectedUid}>
      <SchemaComponent memoized scope={{ useMenuProps, onSelect, sideMenuRef, defaultSelectedUid }} schema={schema} />
    </SchemaIdContext.Provider>
  );
};

// export const InternalAdminLayout = (props: any) => {
//   const sideMenuRef = useRef<HTMLDivElement>();
//   const result = useSystemSettings();
//   const { service } = useCollectionManager();
//   const params = useParams<any>();
//   const { token } = useToken();
//   const { render } = useAppSpin();

//   return (
//     <Layout>
//       <Layout.Header
//         className={css`
//           .ant-menu.ant-menu-dark .ant-menu-item-selected,
//           .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected,
//           .ant-menu-submenu-horizontal.ant-menu-submenu-selected {
//             background-color: ${token.colorBgHeaderMenuActive};
//             color: ${token.colorTextHeaderMenuActive};
//           }
//           .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
//             background-color: ${token.colorBgHeaderMenuHover};
//             color: ${token.colorTextHeaderMenuHover};
//           }

//           position: fixed;
//           left: 0;
//           right: 0;
//           height: var(--nb-header-height);
//           line-height: var(--nb-header-height);
//           padding: 0;
//           z-index: 100;
//           background-color: ${token.colorBgHeader};

//           .ant-menu {
//             background-color: transparent;
//           }

//           .ant-menu-item {
//             color: ${token.colorTextHeaderMenu};
//           }
//         `}
//       >
//         <div
//           className={css`
//             position: relative;
//             width: 100%;
//             height: 100%;
//             display: flex;
//           `}
//         >
//           <div
//             className={css`
//               position: relative;
//               z-index: 1;
//               flex: 1 1 auto;
//               display: flex;
//               height: 100%;
//             `}
//           >
//             <div
//               className={css`
//                 width: 200px;
//                 display: inline-flex;
//                 flex-shrink: 0;
//                 color: #fff;
//                 padding: 0;
//                 align-items: center;
//               `}
//             >
//               <img
//                 className={css`
//                   padding: 0 16px;
//                   object-fit: contain;
//                   width: 100%;
//                   height: 100%;
//                 `}
//                 src={result?.data?.data?.logo?.url}
//               />
//             </div>
//             <div
//               className={css`
//                 flex: 1 1 auto;
//                 width: 0;
//               `}
//             >
//               <MenuEditor sideMenuRef={sideMenuRef}  />
//             </div>
//           </div>
//           <div
//             className={css`
//               position: relative;
//               flex-shrink: 0;
//               height: 100%;
//               z-index: 10;
//             `}
//           >
//             <PinnedPluginList />
//             <CurrentUser />
//           </div>
//         </div>
//       </Layout.Header>
//       {params.name && (
//         <Layout.Sider
//           className={css`
//             height: 100%;
//             /* position: fixed; */
//             position: relative;
//             left: 0;
//             top: 0;
//             background: rgba(0, 0, 0, 0);
//             z-index: 100;
//             .ant-layout-sider-children {
//               top: var(--nb-header-height);
//               position: fixed;
//               width: 200px;
//               height: calc(100vh - var(--nb-header-height));
//             }
//           `}
//           theme={'light'}
//           ref={sideMenuRef}
//         ></Layout.Sider>
//       )}
//       <Layout.Content
//         className={css`
//           display: flex;
//           flex-direction: column;
//           position: relative;
//           overflow-y: auto;
//           height: 100vh;
//           max-height: 100vh;
//           > div {
//             position: relative;
//           }
//           .ant-layout-footer {
//             position: absolute;
//             bottom: 0;
//             text-align: center;
//             width: 100%;
//             z-index: 0;
//             padding: 0px 50px;
//           }
//         `}
//       >
//         <header
//           className={css`
//             flex-shrink: 0;
//             height: var(--nb-header-height);
//             line-height: var(--nb-header-height);
//             background: transparent;
//             pointer-events: none;
//           `}
//         ></header>
//         {service.contentLoading ? render() : <Outlet />}
//       </Layout.Content>
//     </Layout>
//   );
// };

export const InternalAdminLayout = (props: any) => {
  const [collapsed, setCollapsed] = useState(false);

  const sideMenuRef = useRef<HTMLDivElement>();
  const result = useSystemSettings();
  const { service } = useCollectionManager();
  const params = useParams<any>();
  const { token } = useToken();
  const { render } = useAppSpin();
  const { colorBgContainer, colorBorder } = token;

  return (
    <Layout style={{ height: '100%' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        className={css`
          position: relative;
          z-index: 3;
        `}
      >
        <div
          className={css`
            padding: 9px 20px;
            // text-align: center;
            width: 100%;
            overflow: hidden;
          `}
        >
          <img height={32} src={result?.data?.data?.logo?.url} />
        </div>
        <div ref={sideMenuRef} style={{ height: 'calc(100% - 51px)' }}>
          <MenuEditor sideMenuRef={sideMenuRef} />
        </div>
      </Sider>
      <Layout>
        <Header
          className={css`
            padding: 0 10px;
            height: 50px;
            line-height: 50px;
            background: ${colorBgContainer};
            box-shadow:
              0 1px 2px 0 rgba(0, 0, 0, 0.03),
              0 1px 6px -1px rgba(0, 0, 0, 0.02),
              0 2px 4px 0 rgba(0, 0, 0, 0.02);
            position: relative;
            z-index: 2;
          `}
        >
          <Row>
            <Col flex="auto">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 32,
                  height: 32,
                }}
              />
            </Col>
            <Col
              flex="300px"
              className={css`
                text-align: right;
              `}
            >
              <Space>
                <PinnedPluginList />
                <CurrentUser />
              </Space>
            </Col>
          </Row>
        </Header>
        <Content
          className={css`
            position: relative;
            z-index: 1;
            padding: 0;
            height: 100%;
          `}
        >
          {service.contentLoading ? render() : <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export const AdminProvider = (props) => {
  return (
    <CurrentAppInfoProvider>
      <NavigateIfNotSignIn>
        <RemoteSchemaTemplateManagerProvider>
          <RemoteCollectionManagerProvider>
            <ACLRolesCheckProvider>{props.children}</ACLRolesCheckProvider>
          </RemoteCollectionManagerProvider>
        </RemoteSchemaTemplateManagerProvider>
      </NavigateIfNotSignIn>
    </CurrentAppInfoProvider>
  );
};

export const AdminLayout = (props) => {
  return (
    <AdminProvider>
      <InternalAdminLayout {...props} />
    </AdminProvider>
  );
};

export class AdminLayoutPlugin extends Plugin {
  async afterAdd() {
    await this.app.pm.add(RemoteSchemaTemplateManagerPlugin);
  }
  async load() {
    this.app.addComponents({ AdminLayout });
  }
}
