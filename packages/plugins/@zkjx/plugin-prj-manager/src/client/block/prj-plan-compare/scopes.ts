import { IField, useGanttBlockContext, useTableBlockProps } from '@nocobase/client';
import { useField, useFieldSchema } from '@formily/react';
import { useEffect } from 'react';
import { usePrjPlanCompareProviderContext } from './PrjPlanCompareProvider';
import { dayjs } from '@nocobase/utils';
export const usePrjPlanCompareOptionsProps = (_props) => {
  const field: IField = useField();
  const fieldShema = useFieldSchema();
  const { versions, values, setValues } = usePrjPlanCompareProviderContext();
  let props: any = {..._props};
  if (['version', 'compVersion'].includes(fieldShema.name as string)) {
  }
  const name = fieldShema.name;
  switch (name) {
    case 'prj':
      props = {
        multiple: false,
        service: {
          resource: 'prj',
          action: 'list',
        },
        fieldNames: {
          label: 'title',
          value: 'id',
        },
        objectValue: true,
      };
      break;
    case 'version':
    case 'compVersion':
      props.options = versions;
      break;
  }

  props.defaultValue = values[name];

  useEffect(() => {
    if (['version', 'compVersion'].includes[fieldShema.name]) {
      field.dataSource = versions;
    }
  }, [versions]);

  useEffect(() => {
    if (field.value) {
      setValues[name](field.value);
    }
  }, [field.value]);
  return props;
};

export const usePrjPlanCompareTableBlockProps = () => {
  const props = useTableBlockProps();
  return {
    preProcessData,
    ...props,
  };
};

 const checkHasJz = (s1, s2, e1, e2) => {
  if (e2.toDate().getTime() <= s1.toDate().getTime()) return false;
  if (e1.toDate().getTime() <= s2.toDate().getTime()) {
    return false;
  }
  return true;
};
 const getDiff = (record, comp) => {
  const { start, end } = record;
  const { start: start1, end: end1 } = comp;
  if(start1!== start){
    return {
      isDiff:true,
      isHidden:true
    }
  }
  if(end1!== end){
    return {
      isDiff:true,
      isHidden:true
    }
  }
  const s1 = dayjs(start);
  const s2 = dayjs(start1);
  const e1 = dayjs(end);
  const e2 = dayjs(end1);
  if (s1.isValid() && s2.isValid() && e1.isValid() && e2.isValid()) {
    // let s:dayjs.Dayjs, e:dayjs.Dayjs;
    const isDiff = !(s1.isSame(s2) && e1.isSame(e2));
    return {
      isDiff,      
      isHidden: true
    }
  }
  return {
    isHidden: true
  };
};

const getItemTitle = (item)=>{
  const start = dayjs(item.start);
  const end = dayjs(item.end);
  if(start.isValid() && end.isValid()){


    return '';


  }else{
    return '';
  }
}
export const preProcessData = (data, ctx) => {
  /**
   * 合并
   */
  const { prj, version, compVersion } = ctx.values;
  const otherData = prj.plans?.map((item) => {
    return {
      ...item,
      version: 'latest',
      schemaName:'latest',
      __collection: 'prj_plan_latest',
    };
  });
  if (otherData && otherData.length && data) {
    data = otherData.concat(
      data.map((item) => {
        return {
          ...item,
          schemaName:'compVersion',
          __collection: 'prj_plan_history',
        };
      }),
    );
  }

  if (data && data.length) {
    const groups = data?.groupBy(({ version }) => {
      return version;
    });
    const mainData = groups[version];
    const compData = groups[compVersion];
    if (mainData && compData) {
      const compData = groups[compVersion];
      const comData = mainData.map((item) => {
        const cpItem = compData.filter(({ stage_dicId }) => {
          return stage_dicId == item.stage_dicId;
        })[0];
        const hasDiff = getDiff(item, cpItem)||{};
        return {
          ...item,
          // color:'#52c41a',
          type: 'bar',
          comp: {
            ...cpItem,
            color: '#13c2c2',
          },
          hasDiff,
          data: [
            {
              ...item,
              // type:'bar',
              color: 'blue-6',
              isDisabled: true,
              isHidden:false,
              seriesName: '当前版本',
              text:getItemTitle(item)
            },           
            {
              ...cpItem,
              color: 'blue-3',
              isDisabled: true,
              isHidden:false,
              isHiddenTitle:false,
              seriesName: '对比版本',
              text:getItemTitle(cpItem)
            },
            // {
            //   ...item,
            //   start: null,
            //   end: null,
            //   // type:'project',
            //   isHidden: false,
            //   isHiddenTitle:true,
            //   seriesName: '延期或提前',
            //   ...hasDiff,
            //   isDisabled: true,
            // },
          ],
        };
      });
      return comData;
    } else {
      return [];
    }
  }
  return [];
};
