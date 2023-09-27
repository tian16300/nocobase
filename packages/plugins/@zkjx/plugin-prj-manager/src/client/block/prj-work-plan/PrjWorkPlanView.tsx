import React, { useCallback, useEffect } from 'react';
import { observer } from '@formily/react';
import { ActionBar, Gantt, SchemaComponent, SchemaComponentProvider, css, useGanttBlockProps } from '@nocobase/client';
import { SelectTable } from '@formily/antd-v5';

import { RecursionField, Schema, useFieldSchema } from '@formily/react';
import { uid } from '@nocobase/utils';

// import {
//   GanttComponent, Inject,
//   Edit, Toolbar, ContextMenu, Selection
// } from '@syncfusion/ej2-react-gantt';
const usePrjWorkPlanGanttBlockProps = () => {
  const props = useGanttBlockProps();
  return {
    ...props,
  };
};
export const PrjWorkPlanView = observer(() => {
  let data = [
    {
      TaskID: 1,
      TaskName: 'Project Initiation',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
      subtasks: [
        { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
        { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
        { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
      ],
    },
    {
      TaskID: 5,
      TaskName: 'Project Estimation',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
      subtasks: [
        {
          TaskID: 6,
          TaskName: 'Develop floor plan for estimation',
          StartDate: new Date('04/04/2019'),
          Duration: 3,
          Progress: 50,
        },
        { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
        { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
      ],
    },
  ];
  let taskSettings = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    child: 'subtasks',
  };
  // const properties = useFieldSchema();

  const fieldSchema = useFieldSchema();

  const props = {
    // useProps:()=>{
    //   return {
    //     fieldNames: {
    //       id: 'id',
    //       start: 'start',
    //       range: 'day',
    //       title: 'name',
    //       end: 'end',
    //     }
    //   };
    // },
    fieldNames: {
      id: 'id',
      start: 'start',
      range: 'day',
      title: 'name',
      end: 'end',
    },
    tasks: [
      {
        start: new Date(2020, 0, 1),
        end: new Date(2020, 2, 2),
        name: 'Redesign website',
        id: 'Task 0',
        progress: 45,
        type: 'task',
      },
    ],
  };
  const schema = {
    type: 'void',
    'x-component': 'Gantt',
    'x-component-props': {
      useProps: usePrjWorkPlanGanttBlockProps,
    },
    properties: fieldSchema.properties,
  };

  return (
    // <GanttComponent dataSource={data} treeColumnIndex={1} taskFields={taskSettings}></GanttComponent>
    <>
      {/* <SchemaComponentProvider components={{ SelectTable, Gantt }} >
      
    </SchemaComponentProvider> */}
      <SchemaComponent schema={schema} />
    </>
  );
});
