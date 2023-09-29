import { cx } from '@emotion/css';
import { uid } from '@nocobase/utils/client';
import React, { ReactChild } from 'react';
import { addToDate } from '../../helpers/date-helper';
import { Task } from '../../types/public-types';
import useStyles from './style';

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
  selectedRowKeys: any[];  
  rowKey?: string;
};
const empty = [{ id: uid() }, { id: uid() }, { id: uid() }];
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
  selectedRowKeys,
  rowKey
}) => {
  const { wrapSSR, componentCls, hashId } = useStyles();

  const data = tasks.length ? tasks : empty;
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line key="RowLineFirst" x="0" y1={0} x2={svgWidth} y2={0} className={cx('gridRowLine')} />,
  ];
  for (const task of data) {
    gridRows.push(
      <rect
        key={'Row' + (task[rowKey])?.toString()}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={selectedRowKeys?.includes((task[rowKey])?.toString()) ? cx('gridHeightRow') : cx('gridRow')}
      />,
    );
    rowLines.push(
      <line
        key={'RowLine' + task[rowKey]}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={cx('gridRowLine')}
      />,
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  let today: ReactChild = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    let strokeWidth = 0;
    /**
     * 如果是天的话 则每周的最后一天 分隔线为1 如果是月 分隔线为
     */
   const isWeekEnd = date.getDay() % 7 == 0;
   if (isWeekEnd) {
     strokeWidth = 1;
   }

    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={cx('gridTick')}
        strokeWidth={strokeWidth}
      />,
    );
    if (
      (i + 1 !== dates.length && date.getTime() < now.getTime() && dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(date, date.getTime() - dates[i - 1].getTime(), 'millisecond').getTime() >= now.getTime())
    ) {
      today = <rect x={tickX} y={0} width={columnWidth} height={y} fill={todayColor} />;
    }
    // rtl for today
    if (rtl && i + 1 !== dates.length && date.getTime() >= now.getTime() && dates[i + 1].getTime() < now.getTime()) {
      today = <rect x={tickX + columnWidth} y={0} width={columnWidth} height={y} fill={todayColor} />;
    }
    tickX += columnWidth;
  }
  return wrapSSR(
    <g className={`gridBody ${componentCls} ${hashId}`}>
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </g>,
  );
};
