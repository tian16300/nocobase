export default {
  name: 'prjWlCb_bomWl_mid',
  title: '项目物成本及BOM明细中间表',
  inherit: false,
  hidden: false,
  description: null,
  fields: [
    {
        
        "name": "id",
        "type": "bigInt",
        "interface": "id",
        "description": null,
        "collectionName": "prjWlCb_bomWl_mid",
        "parentKey": null,
        "reverseKey": null,
        "autoIncrement": true,
        "primaryKey": true,
        "allowNull": false,
        "uiSchema": {
            "type": "number",
            "title": "{{t(\"ID\")}}",
            "x-component": "InputNumber",
            "x-read-pretty": true
        }
    },
    {
        
        "name": "history_bom_wl_id",
        "type": "bigInt",
        "interface": "integer",
        "description": null,
        "collectionName": "prjWlCb_bomWl_mid",
        "parentKey": null,
        "reverseKey": null,
        "isForeignKey": true,
        "uiSchema": {
            "type": "number",
            "title": "history_bom_wl_id",
            "x-component": "InputNumber",
            "x-read-pretty": true
        }
    },
    {
        
        "name": "total_prj_wl_cb_id",
        "type": "bigInt",
        "interface": "integer",
        "description": null,
        "isForeignKey": true,
        "uiSchema": {
            "type": "number",
            "title": "total_prj_wl_cb_id",
            "x-component": "InputNumber",
            "x-read-pretty": true
        }
    },
    {
        
        "name": "total_bom_wl_id",
        "type": "bigInt",
        "interface": "integer",
        "description": null,
        "collectionName": "prjWlCb_bomWl_mid",
        "parentKey": null,
        "reverseKey": null,
        "isForeignKey": true,
        "uiSchema": {
            "type": "number",
            "title": "total_bom_wl_id",
            "x-component": "InputNumber",
            "x-read-pretty": true
        }
    },
    {
        
        "name": "history_prj_wl_cb_id",
        "type": "bigInt",
        "interface": "integer",
        "description": null,
        "collectionName": "prjWlCb_bomWl_mid",
        "parentKey": null,
        "reverseKey": null,
        "isForeignKey": true,
        "uiSchema": {
            "type": "number",
            "title": "history_prj_wl_cb_id",
            "x-component": "InputNumber",
            "x-read-pretty": true
        }
    },
    {
        
        "name": "prj_wl_cb_id",
        "type": "bigInt",
        "interface": "integer",
        "description": null,
        "collectionName": "prjWlCb_bomWl_mid",
        "parentKey": null,
        "reverseKey": null,
        "isForeignKey": true,
        "uiSchema": {
            "type": "number",
            "title": "prj_wl_cb_id",
            "x-component": "InputNumber",
            "x-read-pretty": true
        }
    }
],
  category: [],
  logging: true,
  autoGenId: true,
  createdBy: false,
  updatedBy: false,
  createdAt: false,
  updatedAt: false,
  sortable: true,
  template: 'general',
  view: false,
  schema: 'public',
};
