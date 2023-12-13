import { DownOutlined, EllipsisOutlined, RightOutlined } from '@ant-design/icons';
import {
  ActionContextProvider,
  ResourceActionProvider,
  SchemaComponent,
  cx,
  useApp,
  useDocumentTitle,
  useResourceActionContext,
  useResourceContext,
} from '@nocobase/client';
import { str2moment } from '@nocobase/utils/client';
import { App, Breadcrumb, Button, Dropdown, Result, Spin, Switch, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { lang } from './locale';
// import { executionSchema } from './schemas/executions';
import useStyles from './style';
// import { linkNodes } from './utils';
// import { getWorkflowDetailPath } from './constant';


export function FlowCanvas() {
  const params = {id: 94};
  const { styles } = useStyles();

  return (
    <div className={cx(styles.workflowPageClass)}>
      <SchemaComponent
        schema={{
          type: 'void',
          properties: {
            [`provider_${params.id}`]: {
              type: 'void',
              'x-decorator': 'ResourceActionProvider',
              'x-decorator-props': {
                collection: {
                  name: 'workflows',
                  fields: [],
                },
                resourceName: 'workflows',
                request: {
                  resource: 'workflows',
                  action: 'get',
                  params: {
                    filter: { id: params.id },
                    appends: [
                      'nodes',
                      'revisions.id',
                      'revisions.createdAt',
                      'revisions.current',
                      'revisions.executed',
                      'revisions.enabled',
                    ],
                  },
                },
              },
              'x-component': 'WorkflowCanvas',
              'x-component-props':{
                triggerTypes:['approval', 'copyTo']
              }
            },
          },
        }}
      />
    </div>)
}
