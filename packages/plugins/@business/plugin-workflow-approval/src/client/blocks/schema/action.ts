

const action ={
  
    "version": "2.0",
    "title": "{{t(\"Submit to workflow\", { ns: \"workflow\" })}}",
    "x-component": "Action",
    "x-component-props": {
        "useProps": "{{ useTriggerWorkflowsActionProps }}"
    },
    "x-designer": "Action.Designer",
    "x-action-settings": {
        "assignedValues": {},
        "skipValidator": false,
        "onSuccess": {
            "manualClose": true,
            "redirecting": false,
            "successMessage": "{{t(\"Submitted successfully\")}}"
        },
        "triggerWorkflows": [{
            "workflowKey":'12333'
        }]
    },
    "x-action": "customize:triggerWorkflows",
    "type": "void",
    "name": "lmstlcaplzf",
    "x-uid": "gk29x0posjv",
    "x-async": false,
    "x-index": 3
}