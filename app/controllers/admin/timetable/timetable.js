const timetable = require('../../../models/admin/timetable/timetable');
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        Promise.all([
            timetable.getProgramList(res.locals.slug, res.locals.biddingId),
            timetable.getMinAndMaxTime(res.locals.slug, res.locals.biddingId),
            timetable.getRoomList(res.locals.slug, res.locals.biddingId),
            timetable.getTimeslot(),
            timetable.getDropdownAcadSessionList(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('admin/timetable/index.ejs', {
                programList: result[0].recordset,
                minMaxTimetableSlot: JSON.stringify(result[1].recordset[0]),
                roomList: JSON.stringify(result[2].recordset),
                timeSlotList: JSON.stringify(result[3].recordset),
                dropdownAcadSessionList: result[4].recordset,
                active: sidebarActive[2],
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    deleteByAcadSession: (req, res) => {
        Promise.all([timetable.getAcadSessionList(res.locals.slug, res.locals.biddingId, req.body.programId)]).then(result => {
            res.json({
                stats: '200',
                message: 'Result Fetched',
                acadSessionList: result[0].recordset
            });
        });
    },

    delete: (req, res) => {
        timetable.delete(req.body.deleteTimetable, req.body.deleteRadioButton, res.locals.slug, res.locals.userId, res.locals.biddingId)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                if ((isJsonString.isJsonString(error.originalError.info.message))) {
                    res.status(500).json(JSON.parse(error.originalError.info.message));
                } else {
                    res.status(500).json({
                        status: 500,
                        description: error.originalError.info.message,
                        data: []
                    });
                }
            });
    },

    getListByDay: (req, res) => {
        timetable.getListByDayId(req.body.id, req.body.acadSessionId, res.locals.slug, res.locals.biddingId)
            .then(result => {
                res.json({
                    courseList: result.recordset,
                    data: {},
                    status: '200',
                });
            })
            .catch(error => {
                if ((isJsonString.isJsonString(error.originalError.info.message))) {
                    res.status(500).json(JSON.parse(error.originalError.info.message));
                } else {
                    res.status(500).json({
                        status: 500,
                        description: error.originalError.info.message,
                        data: []
                    });
                }
            });
    }
};
