const axios = require('axios');
const { Promise } = require('mssql');
module.exports = {
//  getTimetableforStudent : (req,res) =>{
//    Promise.all([axios.get('http://localhost:3000/admin/getTimetableforStudent')]) 
//     .then(response => {

     
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//     });
// },
getTimetableforStudent : (req,res) => {
    axios.get('http://localhost:3000/admin/getTimetableforStudent',
    {
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    })
    .then(resp => {
        return JSON.stringify(resp.data);
    })
}
}