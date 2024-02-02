export default {
    "logging": true,
    "autoGenId": true,
    "createdBy": false,
    "updatedBy": false,
    "createdAt": false,
    "updatedAt": false,
    "sortable": true,
    "name": "approval_copy_users_mid",
    "template": "general",
    "view": false,
    "fields":  [
        {
            
            "name": "id",
            "type": "bigInt",
            "interface": "id",
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
         
            "name": "copy_user_id",
            "type": "bigInt",
            "interface": "integer",
            "isForeignKey": true,
            "uiSchema": {
                "type": "number",
                "title": "copy_user_id",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        }
    ],
    "title": "审批申请抄送人中间表"
}