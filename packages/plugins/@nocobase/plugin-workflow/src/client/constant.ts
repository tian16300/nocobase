export const getWorkflowDetailPath = (id: string | number, params?:string) => `/admin/workflow/workflows/${id}${params?params:''}`;
// export const getWorkflowDetailPath = (id: string | number) => `/admin/workflow/workflows/${id}`;
// export const getWorkflowDetailPath = (id: string | number) => `/admin/workflow/workflows/${id}`;
export const getWorkflowExecutionsPath = (id: string | number) => `/admin/workflow/executions/${id}`;
