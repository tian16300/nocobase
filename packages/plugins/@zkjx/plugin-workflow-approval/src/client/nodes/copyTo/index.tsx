import { SchemaInitializerItemType, useCollectionManager, useCompile } from '@nocobase/client';

import {
  defaultFieldNames,
  getCollectionFieldOptions,
  CollectionBlockInitializer,
  Instruction,
} from '@nocobase/plugin-workflow/client';
import { NAMESPACE } from '../../../locale';
import { AssigneeRoles, AssigneesSelect } from '../components';

const MULTIPLE_ASSIGNED_MODE = {
  SINGLE: Symbol('single'),
  ALL: Symbol('all'),
  ANY: Symbol('any'),
  ALL_PERCENTAGE: Symbol('all percentage'),
  ANY_PERCENTAGE: Symbol('any percentage'),
};

export default class CopyTo extends Instruction {
  title = `抄送人`;
  type = 'copyTo';
  group = 'manual';
  description = `{{t("Could be used for manually submitting data, and determine whether to continue or exit. Workflow will generate a todo item for assigned user when it reaches a manual node, and continue processing after user submits the form.", { ns: "${NAMESPACE}" })}}`;
  fieldset = {
    rule: {
      title: '选择抄送人类型',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          label: '指定人',
          value: '1',
        },
        {
          label: '发起人的主管',
          value: '2',
        },
        {
          label: '角色',
          value: '3',
        },
       
      ],
    },
    assignees: {
      type: 'array',
      title: `{{t("Assignees", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'AssigneesSelect',
      'x-component-props': {
        // multiple: true,
      },
      required: true,
      default: [],
      'x-reactions': [
        {
          dependencies: ['rule'],
          fulfill: {
            state: {
              visible: '{{$deps[0]  == 1}}',
            },
          },
        },
      ],
    },
    AssigneeRoles: {
      type: 'array',
      title: `{{t("角色", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'AssigneeRoles',
      'x-component-props': {
        multiple: true,
      },
      required: true,
      default: [],
      'x-reactions': [
        {
          dependencies: ['rule'],
          fulfill: {
            state: {
              visible: '{{$deps[0]  == 3}}',
            },
          },
        },
      ],
    },
  };
  components = {
    AssigneesSelect,
    AssigneeRoles
  };
  useVariables({ key, title, config }, { types, fieldNames = defaultFieldNames }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compile = useCompile();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollectionFields } = useCollectionManager();
    const formKeys = Object.keys(config.forms ?? {});
    if (!formKeys.length) {
      return null;
    }

    const options = formKeys
      .map((formKey) => {
        const form = config.forms[formKey];

        const fieldsOptions = getCollectionFieldOptions({
          fields: form.collection?.fields,
          collection: form.collection,
          types,
          compile,
          getCollectionFields,
        });
        const label = compile(form.title) || formKey;
        return fieldsOptions.length
          ? {
              key: formKey,
              value: formKey,
              label,
              title: label,
              children: fieldsOptions,
            }
          : null;
      })
      .filter(Boolean);

    return options.length
      ? {
          [fieldNames.value]: key,
          [fieldNames.label]: title,
          [fieldNames.children]: options,
        }
      : null;
  }
  useInitializers(node): SchemaInitializerItemType | null {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollection } = useCollectionManager();
    const formKeys = Object.keys(node.config.forms ?? {});
    if (!formKeys.length || node.config.mode) {
      return null;
    }

    const forms = formKeys
      .map((formKey) => {
        const form = node.config.forms[formKey];
        const { fields = [] } = getCollection(form.collection);

        return fields.length
          ? ({
              name: form.title ?? formKey,
              type: 'item',
              title: form.title ?? formKey,
              Component: CollectionBlockInitializer,
              collection: form.collection,
              dataSource: `{{$jobsMapByNodeKey.${node.key}.${formKey}}}`,
            } as SchemaInitializerItemType)
          : null;
      })
      .filter(Boolean);

    return forms.length
      ? {
          name: `#${node.id}`,
          key: 'forms',
          type: 'subMenu',
          title: node.title,
          children: forms,
        }
      : null;
  }
}
