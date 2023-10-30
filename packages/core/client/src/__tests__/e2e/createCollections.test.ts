import { expect, test } from '@nocobase/test/client';

const pageConfig = {
  collections: [
    {
      name: 't_wbjenhqk5dz',
      title: 'collection1',
      inherit: false,
      hidden: false,
      description: null,
      fields: [
        {
          name: 'id',
          type: 'bigInt',
          interface: 'id',
          description: null,
          collectionName: 't_wbjenhqk5dz',
          parentKey: null,
          reverseKey: null,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          uiSchema: {
            type: 'number',
            title: '{{t("ID")}}',
            'x-component': 'InputNumber',
            'x-read-pretty': true,
          },
        },
        {
          name: 'createdAt',
          type: 'date',
          interface: 'createdAt',
          description: null,
          collectionName: 't_wbjenhqk5dz',
          parentKey: null,
          reverseKey: null,
          field: 'createdAt',
          uiSchema: {
            type: 'datetime',
            title: '{{t("Created at")}}',
            'x-component': 'DatePicker',
            'x-component-props': {},
            'x-read-pretty': true,
          },
        },
        {
          name: 'createdBy',
          type: 'belongsTo',
          interface: 'createdBy',
          description: null,
          collectionName: 't_wbjenhqk5dz',
          parentKey: null,
          reverseKey: null,
          target: 'users',
          foreignKey: 'createdById',
          uiSchema: {
            type: 'object',
            title: '{{t("Created by")}}',
            'x-component': 'AssociationField',
            'x-component-props': {
              fieldNames: {
                value: 'id',
                label: 'nickname',
              },
            },
            'x-read-pretty': true,
          },
          targetKey: 'id',
        },
        {
          name: 'updatedAt',
          type: 'date',
          interface: 'updatedAt',
          description: null,
          collectionName: 't_wbjenhqk5dz',
          parentKey: null,
          reverseKey: null,
          field: 'updatedAt',
          uiSchema: {
            type: 'string',
            title: '{{t("Last updated at")}}',
            'x-component': 'DatePicker',
            'x-component-props': {},
            'x-read-pretty': true,
          },
        },
        {
          name: 'updatedBy',
          type: 'belongsTo',
          interface: 'updatedBy',
          description: null,
          collectionName: 't_wbjenhqk5dz',
          parentKey: null,
          reverseKey: null,
          target: 'users',
          foreignKey: 'updatedById',
          uiSchema: {
            type: 'object',
            title: '{{t("Last updated by")}}',
            'x-component': 'AssociationField',
            'x-component-props': {
              fieldNames: {
                value: 'id',
                label: 'nickname',
              },
            },
            'x-read-pretty': true,
          },
          targetKey: 'id',
        },
      ],
      category: [],
      logging: true,
      autoGenId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
      sortable: true,
      template: 'general',
      view: false,
    },
    {
      name: 't_u0c1mmzldgo',
      title: 'collection2',
      inherit: false,
      hidden: false,
      description: null,
      fields: [
        {
          name: 'id',
          type: 'bigInt',
          interface: 'id',
          description: null,
          collectionName: 't_u0c1mmzldgo',
          parentKey: null,
          reverseKey: null,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          uiSchema: {
            type: 'number',
            title: '{{t("ID")}}',
            'x-component': 'InputNumber',
            'x-read-pretty': true,
          },
        },
        {
          name: 'createdAt',
          type: 'date',
          interface: 'createdAt',
          description: null,
          collectionName: 't_u0c1mmzldgo',
          parentKey: null,
          reverseKey: null,
          field: 'createdAt',
          uiSchema: {
            type: 'datetime',
            title: '{{t("Created at")}}',
            'x-component': 'DatePicker',
            'x-component-props': {},
            'x-read-pretty': true,
          },
        },
        {
          name: 'createdBy',
          type: 'belongsTo',
          interface: 'createdBy',
          description: null,
          collectionName: 't_u0c1mmzldgo',
          parentKey: null,
          reverseKey: null,
          target: 'users',
          foreignKey: 'createdById',
          uiSchema: {
            type: 'object',
            title: '{{t("Created by")}}',
            'x-component': 'AssociationField',
            'x-component-props': {
              fieldNames: {
                value: 'id',
                label: 'nickname',
              },
            },
            'x-read-pretty': true,
          },
          targetKey: 'id',
        },
        {
          name: 'updatedAt',
          type: 'date',
          interface: 'updatedAt',
          description: null,
          collectionName: 't_u0c1mmzldgo',
          parentKey: null,
          reverseKey: null,
          field: 'updatedAt',
          uiSchema: {
            type: 'string',
            title: '{{t("Last updated at")}}',
            'x-component': 'DatePicker',
            'x-component-props': {},
            'x-read-pretty': true,
          },
        },
        {
          name: 'updatedBy',
          type: 'belongsTo',
          interface: 'updatedBy',
          description: null,
          collectionName: 't_u0c1mmzldgo',
          parentKey: null,
          reverseKey: null,
          target: 'users',
          foreignKey: 'updatedById',
          uiSchema: {
            type: 'object',
            title: '{{t("Last updated by")}}',
            'x-component': 'AssociationField',
            'x-component-props': {
              fieldNames: {
                value: 'id',
                label: 'nickname',
              },
            },
            'x-read-pretty': true,
          },
          targetKey: 'id',
        },
      ],
      category: [],
      logging: true,
      autoGenId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
      sortable: true,
      template: 'general',
      view: false,
    },
  ],
};

test.describe('createCollections', () => {
  test('quickly create collections', async ({ page, mockPage }) => {
    await mockPage(pageConfig).goto();

    await page.getByLabel('schema-initializer-Grid-BlockInitializers').hover();
    await page.getByLabel('dataBlocks-table', { exact: true }).hover();

    await expect(page.getByLabel('dataBlocks-table-collection1')).toBeVisible();
    await expect(page.getByLabel('dataBlocks-table-collection2')).toBeVisible();
  });

  test('no page, just create collections', async ({ page, createCollections }) => {
    await createCollections(pageConfig.collections);
    await page.goto('/admin/settings/collection-manager/collections');

    await expect(page.getByText('collection1')).toBeVisible();
    await expect(page.getByText('collection2')).toBeVisible();
  });
});
