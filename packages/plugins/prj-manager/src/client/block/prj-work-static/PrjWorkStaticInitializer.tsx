import React from 'react';
import { FormOutlined } from '@ant-design/icons';
// import { useTranslation } from 'react-i18next';
import { SchemaInitializer } from '@nocobase/client';



export const PrjWorkStaticInitializer = (props) => {
  const { insert } = props;
  // const { t } = useTranslation();
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-designer': 'PrjWorkStatic.Designer',
          'x-decorator': 'PrjWorkStatic.Decorator',
          'x-component': 'PrjWorkStatic',
          'x-editable': false
        });
      }}
    />
  );
};
