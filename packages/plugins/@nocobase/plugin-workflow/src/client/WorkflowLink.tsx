import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { getWorkflowDetailPath } from './constant';
import { useActionContext, useGetAriaLabelOfAction, useRecord } from '@nocobase/client';

export const WorkflowLink = (props, ) => {
  const { t } = useTranslation();
  const { id } = useRecord();
  const { setVisible } = useActionContext();
  const { getAriaLabel } = useGetAriaLabelOfAction('Configure');
  const {params } = props;
  return (
    <Link aria-label={getAriaLabel()} to={getWorkflowDetailPath(id, params)} onClick={() => setVisible(false)}>
      {t('Configure')}
    </Link>
  );
};
