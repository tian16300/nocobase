
import { message as antMessage } from 'antd';
const message: any = {};
const keys = ['info', 'error', 'success', 'warning'];
keys.forEach((key: any) => {
    message[key] = (text) => {
        antMessage.open({
            type: key,
            content: text
        })
    }
});
export { message };