import React, { useCallback, useMemo } from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { css, useAPIClient, useCompile, usePlugin } from '@nocobase/client';

import WorkflowPlugin from '.';
import { useFlowContext } from './FlowContext';
import { NAMESPACE } from './locale';
import { Instruction } from './nodes';
import useStyles from './style';

interface AddButtonProps {
  upstream;
  branchIndex?: number | null;
  [key: string]: any;
}

export function AddButton(props: AddButtonProps) {
  const { upstream, branchIndex = null } = props;
  const { instructions } = usePlugin(WorkflowPlugin);
  const compile = useCompile();
  const api = useAPIClient();
  const { workflow, refresh, triggerTypes, exceptTypes = [] } = useFlowContext() ?? {};
  const _instructionList = Array.from(instructions.getValues()) as Instruction[];
  const { styles } = useStyles();

  const groups = useMemo(() => {
    const instructionList = _instructionList.filter(({type})=>{ return !exceptTypes.includes(type)})
    if (!triggerTypes) {
      return [
        { key: 'control', label: `{{t("Control", { ns: "${NAMESPACE}" })}}` },
        { key: 'collection', label: `{{t("Collection operations", { ns: "${NAMESPACE}" })}}` },
        { key: 'manual', label: `{{t("Manual", { ns: "${NAMESPACE}" })}}` },
        { key: 'extended', label: `{{t("Extended types", { ns: "${NAMESPACE}" })}}` },
      ]
        .filter((group) => instructionList.filter((item) => item.group === group.key).length)
        .map((group) => {
          const groupInstructions = instructionList.filter(
            (item) =>
              item.group === group.key &&
              (item.isAvailable ? item.isAvailable({ workflow, upstream, branchIndex }) : true),
          );

          return {
            ...group,
            type: 'group',
            children: groupInstructions.map((item) => ({
              role: 'button',
              'aria-label': item.type,
              key: item.type,
              label: item.title,
              type: item.options ? 'subMenu' : null,
              children: item.options
                ? item.options.map((option) => ({
                    role: 'button',
                    'aria-label': option.key,
                    key: option.key,
                    label: option.label,
                  }))
                : null,
            })),
          };
        });
    } else {
      return instructionList
        .filter(
          (item) =>
            triggerTypes.includes(item.type) &&
            (item.isAvailable ? item.isAvailable({ workflow, upstream, branchIndex }) : true),
        )
        .map((item) => {
          return {
            role: 'button',
            'aria-label': item.type,
            key: item.type,
            label: item.title,
          };
        });
    }
  }, [branchIndex, _instructionList, upstream, workflow, triggerTypes, exceptTypes]);
  const resource = useMemo(() => {
    if (!workflow) {
      return null;
    }
    return api.resource('workflows.nodes', workflow.id);
  }, [workflow?.id]);
  const onCreate = useCallback(
    async ({ keyPath }) => {
      const type = keyPath.pop();
      const config = {};
      const [optionKey] = keyPath;
      const instruction = instructions.get(type);
      if (optionKey) {
        const { value } = instruction.options?.find((item) => item.key === optionKey) ?? {};
        Object.assign(config, typeof value === 'function' ? value() : value);
      }

      if (resource) {
        await resource.create({
          values: {
            type,
            upstreamId: upstream?.id ?? null,
            branchIndex,
            title: compile(instruction.title),
            config,
          },
        });
        refresh();
      }
    },
    [branchIndex, resource?.create, upstream?.id],
  );

  const menu = useMemo<MenuProps>(() => {
    return {
      onClick: onCreate,
      items: compile(groups),
    };
  }, [groups, onCreate]);

  if (!workflow) {
    return null;
  }

  return (
    <div className={styles.addButtonClass}>
      <Dropdown
        trigger={['click']}
        menu={menu}
        disabled={workflow.executed}
        overlayClassName={css`
          .ant-dropdown-menu-root {
            max-height: 30em;
            overflow-y: auto;
          }
        `}
      >
        <Button aria-label={props['aria-label'] || 'add-button'} shape="circle" icon={<PlusOutlined />} />
      </Dropdown>
    </div>
  );
}
