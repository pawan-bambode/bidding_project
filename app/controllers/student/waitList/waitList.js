
module.exports = {

    getPage :(req, res) => {
        let waitListUrl = req.route.path.split('/');
        let wait = waitListUrl[waitListUrl.length-1]
    
        res.render('student/waitlist/index', {
          active : wait
        })
      },
}