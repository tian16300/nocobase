import { dayjs } from "@nocobase/utils";

var request = require('sync-request');
/**
 *https://date.nager.at/Api
 */
export const getHoliday = async (year)=>{
    const url =`https://api.jiejiariapi.com/v1/holidays/${year}`;
    const  res =  request('GET',url);
    const body = res.getBody();
    return JSON.parse(body);
}