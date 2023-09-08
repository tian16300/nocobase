import React from 'react';
import { observer, useForm } from '@formily/react';
// import { ClockCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';
// import { Col, Row, Statistic, Divider } from 'antd';
// import PrjWorkStaticTable from './PrjWorkStaticTable';
// import PrjWorkStaticChart from './PrjWorkStaticChart';
import { SchemaComponent, SchemaComponentProvider, TableBlockProvider, TableV2, useTableBlockProps } from '@nocobase/client';





const schema = {
  "type": "void",
  "x-acl-action": "prj.weekReport:list",
  "x-designer": "TableBlockDesigner",
  "x-component": "CardItem",
  "x-filter-targets": [],
  "properties": {
    "fzq3g18wj2t": {
      "type": "array",
      "x-initializer": "TableColumnInitializers",
      "x-component": "TableV2",
      "x-component-props": {
        "rowKey": "id",
        "rowSelection": {
          "type": "checkbox"
        },
        "useProps": "{{ useTableBlockProps }}"
      },
      "properties": {
        "xsy6psvmy0b": {
          "type": "void",
          "x-decorator": "TableV2.Column.Decorator",
          "x-designer": "TableV2.Column.Designer",
          "x-component": "TableV2.Column",
          "properties": {
            "report.user": {
              "x-uid": "a8vg3zrb8n0",
              "version": "2.0",
              "x-component": "CollectionField",
              "x-read-pretty": true,
              "x-collection-field": "report.user",
              "x-component-props": {
                "ellipsis": true,
                "size": "small",
                "mode": "Tag",
                "enableLink": false
              },
              "x-async": false,
              "x-index": 1
            }
          },
          "x-uid": "njy6r10k8ry",
          "x-async": false,
          "x-index": 2
        },
        "filnvehv9wn": {
          "version": "2.0",
          "type": "void",
          "x-decorator": "TableV2.Column.Decorator",
          "x-designer": "TableV2.Column.Designer",
          "x-component": "TableV2.Column",
          "properties": {
            "report": {
              "version": "2.0",
              "x-collection-field": "report",
              "x-component": "CollectionField",
              "x-component-props": {
                "ellipsis": true,
                "size": "small",
                "mode": "Tag"
              },
              "x-read-pretty": true,
              "x-decorator": null,
              "x-decorator-props": {
                "labelStyle": {
                  "display": "none"
                }
              },
              "x-async": false,
              "x-index": 1
            }
          },
          "x-uid": "5w36fqpxct8",
          "x-async": false,
          "x-index": 3
        },
        "0p3cbb4q8ie": {
          "version": "2.0",
          "type": "void",
          "x-decorator": "TableV2.Column.Decorator",
          "x-designer": "TableV2.Column.Designer",
          "x-component": "TableV2.Column",
          "x-component-props": {
            "sorter": true
          },
          "properties": {
            "hours": {
              "x-collection-field": "hours",
              "x-component": "CollectionField",
              "x-component-props": {},
              "x-read-pretty": true,
              "x-decorator": null,
              "x-decorator-props": {
                "labelStyle": {
                  "display": "none"
                }
              },
              "x-uid": "ead3k1lhms2",
              "x-async": false,
              "x-index": 1
            }
          },
          "x-async": false,
          "x-index": 5
        },
        "zyngoj4k9sa": {
          "type": "void",
          "x-decorator": "TableV2.Column.Decorator",
          "x-designer": "TableV2.Column.Designer",
          "x-component": "TableV2.Column",
          "properties": {
            "isBusinessTrip": {
              "x-collection-field": "isBusinessTrip",
              "x-component": "CollectionField",
              "x-component-props": {
                "ellipsis": true
              },
              "x-read-pretty": true,
              "x-decorator": null,
              "x-decorator-props": {
                "labelStyle": {
                  "display": "none"
                }
              },
              "x-uid": "utijl75mj63",
              "x-async": false,
              "x-index": 1
            }
          },
          "x-uid": "wign04jkh89",
          "x-async": false,
          "x-index": 6
        }
      },
      "x-uid": "nidxtj2r5gu",
      "x-async": false,
      "x-index": 2
    }
  },
  "x-uid": "6kzpw7wfk7s",
  "x-async": false,
  "x-index": 1
}

export const PrjWorkStaticShow: React.FC = observer(() => {
  return (
      <SchemaComponentProvider scope={{useTableBlockProps}} components={{TableBlockProvider, TableV2}}>
          <SchemaComponent schema={schema} />
      </SchemaComponentProvider>
  )})
  


