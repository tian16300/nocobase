import { useDataSelectBlockContext } from '..';
import { usePrjWorkProviderContext } from './PrjWorkPlanProvider';
import { dayjs } from '@nocobase/utils';

export const usePrjWorkPlanFormDefValue = () => {
  return {
    start: dayjs().startOf('month').format('YYYY-MM-DD'),
    end: dayjs().endOf('month').format('YYYY-MM-DD'),
  };
};
export const usePrjWorkPlanForm = () => {
  const { form } = usePrjWorkProviderContext();
  return {
    layout: 'inline',
    form,
  };
};

export const usePrjWorkPlanDecoratorProps = () => {
  const { record, service } = useDataSelectBlockContext();
  return {
    collection: 'prj_plan',
    fieldNames: {
      id: 'id',
      title: 'stage',
      start: 'start',
      end: 'end',
      range: 'day',
    },
    params: {
      appends: [],
      paginate: false,
      filters: {
        $and: [
          {
            prj: {
              id: {
                $eq: record?.id,
              },
            },
          },
        ],
      },
    },
  };
};

export const refreshPrjWorkService = async () => {
  const { service } = usePrjWorkProviderContext();
  await service.refresh();
};

export const useWorkPlanGanttParams = (props) => {
  return {
    paginate: false,
  };
};
