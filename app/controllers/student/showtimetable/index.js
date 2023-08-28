const student = require('../../../models/Students');
const studentUtil = require('../../../utils/timetableforstudent');

module.exports = {
  showtimetable: (req, res) => {
    console.log('inside the showtimeatbletabe',)
    Promise.all([student.getSlotForShowTimetable(), student.getDistintRoomList(), student.getTimeslot()]).then(result => {
      res.render('admin/students/showTimetableStudent.ejs', {
        minMaxSlotId: JSON.stringify(result[0].recordsets[0]),
        roomList: JSON.stringify(result[1].recordset),
        timeSlotList: JSON.stringify(result[2].recordset)
      })
    })
  }
}



