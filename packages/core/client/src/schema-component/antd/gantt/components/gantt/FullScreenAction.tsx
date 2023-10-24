import React, { forwardRef, useEffect } from 'react';
import { Tooltip, Button } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import { css } from '@emotion/css';
import { useTranslation } from 'react-i18next';

export const FullscreenAction = forwardRef((props:{containerRef,  isFullScreen, onClick}) => {
  const { t } = useTranslation();
  const [isFullScreen,{ toggleFullscreen, enterFullscreen, exitFullscreen }] = useFullscreen(props.containerRef,{

  });
  const getPopupContainer = () => {
    return props.containerRef.current;
  };  
  useEffect(()=>{
    if(props.isFullScreen){
      enterFullscreen();
    }else{
      exitFullscreen();
    }
  },[props.isFullScreen])
  return (
    <Tooltip title={t('Full Screen')} getPopupContainer={getPopupContainer}>
      <Button
        onClick={()=>{ 
          toggleFullscreen();
          props.onClick(!isFullScreen);
          console.log('FullscreenAction, isFullscreen', isFullScreen);
         
          
        }}
      >
        {props.isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </Button>
    </Tooltip>
  );
});
