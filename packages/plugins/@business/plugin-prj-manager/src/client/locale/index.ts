import { useTranslation } from 'react-i18next';

export const NAMESPACE = 'prj';

export function useAuthTranslation() {
  return useTranslation(NAMESPACE);
}

export function generateNTemplate(key: string) {
  return `{{t('${key}', { ns: '${NAMESPACE}', nsMode: 'fallback' })}}`;
}
