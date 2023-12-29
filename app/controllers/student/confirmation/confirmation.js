
module.exports = {

    getPage :(req ,res) => {
        let confirmationUrl = req.route.path.split('/');
        let confirmation = confirmationUrl[confirmationUrl.length-1]
    
        res.render('student/confirmation/index',{
          active : confirmation
        })  
    },
}