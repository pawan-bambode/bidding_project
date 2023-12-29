
module.exports = {
  
    getPage :(req, res) =>{
        let addDropUrl = req.route.path.split('/');
        let addDrop = addDropUrl[addDropUrl.length-1]
        res.render('student/adddrop/index', {
          active: addDrop
        })
      },
}