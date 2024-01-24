export default {
    "logging": true,
    "autoGenId": true,
    "createdBy": false,
    "updatedBy": false,
    "createdAt": false,
    "updatedAt": false,
    "sortable": true,
    "name": "approval_users_mid",
    "template": "general",
    "view": false,
    "fields":  [
        {
            
            "name": "id",
            "type": "bigInt",
            "interface": "id",
            "collectionName": "approval_users_mid",
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
          
            "name": "approval_apply_id",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "approval_apply_id",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        {
         
            "name": "approval_user_id",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "approval_user_id",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        }
    ],
    "title": "审批申请审批人中间"
}