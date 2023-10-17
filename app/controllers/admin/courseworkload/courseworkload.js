module.exports = {
    getCourseworkload : (req, res) => {
        console.log('res----------->',req.body);
        res.render('admin/courseworkload/index.ejs');
    }
}