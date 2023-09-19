import { SchemaInitializer } from '@nocobase/client';
import { FormOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { Button } from 'antd';
import { NavLink, useNavigate, Route, Routes, Navigate } from 'react-router-dom';
export class Inbox extends Component {
  render() {
    return (
      <div>
        <h2>Inbox</h2>
        {this.props.children || 'Welcome to your Inbox'}
      </div>
    );
  }
}
export const SubPageAction = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* <Router>
      <Route path="inbox" component={Inbox} />
    </Router> */}

      <NavLink className="btn" to="/admin/5k61ql35rsn?id=1">
        项目详情
      </NavLink>
    </>
  );
};

SubPageAction.initializer = (props) => {
  const { insert } = props;
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        const schema = {
          type: 'object',
          properties: {
            action1: {
              'x-component': 'SubPageAction',
              'x-component-props': {
                type: 'primary',
              },
              type: 'void',
              title: 'Open',
              properties: {
                drawer1: {
                  'x-component': 'Action.Drawer',
                  type: 'void',
                  title: 'Drawer Title',
                  properties: {
                    hello1: {
                      'x-content': 'Hello',
                      title: 'T1',
                    },
                    footer1: {
                      'x-component': 'Action.Drawer.Footer',
                      type: 'void',
                      properties: {
                        close1: {
                          title: 'Close',
                          'x-component': 'Action',
                          'x-component-props': {
                            useAction: '{{ useCloseAction }}',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
        insert(schema);
      }}
    />
  );
};
