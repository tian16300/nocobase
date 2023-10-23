import { cx } from '@emotion/css';
import React, { ReactChild } from 'react';
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from '../../helpers/date-helper';
import { DateSetup } from '../../types/date-setup';
import { ViewMode } from '../../types/public-types';
import useStyles from './style';
import { TopPartOfCalendar } from './top-part-of-calendar';
import { dayjs } from '@nocobase/utils';
import { useToken } from '../../../__builtins__';

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
};

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
}) => {
  const { wrapSSR, componentCls, hashId } = useStyles();
  const { token } = useToken();

  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.getFullYear();
      const isThisYear = dayjs(date).format('YYYY') == dayjs().format('YYYY');

      if (isThisYear) {
        bottomValues.push(
          <g key={date.getTime()}>
            <rect
              y={headerHeight * 0.5 - 24*0.5}
              x={columnWidth * i + columnWidth * 0.5 - 30}
              className={cx('calendarThisBlock')}
              width={60}
              height={24}
              rx="6"
            ></rect>
            <text
              y={headerHeight * 0.5 + 4}
              x={columnWidth * i + columnWidth * 0.5}
              className={cx(['calendarBottomText', 'calendarThisBlockText'])}
            >
              {bottomValue}
            </text>
          </g>,
        );
      } else {
        bottomValues.push(
          <text
            key={date.getTime()}
            y={headerHeight * 0.5 + 4}
            x={columnWidth * i + columnWidth * 0.5}
            className={cx('calendarBottomText')}
          >
            {bottomValue}
          </text>,
        );
      }

      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getFullYear() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForQuarterYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      // const bottomValue = getLocaleMonth(date, locale);
      const quarter = 'Q' + Math.floor((date.getMonth() + 3) / 3);
      const isThisQuarter = dayjs(date).format('YYYY-Q') == dayjs().format('YYYY-Q');

      if (isThisQuarter) {
        bottomValues.push(
          <g key={date.getTime()}>
            <rect
              y={headerHeight * 0.8 - 18}
              x={columnWidth * i + columnWidth * 0.5 - 30}
              className={cx('calendarThisBlock')}
              width={60}
              height={24}
              rx="6"
            ></rect>
            <text
              y={headerHeight * 0.8}
              x={columnWidth * i + columnWidth * 0.5}
              className={cx(['calendarBottomText', 'calendarThisBlockText'])}
            >
              {quarter}
            </text>
          </g>,
        );
      } else {
        bottomValues.push(
          <text
            key={date.getTime()}
            y={headerHeight * 0.8}
            x={columnWidth * i + columnWidth * 0.5}
            className={cx('calendarBottomText')}
          >
            {quarter}
          </text>,
        );
      }

      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs(xText)}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = getLocaleMonth(date, locale);
      const isThisMonth = dayjs(date).format('YYYY-MM') == dayjs().format('YYYY-MM');
      if (isThisMonth) {
        bottomValues.push(
          <g key={bottomValue + date.getFullYear()}>
            <rect
              y={headerHeight * 0.8 - 18}
              x={columnWidth * i + columnWidth * 0.5 - 30}
              className={cx('calendarThisBlock')}
              width={60}
              height={24}
              rx="6"
            ></rect>
            <text
              y={headerHeight * 0.8}
              x={columnWidth * i + columnWidth * 0.5}
              className={cx(['calendarBottomText', 'calendarThisBlockText'])}
            >
              {bottomValue}
            </text>
          </g>,
        );
      } else {
        bottomValues.push(
          <text
            key={bottomValue + date.getFullYear()}
            y={headerHeight * 0.8}
            x={columnWidth * i + columnWidth * 0.5}
            className={cx('calendarBottomText')}
          >
            {bottomValue}
          </text>,
        );
      }

      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount = 1;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = '';
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        // top
        topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`;
      }

      // bottom
      // const bottomValue = `W${getWeekNumberISO8601(date)}`;
      const bottomValue = dayjs(date).format('第WW周');
      const isThisWeek = dayjs(date).format('YYYY-WW') == dayjs().format('YYYY-WW');

      if (isThisWeek) {
        bottomValues.push(
          <g key={date.getTime()}>
            <rect
              y={headerHeight * 0.46}
              x={columnWidth * (i + +rtl)+ columnWidth * 0.5 - 30}
              className={cx('calendarThisBlock')}
              width={60}
              height={20}
              rx="6"
            ></rect>
            <text
              y={headerHeight * 0.8}
              x={columnWidth * (i + +rtl)+ columnWidth * 0.5}
              className={cx(['calendarBottomText', 'calendarThisBlockText'])}
            >
              {bottomValue}
            </text>
          </g>,
        );
      } else {
        bottomValues.push(
          <text
            key={date.getTime()}
            y={headerHeight * 0.8}
            x={columnWidth * (i + +rtl)+ columnWidth * 0.5}
            className={cx('calendarBottomText')}
          >
            {bottomValue}
          </text>,
        );
      }

      if (topValue) {
        // if last day is new month
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight * 0.8}
            />,
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      // const bottomValue = `${getLocalDayOfWeek(date, locale, 'short')}, ${date.getDate().toString()}`;
      const bottomValue = `${date.getDate().toString()}`;
      const isThisDay = dayjs(date).isToday();
      if (isThisDay) {
        bottomValues.push(
          <g key={date.getTime()}>
            <rect
              y={headerHeight * 0.4}
              x={columnWidth * i}
              className={cx('calendarThisBlock')}
              width={columnWidth}
              height={24}
              rx="6"
            ></rect>
            <text
              y={headerHeight * 0.8}
              x={columnWidth * i + columnWidth * 0.5}
              className={cx(['calendarBottomText', 'calendarThisBlockText'])}
            >
              {bottomValue}
            </text>
          </g>,
        );
      } else {
        bottomValues.push(
          <text
            key={date.getTime()}
            y={headerHeight * 0.8}
            x={columnWidth * i + columnWidth * 0.5}
            className={cx('calendarBottomText')}
          >
            {bottomValue}
          </text>,
        );
      }

      if (i + 1 !== dates.length && date.getMonth() !== dates[i + 1].getMonth()) {
        const topValue = getLocaleMonth(date, locale);
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + 1) - getDaysInMonth(date.getMonth(), date.getFullYear()) * columnWidth * 0.5}
            yText={topDefaultHeight * 0.8}
          />,
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: 'numeric',
      })
        //@ts-ignore
        .format(date)
        .replace('时', '');
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={cx('calendarBottomText')}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>,
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(date, locale, 'short')}, ${date.getDate()} ${getLocaleMonth(
          date,
          locale,
        )}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: 'numeric',
      })
        //@ts-ignore
        .format(date)
        ?.replace('时', '');
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={cx('calendarBottomText')}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>,
      );
      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(displayDate, locale, 'long')}, ${displayDate.getDate()} ${getLocaleMonth(
          displayDate,
          locale,
        )}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />,
        );
      }
    }

    return [topValues, bottomValues];
  };

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
    case ViewMode.QuarterYear:
      [topValues, bottomValues] = getCalendarValuesForQuarterYear();
      break;
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }
  return wrapSSR(
    <g className={`calendar ${componentCls} ${hashId}`} fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight}
        className={cx('calendarHeader')}
      />
      {bottomValues} {topValues}
    </g>,
  );
};
