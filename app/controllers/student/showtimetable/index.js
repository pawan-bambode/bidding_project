const student = require('../../../models/Students');
const studentUtil = require('../../../utils/timetableforstudent');

module.exports = {
  showtimetable: (req, res) => {
    Promise.all([student.getSlotForShowTimetable(), student.getDistintRoomList(), student.getTimeslot()]).then(result => {
      res.render('admin/students/showTimetableStudent.ejs', {
        minMaxSlotId: JSON.stringify(result[0].recordsets[0]),
        roomList: JSON.stringify(result[1].recordset),
        timeSlotList: JSON.stringify(result[2].recordset)
      })
    })
  },
  subjectAdded: (req,res) =>{
    Promise.all([student.subjectAdded(req.body.input_json)]).then(result =>{
      if(result.status='200'){
       res.json({status:200,
         description:result[0].output.output_json, 
      })
      }
    })
  }
}



