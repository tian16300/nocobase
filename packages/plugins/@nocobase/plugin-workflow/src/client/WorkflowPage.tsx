import { cx, SchemaComponent } from '@nocobase/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import useStyles from './style';
import { WorkflowCanvas } from './WorkflowCanvas';
import { uid } from '@nocobase/utils';

export const WorkflowPage = () => {
  const params = useParams<any>();
  const { styles } = useStyles();

  return (
    <div className={cx(styles.workflowPageClass)}>
      <SchemaComponent
        schema={{
          name:uid(),
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
                exceptTypes:['approval', 'copyTo']
              }
            },
          },
        }}
        components={{
          WorkflowCanvas,
        }}
      />
    </div>
  );
};
