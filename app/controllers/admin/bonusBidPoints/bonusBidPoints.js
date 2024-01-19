module.exports = {
getPage: (req, res) => {
  
      res.render('admin/bonusBidPoints/index', { 
        active:'dashboard',
        breadcrumbs: req.breadcrumbs   
      })
    
  }
}  