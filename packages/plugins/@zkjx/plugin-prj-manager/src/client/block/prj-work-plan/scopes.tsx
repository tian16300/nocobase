import React, { useEffect } from 'react';
import {
  useAPIClient,
  useBlockRequestContext,
  useRecord,
  useRequest,
  useTableBlockProps,
} from '@nocobase/client';
import { getValuesByPath } from '@nocobase/utils/client';
import { useField, useFieldSchema } from '@formily/react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space, message } from 'antd';
import { usePrjWorkPlanProviderContext } from './PrjWorkPlanProvider';
import { groupData } from '@nocobase/plugin-gantt/client';
const addIndex = (children, parentIndex) => {
  if (children) {
    children.forEach((child, index) => {
      child.__index = [parentIndex, index]
        .filter((value) => {
          return value != null;
        })
        .join('.');
      if (child.children) {
        addIndex(child.children, child.__index);
      }
    });
  }
};
const toTreeData = (children, parentIndex) => {
  if (children) {
    const list = [];
    children.forEach((child, index) => {
      if (child.parentId) {
        const parent = children.filter(({ id }) => {
          return id == child.parentId;
        })[0];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(child);
        }
      } else {
        list.push(child);
      }
    });
    addIndex(list, parentIndex);
    return list;
  }
  return children;
};

const preProcessData = (data, ctx) => {
  const group = ctx.group;
  const _groups = ctx.groupData;
  const groupField = ctx.groupField;
  const groups = _groups.map((record, index) => {
    const { id, start, end, ...others } = record;
    const title = getValuesByPath(record, groupField.title);
    const groupItem = {
      id,
      rowKey: id ? [groupField.target, id].join('_') : record.rowKey,
      title: id ? title : record.title,
      __index: index + '',
      start,
      end,
      isGroup: true,
      __collection: groupField.target,
      ...others,
    };
    if (id) {
      groupItem['fieldCtx'] = groupField;
      groupItem.schemaName = groupField.name;
    }
    return groupItem;
  });
  const groupList = groupData(data, group, ctx) || [];
  const newGroups = groups.map((item, index1) => {
    const _nItem =
      groupList.filter(({ rowKey }) => {
        return rowKey == item.rowKey;
      })[0] || {};
    const obj = {
      ..._nItem,
      ...item,
      __index: index1 + '',
    };
    obj.children = toTreeData(obj.children, obj.__index);
    return obj;
  });
  newGroups.sort(groupField.sort);
  addIndex(newGroups, null);
  return newGroups;
};
export const usePrjWorkPlanProcessData = preProcessData;
export const usePrjWorkPlanTableBlockProps = () => {
  const props = useTableBlockProps();
  return {
    ...props,
  };
};

export const useCreatePrjPlanActionProps = () => {
  const record = useRecord();
  const field = useField();
  const api = useAPIClient();
  const { confirm } = Modal;
  const { service } = usePrjWorkPlanProviderContext();
  // const { service } = useBlockRequestContext();
  useEffect(() => {
    let isCreate = record?.plans?.length == 0;
    if(!service.loading){
       isCreate = service?.data?.data == 0;
    }
    field.visible = isCreate;
  }, [record?.plans, service?.loading]);
  return {
    onClick: () => {
      /* 创建计划 */
      confirm({
        title: '确定添加计划？',
        icon: <ExclamationCircleFilled />,
        onOk() {
          // 增加项目计划
          return new Promise((resolve, reject) => {
            api
              .request({
                url: 'prj:generatePlan',
                method: 'post',
                data: {
                  id: record.id,
                },
              })
              .then((res) => {
                if (res?.data) {
                  setTimeout(() => {
                    message.success('添加计划成功');
                    field.visible = false;
                    /* 刷新 block */
                    service.refresh();
                  }, 2000);
                  resolve({});
                }
              })
              .catch((err) => {
                message.error(err.message);
                resolve({});
              });
          });
        },
      });
    },
  };
};
/**
 *
 * @returns
 */
export const useSavePrjPlanActionProps = () => {
  const record = useRecord();
  const field = useField();
  const schema = useFieldSchema();
  const enable = record?.plans?.length > 0;
  field.visible = enable;
  // const { editable, setEditable } = usePrjWorkPlanProviderContext();

  useEffect(() => {
    const enable = record?.plans?.length > 0;
    field.visible = enable;
  }, [record?.plans]);
  return {
    onClick: () => {
      // setEditable(!editable);
      // if(!editable){

      //   // console.log(editable);

      // }
    },
  };
};
/**
 * 保存为新计划
 */
export const useSaveOtherPrjPlanActionProps = () => {
  const field = useField();
  const { groupFieldCtx } = usePrjWorkPlanProviderContext();
  const {name, blockCtx} = groupFieldCtx;
  useEffect(() => {
    field.visible = name == 'prjStage' && (blockCtx.service?.data?.data||[]).length > 0;
  },[groupFieldCtx]);
  const record = useRecord();
  const api = useAPIClient();
  const { confirm } = Modal;
  const { service } = usePrjWorkPlanProviderContext();
  const plans= [];
  return {
    onClick: () => {
      /* 创建计划 */
      confirm({
        title: '确定保存为新版本计划？',
        icon: <ExclamationCircleFilled />,
        onOk() {
          // 增加项目计划
          return new Promise((resolve, reject) => {
            api
              .request({
                url: 'prj:savePlanLatest',
                method: 'post',
                data: {
                  id: record.id
                },
              })
              .then((res) => {
                if (res?.data) {
                  setTimeout(() => {
                    message.success('保存成功');
                    /* 刷新 block */
                    // service.refresh();
                  }, 2000);
                  resolve({});
                }
              })
              .catch((err) => {
                message.error(err.message);
                resolve({});
              });
          });
        },
      });
    }
  };
};
