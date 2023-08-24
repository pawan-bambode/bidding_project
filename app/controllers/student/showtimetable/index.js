const student = require('../../../models/Students');
module.exports = {
 showtimetable: (req,res) =>{
    Promise.all([student.getSlotForShowTimetable(),student.getDistintRoomList()]).then(result =>{
      res.render('student/showTimetableStudent.ejs',{
      minMaxSlotId:JSON.stringify(result[0].recordsets[0]),
      roomList: JSON.stringify(result[1].recordset),
      })
    })
 }
}