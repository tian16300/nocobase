

const axios = require('axios');
/**
 *https://date.nager.at/Api
 */
export const getHoliday = async (year)=>{
    const url =`https://api.jiejiariapi.com/v1/holidays/${year}`;
    const res = await axios.get(url)
    return res.data;
}