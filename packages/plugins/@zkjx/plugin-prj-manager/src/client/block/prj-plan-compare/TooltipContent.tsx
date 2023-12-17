import React from 'react';
import { Input, css, cx, useToken, getWorkDays} from '@nocobase/client';
import { Col, Row, Space, Statistic } from 'antd';
import { Task, useGanttBlockContext } from '@nocobase/plugin-gantt/client';
import { CalendarOutlined, CarryOutOutlined } from '@ant-design/icons';
import useStyles from './style';
import { dayjs } from '@nocobase/utils';
import { Typography } from 'antd';
const { Title } = Typography;
const getYmd = (param) => {
  if (!param || param == '') return '--';
  const date = dayjs(param);
  if (date.isValid()) return date.format('YYYY-MM-DD');
  return '--';
};

const TaskItem: React.FC<{ task; fontSize; fontFamily }> = ({ task, fontSize, fontFamily }) => {
  const { token } = useToken();
  const {holidays} = useGanttBlockContext();
  const style = {
    fontSize,
    fontFamily,
  };
  const { type } = task;
  const isProject = type == 'project';
  let projectBar = null;
  // task.start && task.end
  //   ? Math.round(((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)) * 10) / 10
  //   : null;
  let duration = task.start && task.end ? getWorkDays(task.start, task.end,holidays) : null;
  if (typeof duration !== 'number') {
    duration = null;
  }
  let prjDuration = null;
  projectBar = (task as any).projectBar;

  if (isProject && projectBar) {
    let prjDuration = projectBar.start && projectBar.end ? getWorkDays(projectBar.start, projectBar.end,holidays) : null;
    if (typeof prjDuration !== 'number') {
      prjDuration = null;
    }
  }
  return (
    <div className="task-tooltip-content-item">
      <div style={{ fontSize: '1.1em' }}>
        <strong>
          {task.seriesName}-{task.title}
        </strong>
      </div>
      {!task.isDiff && (
        <div>
          <Row gutter={[16, 4]}>
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
                title={isProject ? '工作日' : '工作日'}
                value={typeof duration == 'number' ? duration : '--'}
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
                      title="工作日"
                      value={typeof prjDuration == 'number'? prjDuration : '--'}
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
            {task.remark && task.remark.trim() !== '' && (
              <Col span={24}>
                <Statistic
                  title="备注"
                  value={null}
                  formatter={() => {
                    return <Input.ReadPrettyTextArea value={task.remark}></Input.ReadPrettyTextArea>;
                  }}
                  valueStyle={{
                    // color: '#3f8600',
                    fontSize: fontSize,
                  }}
                />
              </Col>
            )}
          </Row>
        </div>
      )}
      
    </div>
  );
};
export const TooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const { wrapSSR, componentCls, hashId } = useStyles();
  
  const {holidays} = useGanttBlockContext();
  const style = {
    fontSize,
    fontFamily,
  };
  const { type } = task;
  const isProject = type == 'project';
  let projectBar = null;

  let duration = task.start && task.end ? getWorkDays(task.start, task.end, holidays) : null;
  if (typeof duration !== 'number') {
    duration = null;
  }
  let prjDuration = null;
  projectBar = (task as any).projectBar;

  if (isProject && projectBar) {
    let prjDuration = projectBar.start && projectBar.end ? getWorkDays(projectBar.start, projectBar.end, holidays) : null;
    if (typeof prjDuration !== 'number') {
      prjDuration = null;
    }
  }
  return wrapSSR(
    <div className={cx(componentCls, hashId, 'tooltipDefaultContainer')} style={style}>
      <div
        className={css`
          fontsize: ${fontSize};
          minwidth: 500px;
          .task-tooltip-content-item {
            margin-top: 12px;
            &:nth-child(0) {
              margin-top: 0;
            }
          }
        `}
      >
        {task?.data?.map((item) => {
          return !item.isHidden && <TaskItem task={item} fontSize={fontSize} fontFamily={fontFamily} />;
        })}
      </div>
    </div>,
  );
};
