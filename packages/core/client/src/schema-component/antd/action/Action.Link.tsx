import { observer } from '@formily/react';
import React from 'react';
import classnames from 'classnames';
import Action from './Action';
import { ComposedAction } from './types';
import { Button } from 'antd';

export const ActionLink: ComposedAction = observer(
  (props: any) => {
    return (
      <Action {...props} icon={props.icon} type='link' size='small' component={props.component || Button} className={classnames('nb-action-link', props.className)} />
    );
  },
  { displayName: 'ActionLink' },
);
