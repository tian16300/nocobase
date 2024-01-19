import { useFieldSchema } from '@formily/react';
import { Icon, actionDesignerCss, css, useCompile, useViewBlockContext } from '@nocobase/client';
import { Button, Tooltip } from 'antd';
import React from 'react';

import { useFullscreen } from 'ahooks';

export const FullScreenAction = (props) => {
  const { useProps, ...others } = props;
  const others1 = useProps?.() || {};
  const { size } = { ...others, ...others1 } as any;
  const schema = useFieldSchema();
  const { titleFullScreen, titleNormal, iconFullScreen, iconNormal } = schema['x-component-props'] || {};
  const { containerRef, isFullScreen: _isFullScreen, setIsFullScreen, toolTipProps } = useViewBlockContext();
  const [isFullScreen, { toggleFullscreen }] = useFullscreen(containerRef, {
    onExit: () => {
      setIsFullScreen(false);
    },
    onEnter: () => {
      setIsFullScreen(true);
    },
  });

  const compile = useCompile();
  const _handleActionClick = () => {
    toggleFullscreen();
  };
  const getPopupContainer = isFullScreen
    ? () => {
        return containerRef.current;
      }
    : null;

  return (
    <div className={actionDesignerCss}>
      {
        <>
          <Tooltip
            title={isFullScreen ? compile(titleNormal) : compile(titleFullScreen)}
            // {...toolTipProps}
            getPopupContainer={getPopupContainer}
          >
            <Button
              size={size}
              onClick={_handleActionClick}
              icon={<Icon type={isFullScreen ? iconNormal : iconFullScreen} />}
              type={props.type}
              className={css`
                .ant-btn-icon:not(:last-child) {
                  margin-inline-end: 0 !important;
                }
              `}
            >
              {props.children?.[1]}
            </Button>
          </Tooltip>
        </>
      }
    </div>
  );
};
