import { useRecord } from "@nocobase/client";
import { useNavigate } from 'react-router-dom';
export const useApprovalWorkflowFormActionProps = (props)=>{
    const navigate = useNavigate();
    const record = useRecord();
    const id = record?.id;
    const {current} = props;
    return {
        onClick: async () =>{
           if(!id){
             /* 跳转到 添加界面 */
             navigate('/admin/approval/settings');
            
           }else{
             /* 跳转到 编辑界面 */
             navigate(`/admin/approval/settings?id=${id}&current=${current}`);
           }
        }
    }
}