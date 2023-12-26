import { DataSelectBlockInitializer } from './DataSelectBlockInitializer';
import { DataSelectDesigner } from './DataSelectDesigner';
import {
  DataSelectFieldProvider,
  useDataSelectBlockContext,
  useFormSelectBlockProps,
  useFormSelectOptionsProps,
} from './DataSelectFieldProvider';

export const DataSelect = () => {
  return null;
};
DataSelect.initializer = DataSelectBlockInitializer;
DataSelect.Designer = DataSelectDesigner;
DataSelect.Decorator = DataSelectFieldProvider;
DataSelect.displayName = 'DataSelect';
export { useFormSelectBlockProps, useFormSelectOptionsProps, useDataSelectBlockContext };
