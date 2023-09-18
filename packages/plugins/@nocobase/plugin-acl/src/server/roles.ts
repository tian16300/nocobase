const auth = {
    allowNewMenu: true,
    strategy: { actions: ['view', 'update:own', 'destroy:own', 'create'] },
    snippets: ['!ui.*', '!pm', '!pm.*'],
}


const roles = [{
    name: 'member',
    title: '{{t("Member")}}',
    default: true,
},
{
    "name": "purchaser",
    "title": "采购"
},
{
    "name": "development",
    "title": "研发工程师"
},
{
    "name": "silopipe",
    "title": "仓库管理员"
}, {
    "name": "developmentManager",
    "title": "研发工程师主管"
}
]
export const roleRecords = roles.map((role) => {
    return {
        ...role,
        ...auth
    }
})
export const aclFilterCondition = roles.map(({ name }) => {
    return {
        'name.$ne': name
    }
})