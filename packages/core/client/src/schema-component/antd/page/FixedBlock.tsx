import { css } from '@emotion/css';
import { useField, useFieldSchema } from '@formily/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecord } from '../../../record-provider';
import { useDesignable } from '../../hooks';
import { useIsBlockInPage } from './hooks/useIsBlockInPage';
import { SchemaSettingsSwitchItem, SchemaSettingsActionModalItem } from '../../../schema-settings';
import { useSize } from 'ahooks';
import { useBlockRequestContext } from '../../../block-provider/BlockProvider';

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
const FixedBlockWrapperContext = React.createContext<any>({});

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
export const useFixedBlockWrapper = () => {
  return useContext(FixedBlockWrapperContext);
};

export const FixedBlockWrapper: React.FC<{ fixedBlock?: boolean; name?: string; height?: null }> = (props: any) => {
  const field = useField();
  // const fixedBlock = useFixedSchema();
  // const { height, fixedBlockUID } = useFixedBlock();
  const __parent = useFixedBlockWrapper();

  const [height, setHeight] = useState(props?.height);
  const fixedBlock = props?.fixedBlock || field?.decoratorProps?.fixedBlock;

  // const record = useRecord();
  // const isPopup = Object.keys(record).length;
  const ref = useRef<HTMLDivElement>(null);
  // if (isPopup) {
  //   return <>{props.children}</>;
  // }
  // const size = useSize(ref?.current?.closest('.ant-tabs-tabpane'));
  useEffect(() => {
    if (props?.height) {
      setHeight(props.height);
    } else if (!__parent || !__parent?.height) {
      //在tab 面板中
      // 容器
      const pageDom: any = ref?.current?.closest('.ant-tabs-tabpane') || ref?.current?.closest('.nb-page-wrapper');
      if (pageDom) {
        let style = window.getComputedStyle(pageDom);
        let paddingTop = parseFloat(style.paddingTop);
        let paddingBottom = parseFloat(style.paddingBottom);
        const rectHeight = pageDom?.getBoundingClientRect().height - paddingTop - paddingBottom;
        if (rectHeight > 0) setHeight(rectHeight);
      }
    } else {
      setHeight(__parent?.height);
    }
  }, [__parent, __parent?.height, ref?.current, props?.height]);

  // debugger;
  /**
   * The fixedBlockUID of false means that the page has no fixed blocks
   * isPopup means that the FixedBlock is in the popup mode
   */
  // if (!fixedBlock && fixedBlockUID) return null;
  // const otherHeight = field?.decoratorProps?.otherHeight;
  // const vHeight = otherHeight ? `calc(100vh - ${height} - ${otherHeight})` : `calc(100vh - ${height})`;
  // debugger;

  return (
    <div
      ref={ref}
      className={[
        'nb-fixed-block',
        props?.name ? `nb-fixed-block-${props?.name || 'normal'}` : '',

        fixedBlock
          ? css`
              & > .nb-block-item {
                height: 100%;
                > .ant-card {
                  height: 100%;
                  > .ant-card-body {
                    height: 100%;
                  }
                }
              }
            `
          : '',
      ].join(' ')}
      style={{
        height: fixedBlock && height ? height : undefined,
      }}
    >
      <FixedBlockWrapperContext.Provider
        value={{
          // __parent,
          height,
        }}
      >
        {props.children}
      </FixedBlockWrapperContext.Provider>
    </div>
  );
};

export const FixedBlockDesignerItem = () => {
  const field = useField();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  const { inFixedBlock } = useFixedBlock();
  const { isBlockInPage } = useIsBlockInPage();
  const { service } = useBlockRequestContext();

  if (!isBlockInPage() || !inFixedBlock) {
    return null;
  }

  const onFixedBlockPropsSubmit = async ({ otherHeight }) => {
    const decoratorProps = {
      ...fieldSchema['x-decorator-props'],
      otherHeight,
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
        required: true,
      },
    },
  };
  return (
    <>
      <SchemaSettingsSwitchItem
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
          service?.refresh?.();
      }}
      />
      {fieldSchema['x-decorator-props']?.fixedBlock ? (
        <SchemaSettingsActionModalItem
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
