import React, { forwardRef, useEffect } from 'react';
import { Tooltip, Button } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import { css } from '@emotion/css';
import { useTranslation } from 'react-i18next';

export const FullscreenAction = forwardRef((props:{containerRef,  isFullscreen, onClick}) => {
  const { t } = useTranslation();
  const [isFullScreen,{ toggleFullscreen, enterFullscreen, exitFullscreen }] = useFullscreen(props.containerRef);
  const getPopupContainer = () => {
    return props.containerRef.current;
  };  
  useEffect(()=>{
    console.log('FullscreenAction, props.isFullscreen', props.isFullscreen);
    if(props.isFullscreen){
      enterFullscreen();
    }else{
      exitFullscreen();
    }
  },[props.isFullscreen])
  return (
    <Tooltip title={t('Full Screen')} getPopupContainer={getPopupContainer}>
      <Button
        onClick={()=>{
          toggleFullscreen();
          props.onClick(isFullScreen);
          
        }}
      >
        {props.isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </Button>
    </Tooltip>
  );
});
