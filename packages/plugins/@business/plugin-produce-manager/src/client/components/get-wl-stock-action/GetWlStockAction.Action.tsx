import {
  actionDesignerCss,
  useAPIClient,
  useFormBlockContext,
} from '@nocobase/client';
import { Button, message } from 'antd';
import React, { useState } from 'react';


export const GetWlStockAction = (props) => {
  const { useProps, targetField, ...others } = props;
  const others1 = useProps?.() || {};
  const { size } = { ...others, ...others1 } as any;
  const { form } = useFormBlockContext();
  const [loading, setLoading] = useState(false);
  const api = useAPIClient();
  const _handleActionClick = async () => {
    /* 数据表  获取物料库存字段 wl_stock prj_wl_stock  public_wl_stock 项目库存字段 公共库存字段 */
    setLoading(true);
    const field = form.query(targetField).take();
    const prjField = form.query('prj').take();
    const currentRecords = field.value || [];
    const prj = prjField.value;
    if (prj) {
      const { data } = await api.resource('wl_stock').list({
        filter: {
          $and: [
            {
              wl_id: {
                $in: currentRecords.map(({ wl_id }) => {
                  return wl_id;
                }),
              },
            },
            {
              $or: [
                {
                  prjId: prj.id,
                },
                {
                  stock: {
                    name: '公共库',
                  },
                },
              ],
            },
          ],
        },
        paginate: false,
      });
      const records = data.data || [];

      currentRecords.forEach((record) => {
        const prj_wl_stock = records.filter(({ prjId, wl_id }) => {
          return prjId == prj.id && wl_id == record.wl_id;
        })?.[0];
        record.prj_wl_stock = prj_wl_stock;
        record.prj_wl_stock_id = prj_wl_stock?.id;
        const public_wl_stock = records.filter(({ prjId, wl_id }) => {
          return !prjId && wl_id == record.wl_id;
        })?.[0];
        record.public_wl_stock = public_wl_stock;
        record.public_wl_stock_id = public_wl_stock?.id;
      });
      field.onInput(currentRecords);
      message.success('提取成功');
      setLoading(false);
    }
  };
  return (
    <div className={actionDesignerCss}>
      {
        <Button size={size} onClick={_handleActionClick} type={props.type} loading={loading}>
          提取库存
          {props.children?.[1]}
        </Button>
      }
    </div>
  );
};
