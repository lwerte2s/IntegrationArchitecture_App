
const axios = require("axios");
const {RSA_NO_PADDING} = require('constants');
const qs = require('querystring');

const baseUrl = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';
let accessToken = null;

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    }
}


async function getOrangeHRMToken(){
    const body = qs.stringify({
        client_id: 'api_oauth_id',
        client_secret: 'oauth_secret',
        grant_type: 'password',
        username: 'wertenbruch',
        password: '*Safb02!StudentAsUserPwd$'
    });

    let response = await axios.post(`${baseUrl}/oauth/issueToken`, body, config)
    if (response.data.error){
        throw Error(response.data.error);
    }

    accessToken = response.data['access_token'];
    config.headers.Authorization = `Bearer ${accessToken}`;
}



async function getAllEmployees(){
    await getOrangeHRMToken();
    let res = await axios.get(`${baseUrl}/api/v1/employee/search`, config);
    return res.data;
}



async function addBonusSalary(id,body){
    await getOrangeHRMToken();
    body ={year: body.year, value: body.value};
    let res = await axios.post(`${baseUrl}/api/v1/employee/${id}/bonussalary`, qs.stringify(body) ,config);
    return res.data;
}


module.exports = {
    "getAllEmployees": getAllEmployees,
    "addBonusSalary": addBonusSalary,
    "getAccessToken": getOrangeHRMToken,
    "config": config,
};
