import { DragOutlined } from '@ant-design/icons';
import { useFieldSchema } from '@formily/react';
import { DragHandler, useGetAriaLabelOfDesigner, useSchemaInitializerRender } from '@nocobase/client';
import { Space } from 'antd';
import React from 'react';

export const GroupTableGroupRecordActionDesigner = (props: any) => {
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer']);
  const { getAriaLabel } = useGetAriaLabelOfDesigner();
  return (
    <div className={'general-schema-designer'}>
      <div className={'general-schema-designer-icons'}>
        <Space size={2} align={'center'}>
          <DragHandler>
            <DragOutlined role="button" aria-label={getAriaLabel('drag-handler')} />
          </DragHandler>
          {render()}
        </Space>
      </div>
    </div>
  );
};
