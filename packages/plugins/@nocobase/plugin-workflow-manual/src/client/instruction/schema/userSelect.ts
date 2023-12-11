

export const userSelect = {
    type: 'object',
    // 'x-component': 'Space',
    // 'x-component-props': {
    //   direction: 'vertical',
    // },
    properties: {
      ruleType: {
        type: 'string',
        title: `参与人`,
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        enum: [
          {
            label: '所有人',
            value: 'all',
          },
          {
            label: '部门主管',
            value: '{{$context.data.updatedBy.dept.supervisorUserId}}',
          },
          {
            label: '指定部门',
            value: 'depts',
          },
          {
            label: '指定角色',
            value: 'roles',
          },
          {
            label: '指定人员',
            value: 'users',
          },
        ],
        default: 'all',
      },
      depts: {
        type: 'array',
        title: '选择部门',
        'x-decorator': 'FormItem',
        'x-component': 'RemoteSelect',
        'x-component-props': {
          mode: 'multiple',
          fieldNames: {
            label: 'name',
            value: 'id',
          },
          service: {
            resource: 'dept',
            action: 'list',
          },
        },
        default: [],
        'x-reactions': [
          {
            dependencies: ['.ruleType'],
            fulfill: {
              state: {
                visible: '{{$deps[0] === "depts"}}',
              },
            },
          },
        ],
      },
      roles: {
        type: 'array',
        title: '选择角色',
        'x-decorator': 'FormItem',
        'x-component': 'RemoteSelect',
        'x-component-props': {
          mode: 'multiple',
          fieldNames: {
            label: 'title',
            value: 'name',
          },
          service: {
            resource: 'roles',
            action: 'list',
          },
        },
        'x-reactions': [
          {
            dependencies: ['.ruleType'],
            fulfill: {
              state: {
                visible: '{{$deps[0] === "roles"}}',
              },
            },
          },
        ],
      },
      users: {
        type: 'array',
        title: '选择用户',
        'x-decorator': 'FormItem',
        'x-component': 'RemoteSelect',
        'x-component-props': {
          mode: 'multiple',
          fieldNames: {
            label: 'nickname',
            value: 'id',
          },
          service: {
            resource: 'users',
            action: 'list',
          },
        },
        'x-reactions': [
          {
            dependencies: ['.ruleType'],
            fulfill: {
              state: {
                visible: '{{$deps[0] === "users"}}',
              },
            },
          },
        ],
      },
    }
};