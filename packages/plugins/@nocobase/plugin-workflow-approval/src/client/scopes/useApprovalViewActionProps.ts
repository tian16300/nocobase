import { useRecord } from "@nocobase/client";

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getApprovalDetailPath } from "../hooks";
export const  useApprovalViewActionProps = ()=> {
    const record = useRecord();
    // this.app.pluginSettingsManager.getRoutePath("hello");
    const navigate = useNavigate();
    const linkPath = getApprovalDetailPath()+`?id=${record.id}`;
    return {
        async onClick() {
            navigate(linkPath);

        }
    };
}
