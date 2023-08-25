const student = require('../../../models/Students');
module.exports = {
 showtimetable: (req,res) =>{
    Promise.all([student.getSlotForShowTimetable(),student.getDistintRoomList(),student.getTimeslot()]).then(result =>{
        console.log('values of result[2]',result[2].recordset);
      res.render('student/showTimetableStudent.ejs',{
      minMaxSlotId:JSON.stringify(result[0].recordsets[0]),
      roomList: JSON.stringify(result[1].recordset),
      timeSlotList: JSON.stringify(result[2].recordset)
      })
    })
 }
}