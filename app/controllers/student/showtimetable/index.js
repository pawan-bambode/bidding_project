const student = require('../../../models/Students');
const studentUtil = require('../../../utils/timetableforstudent');

module.exports = {
  showtimetable: (req, res) => {
    Promise.all([student.getSlotForShowTimetable(), student.getDistintRoomList(), student.getTimeslot(),student.fetchAllCourseSelByStudent('15048')]).then(result => {
      res.render('admin/students/showTimetableStudent.ejs', {
        minMaxSlotId: JSON.stringify(result[0].recordsets[0]),
        roomList: JSON.stringify(result[1].recordset),
        timeSlotList: JSON.stringify(result[2].recordset),
        courseSelectedByStud :JSON.stringify(result[3].recordset)
      })
    })
  },
  subjectAdded: (req,res) =>{
      student.subjectAdded(req.body.input_json).then(result =>{
      res.status(200).json(JSON.parse(result.output.output_json))
    }).catch(err => {
      res.status(500).json((err.message))
  });
  },
  updateSubject :(req,res) =>{
   student.updateSubject(req.body.input_json).then(result =>{
    res.status(200).json(JSON.parse(result.output.output_json))
  }).catch(err => {
    res.status(500).json((err.message))
   });
  }
}




