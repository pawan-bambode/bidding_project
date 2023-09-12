const { Result } = require('express-validator');
const student = require('../../../models/Students');
const studentUtil = require('../../../utils/timetableforstudent');

module.exports = {
  showtimetable: (req, res) => {
    Promise.all([student.getSlotForShowTimetable(), student.getDistintRoomList(), student.getTimeslot(),student.fetchAllCourseSelByStudent('15048'),student.getSlotDayId('1'),student.getSlotDayId(2),student.getSlotDayId(3),student.getSlotDayId(4),student.getSlotDayId(5),student.getSlotDayId(6)]).then(result => {
      res.render('admin/students/showTimetableStudent.ejs', {
        minMaxSlotId: JSON.stringify(result[0].recordsets[0]),
        roomList: JSON.stringify(result[1].recordset),
        timeSlotList: JSON.stringify(result[2].recordset),
        courseSelectedByStud :JSON.stringify(result[3].recordset),
        slot_lid_monday:JSON.stringify(result[4].recordset),
        slot_lid_tuesday:JSON.stringify(result[5].recordset),
        slot_lid_wednesday:JSON.stringify(result[6].recordset),
        slot_lid_thirdsday:JSON.stringify(result[7].recordset),
        slot_lid_friday:JSON.stringify(result[8].recordset),
        slot_lid_satuday:JSON.stringify(result[9].recordset),
      })
    })
  },
  getByDay: (req, res) => {
    Promise.all([student.getTimetableByDayId(req.body.daylid)]).then(result => {
        console.log('req.body:::::::::::::',result)
      res.json({
        status: "200",
        message: "Sucessfull",
        timetablelist: result[0].recordset,
      })
    }).catch(error => {
      console.log(error)
      res.status(500).json(error.originalError.info.message)
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





