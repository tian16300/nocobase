import { css, cx } from '@emotion/css';
import React, { useEffect, useRef, useState } from 'react';
import { getYmd } from '../../helpers/other-helper';
import { BarTask } from '../../types/bar-task';
import { Task } from '../../types/public-types';
import useStyles from './style';
import { Alert, Col, Row, Space, Statistic } from 'antd';
import { CalendarOutlined, CarryOutOutlined } from '@ant-design/icons';
import { useToken } from '../../../__builtins__';
import { getWorkDays, useGanttBlockContext } from '../../../../../index';
export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  rowHeight,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  scrollX,
  scrollY,
  arrowIndent,
  fontSize,
  fontFamily,
  headerHeight,
  taskListWidth,
  TooltipContent,
}) => {
  const { wrapSSR, componentCls, hashId } = useStyles();
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;
      let index = task.index;
      if (Array.isArray(index)) {
        index = index[0];
      }
      let newRelatedY = index * rowHeight - scrollY + headerHeight;
      let newRelatedX: number;
      if (rtl) {
        newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      } else {
        newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX = task.x1 + taskListWidth - arrowIndent * 1.5 - scrollX - tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    task,
    arrowIndent,
    scrollX,
    scrollY,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  return wrapSSR(
    <div
      ref={tooltipRef}
      className={cx(relatedX ? 'tooltipDetailsContainer' : 'tooltipDetailsContainerHidden', componentCls, hashId)}
      style={{ left: relatedX, top: relatedY }}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>,
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const { wrapSSR, componentCls, hashId } = useStyles();
  const { token } = useToken();
  const {holidays} = useGanttBlockContext();
  const style = {
    fontSize,
    fontFamily,
  };
  const { type } = task;
  const isProject = type == 'project';
  let projectBar = null;
  let duration = task.start && task.end ? getWorkDays(task.start, task.end, holidays) : null;
  duration = typeof duration == 'number' ? duration : null;
  let prjDuration = null;
  projectBar = (task as any).projectBar;

  if (isProject && projectBar) {
    prjDuration = projectBar.start && projectBar.end ? getWorkDays(projectBar.start, projectBar.end, holidays) : null;
    prjDuration = typeof prjDuration == 'number' ? prjDuration : null;
  }
  return wrapSSR(
    <div className={cx(componentCls, hashId, 'tooltipDefaultContainer')} style={style}>
      <div
        className={css`
          fontsize: ${fontSize};
          minwidth: 500px;
        `}
      >
         {task.alterProp && 
            <Alert className={css`margin-bottom:8px;`} {...task.alterProp} />}
        <div style={{ marginBottom: 8, fontSize: '1.1em' }}>
          <strong>{task.name}</strong>
        </div>
        <div>
          <Row gutter={[16, 8]}>
            <Col span={8}>
              <Statistic
                title={
                  <Space>
                    <CalendarOutlined
                      style={{
                        color: token.colorTextTertiary,
                      }}
                    />
                    <span>{isProject ? '计划开始' : '开始日期'}</span>
                  </Space>
                }
                valueStyle={{
                  // color: '#3f8600',
                  fontSize: fontSize,
                }}
                value={getYmd(task.start)}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={
                  <Space>
                    <CarryOutOutlined
                      style={{
                        color: token.colorTextTertiary,
                      }}
                    />
                    <span>{isProject ? '计划结束' : '结束日期'}</span>
                  </Space>
                }
                value={getYmd(task.end)}
                valueStyle={{
                  // color: '#3f8600',
                  fontSize: fontSize,
                }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={'工期(工作日)'}
                value={duration ? duration : '--'}
                precision={1}
                valueStyle={{
                  // color: '#3f8600',
                  fontSize: fontSize,
                  fontWeight: 'bold',
                }}
              />
            </Col>
            {isProject && projectBar ? (
              <>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <CalendarOutlined
                          style={{
                            color: token.colorTextTertiary,
                          }}
                        />
                        <span>开始日期</span>
                      </Space>
                    }
                    valueStyle={{
                      // color: '#3f8600',
                      fontSize: fontSize,
                    }}
                    value={getYmd(projectBar.start)}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space>
                        <CarryOutOutlined
                          style={{
                            color: token.colorTextTertiary,
                          }}
                        />
                        <span>结束日期</span>
                      </Space>
                    }
                    value={getYmd(projectBar.end)}
                    valueStyle={{
                      // color: '#3f8600',
                      fontSize: fontSize,
                    }}
                  />
                </Col>
                {projectBar.start && projectBar.end ? (
                  <Col span={8}>
                    <Statistic
                      title="工期(工作日)"
                      value={prjDuration ? prjDuration : '--'}
                      precision={1}
                      valueStyle={{
                        // color: '#3f8600',
                        fontSize: fontSize,
                        fontWeight: 'bold',
                      }}
                    />
                  </Col>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            <Col span={8}>
              {!!task.progress && (
                <Statistic
                  title="进度"
                  value={task.progress}
                  precision={2}
                  valueStyle={{
                    // color: '#3f8600',
                    fontSize: fontSize,
                    fontWeight: 'bold',
                  }}
                  suffix="%"
                />
              )}
            </Col>
           
          </Row>
        </div>
      </div>
    </div>,
  );
};
