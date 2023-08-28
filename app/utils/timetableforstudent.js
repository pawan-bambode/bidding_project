const axios = require('axios');
const { Promise } = require('mssql');
module.exports = {
 getTimetableforStudent : (req,res) =>{
   Promise.all([axios.get('http://localhost:3000/admin/getTimetableforStudent')])
    .then(response => {
      console.log('values of response is--------->',response);
     
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
}