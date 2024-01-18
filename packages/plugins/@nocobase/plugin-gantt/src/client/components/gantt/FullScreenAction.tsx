import React, { forwardRef, useEffect } from 'react';
import { Tooltip, Button } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import { css } from '@emotion/css';
import { useTranslation } from 'react-i18next';

export const FullscreenAction = forwardRef((props:{containerRef, onClick}) => {
  const { t } = useTranslation();
  const [isFullScreen,{ toggleFullscreen }] = useFullscreen(props.containerRef,{});
  const getPopupContainer = () => {
    return props.containerRef.current;
  };  
 
  return (
    <Tooltip title={t('全屏')} getPopupContainer={getPopupContainer}>
      <Button
        onClick={()=>{ 
          toggleFullscreen();
          props.onClick();
          
        }}
      >
        {isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </Button>
    </Tooltip>
  );
});
