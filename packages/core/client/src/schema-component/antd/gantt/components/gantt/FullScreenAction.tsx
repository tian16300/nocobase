import React, { forwardRef, useEffect } from 'react';
import { Tooltip, Button } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useFullscreen } from 'ahooks';
import { css } from '@emotion/css';
import { useTranslation } from 'react-i18next';

export const FullscreenAction = forwardRef((props:{containerRef,  setIsFullScreen}) => {
  const { t } = useTranslation();
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(props.containerRef);
  const getPopupContainer = () => {
    return props.containerRef.current;
  };  
  const {setIsFullScreen} = props;
  useEffect(()=>{
    setIsFullScreen(isFullscreen);
  },[isFullscreen])
  return (
    <Tooltip title={t('Full Screen')} getPopupContainer={getPopupContainer}>
      <Button
        onClick={() => {
          toggleFullscreen();
        }}
        className={css`margin-bottom:24px;`}
      >
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </Button>
    </Tooltip>
  );
});
