import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useField, useFieldSchema } from '@formily/react';
import { css } from '@emotion/css';
import { SchemaSettings } from '../../../schema-settings';
import { useTranslation } from 'react-i18next';
import { useDesignable } from '../../hooks';
import { useRecord } from '../../../record-provider';

const FixedBlockContext = React.createContext<{
  setFixedBlock: (value: string | false) => void;
  height: number | string;
  fixedBlockUID: boolean | string;
  fixedBlockUIDRef: React.MutableRefObject<boolean | string>;
  inFixedBlock: boolean;
}>({
  setFixedBlock: () => {},
  height: 0,
  fixedBlockUID: false,
  fixedBlockUIDRef: { current: false },
  inFixedBlock: false,
});

export const useFixedSchema = () => {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { setFixedBlock, fixedBlockUID, fixedBlockUIDRef } = useFixedBlock();
  const hasSet = useRef(false);

  useEffect(() => {
    if (!fixedBlockUIDRef.current || hasSet.current) {
      setFixedBlock(field?.decoratorProps?.fixedBlock ? fieldSchema['x-uid'] : false);
      hasSet.current = true;
    }
  }, [field?.decoratorProps?.fixedBlock]);

  return fieldSchema['x-uid'] === fixedBlockUID;
};

export const useFixedBlock = () => {
  return useContext(FixedBlockContext);
};

export const FixedBlockWrapper: React.FC = (props) => {
  const field = useField();
  const fixedBlock = useFixedSchema();
  const { height, fixedBlockUID } = useFixedBlock();
  const record = useRecord();
  const isPopup = Object.keys(record).length;
  if (isPopup) {
    return <>{props.children}</>;
  }
  /**
   * The fixedBlockUID of false means that the page has no fixed blocks
   * isPopup means that the FixedBlock is in the popup mode
   */
  if (!fixedBlock && fixedBlockUID) return null;
  const otherHeight = field?.decoratorProps?.otherHeight;
  const vHeight = otherHeight ? `calc(100vh - ${height} - ${otherHeight})` : `calc(100vh - ${height})`;

  return (
    <div
      className="nb-fixed-block"
      style={{
        height: fixedBlockUID ? vHeight : undefined,
      }}
    >
      {props.children}
    </div>
  );
};




export const FixedBlockDesignerItem = () => {
  const field = useField();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  const record = useRecord();
  const { inFixedBlock } = useFixedBlock();

  if (Object.keys(record).length || !inFixedBlock) {
    return null;
  }

  const onFixedBlockPropsSubmit = async ({otherHeight}) => {
    const decoratorProps = {
      ...fieldSchema['x-decorator-props'],
      otherHeight
    };
    await dn.emit('patch', {
      schema: {
        ['x-uid']: fieldSchema['x-uid'],
        'x-decorator-props': decoratorProps,
      },
    });
    field.decoratorProps = fieldSchema['x-decorator-props'] = decoratorProps;
  };
  const fixedBlockPropsSchema = {
    type: 'object',
    properties: {
      otherHeight: {
        type: 'string',
        title: '其它区块高度',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        default: fieldSchema['x-decorator-props']?.otherHeight,
        required: true
      },
    },
  };
  return (
    <>
      <SchemaSettings.SwitchItem
        title={t('Fix block')}
        checked={fieldSchema['x-decorator-props']?.fixedBlock}
        onChange={async (fixedBlock) => {
          const decoratorProps = {
            ...fieldSchema['x-decorator-props'],
            fixedBlock,
          };
          await dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': decoratorProps,
            },
          });
          field.decoratorProps = fieldSchema['x-decorator-props'] = decoratorProps;
        }}
      />
      {fieldSchema['x-decorator-props']?.fixedBlock ? (
        <SchemaSettings.ModalItem
          title={t('设置固定区块属性')}
          schema={fixedBlockPropsSchema}
          onSubmit={onFixedBlockPropsSubmit}
        />
      ) : null}
    </>
  );
};

interface FixedBlockProps {
  height: number | string;
}

const fixedBlockCss = css`
  overflow: hidden;
  position: relative;
  .noco-card-item {
    height: 100%;
    .ant-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      .ant-card-body {
        height: 1px;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    }
  }
`;

const FixedBlock: React.FC<FixedBlockProps> = (props) => {
  const field = useField();
  const { height } = props;
  const [fixedBlockUID, _setFixedBlock] = useState<false | string>(false);
  const fixedBlockUIDRef = useRef(fixedBlockUID);
  const setFixedBlock = (v) => {
    fixedBlockUIDRef.current = v;
    _setFixedBlock(v);
  };
  const otherHeight = field?.decoratorProps?.otherHeight;
  const vHeight = otherHeight ? `calc(100vh - ${height} - ${otherHeight})` : `calc(100vh - ${height})`;

  return (
    <FixedBlockContext.Provider value={{ inFixedBlock: true, height, setFixedBlock, fixedBlockUID, fixedBlockUIDRef }}>
      <div
        className={fixedBlockUID ? fixedBlockCss : ''}
        style={{
          height: fixedBlockUID ? vHeight : undefined,
        }}
      >
        {props.children}
      </div>
    </FixedBlockContext.Provider>
  );
};

export default FixedBlock;
