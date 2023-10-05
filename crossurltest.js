const axios = require('axios');

axios.get('http://asmsoc-mum.localhost:3000/admin/programs/fetchTesting').then( res => {
    console.log('Check res ', res)

}).catch (err => {
    console.log('Error occured..', err)
}) 