import { observer, RecursionField, useField, useFieldSchema, useForm } from '@formily/react';
import { isPortalInBody } from '@nocobase/utils/client';
import { App, Button, Popover } from 'antd';
import classnames from 'classnames';
import lodash from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActionContext } from '../..';
import { useDesignable } from '../../';
import { Icon } from '../../../icon';
import { useRecord } from '../../../record-provider';
import { useLocalVariables, useVariables } from '../../../variables';
import { SortableItem } from '../../common';
import { useCompile, useComponent, useDesigner } from '../../hooks';
import { useProps } from '../../hooks/useProps';
import ActionContainer from './Action.Container';
import { ActionDesigner } from './Action.Designer';
import { ActionDrawer } from './Action.Drawer';
import { ActionLink } from './Action.Link';
import { ActionModal } from './Action.Modal';
import { ActionPage } from './Action.Page';
import useStyles from './Action.style';
import { ActionContextProvider } from './context';
import { useA } from './hooks';
import { ComposedAction } from './types';
import { linkageAction } from './utils';
import { RecordLink } from '@nocobase/client';

export const Action: ComposedAction = observer(
  (props: any) => {
    const {
      popover,
      confirm,
      openMode: om,
      containerRefKey,
      component,
      useAction = useA,
      className,
      icon,
      title,
      onClick,
      ...others
    } = useProps(props);
    const { wrapSSR, componentCls, hashId } = useStyles();
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [formValueChanged, setFormValueChanged] = useState(false);
    const Designer = useDesigner();
    const field = useField<any>();
    const { run, element } = useAction();
    const fieldSchema = useFieldSchema();
    const compile = useCompile();
    const form = useForm();
    const values = useRecord();
    const designerProps = fieldSchema['x-designer-props'];
    const openMode = fieldSchema?.['x-component-props']?.['openMode'];
    const disabled = form.disabled || field.disabled || field.data?.disabled || props.disabled;
    const openSize = fieldSchema?.['x-component-props']?.['openSize'];
    const toHref = fieldSchema?.['x-component-props']?.['to'];
    const linkageRules = fieldSchema?.['x-linkage-rules'] || [];
    const { designable } = useDesignable();
    const tarComponent = useComponent(component) || component;
    const { modal } = App.useApp();
    const variables = useVariables();
    const localVariables = useLocalVariables({ currentForm: { values } as any });

    let actionTitle = title || compile(fieldSchema.title);
    actionTitle = lodash.isString(actionTitle) ? t(actionTitle) : actionTitle;
    useEffect(() => {
      linkageRules
        .filter((k) => !k.disabled)
        .forEach((v) => {
          v.actions?.forEach((h) => {
            linkageAction({
              operator: h.operator,
              field,
              condition: v.condition,
              values,
              variables,
              localVariables,
            });
          });
        });
    }, [JSON.stringify(linkageRules), values, designable, field]);
    const handleButtonClick = useCallback(
      (e: React.MouseEvent) => {
        if (isPortalInBody(e.target as Element)) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (!disabled) {
          const onOk = () => {
            onClick?.(e);
            setVisible(true);
            run();
          };
          if (confirm) {
            modal.confirm({
              ...confirm,
              onOk,
            });
          } else {
            onOk();
          }
        }
      },
      [confirm, disabled, modal, onClick, run],
    );

    const buttonStyle = useMemo(() => {
      return {
        ...others.style,
        opacity: designable && field?.data?.hidden && 0.1,
      };
    }, [designable, field?.data?.hidden, others.style]);

    const renderButton = () => {
      if (!designable && field?.data?.hidden) {
        return null;
      }
    return component !== 'RecordLink' ? (
        <SortableItem
          data-testid={`${fieldSchema['x-action'] || fieldSchema.name}-action`}
          {...others}
          loading={field?.data?.loading}
          icon={icon ? <Icon type={icon} /> : null}
          disabled={disabled}
          style={buttonStyle}
          onClick={handleButtonClick}
          component={tarComponent || Button}
          className={classnames(componentCls, hashId, className, 'nb-action')}
          type={props.type === 'danger' ? undefined : props.type}
        >
          {actionTitle}
          <Designer {...designerProps} />
        </SortableItem>
      ) : (
        <SortableItem
          {...others}
          loading={field?.data?.loading}
          icon={icon ? <Icon type={icon} /> : null}
          disabled={disabled}
          style={{
            ...others.style,
            opacity: designable && field?.data?.hidden && 0.1,
          }}
          component={'span'}
          className={classnames(componentCls, hashId, className)}
          type={props.type === 'danger' ? undefined : props.type}
        >
          <RecordLink {...others} to={toHref}>
            {actionTitle}
          </RecordLink>
          <Designer {...designerProps} />
        </SortableItem>
      );
    };

    return wrapSSR(
      <ActionContextProvider
        button={renderButton()}
        visible={visible}
        setVisible={setVisible}
        formValueChanged={formValueChanged}
        setFormValueChanged={setFormValueChanged}
        openMode={openMode}
        openSize={openSize}
        containerRefKey={containerRefKey}
        fieldSchema={fieldSchema}
      >
        {popover && <RecursionField basePath={field.address} onlyRenderProperties schema={fieldSchema} />}
        {!popover && renderButton()}
        {!popover && props.children}
        {element}
      </ActionContextProvider>,
    );
  },
  { displayName: 'Action' },
);

Action.Popover = observer(
  (props) => {
    const { button, visible, setVisible } = useActionContext();
    return (
      <Popover
        {...props}
        destroyTooltipOnHide
        open={visible}
        onOpenChange={(visible) => {
          setVisible(visible);
        }}
        content={props.children}
      >
        {button}
      </Popover>
    );
  },
  { displayName: 'Action.Popover' },
);

Action.Popover.Footer = observer(
  (props) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        {props.children}
      </div>
    );
  },
  { displayName: 'Action.Popover.Footer' },
);

Action.Link = ActionLink;
Action.Designer = ActionDesigner;
Action.Drawer = ActionDrawer;
Action.Modal = ActionModal;
Action.Container = ActionContainer;
Action.Page = ActionPage;

export default Action;
