const preRequisites = require('../../../models/admin/preRequisite/prerequisite');
const programSession = require('../../../models/admin/programSession/programsession');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const isJsonString = require('../../../utils/util');

module.exports = {
  getPage: (req, res) => {
    let sidebarActive = req.sidebarActive.split('/');
    Promise.all([
      preRequisites.getList(res.locals.slug, res.locals.biddingId, req.body.showEntry),
      preRequisites.getCount(res.locals.slug, res.locals.biddingId),
      programSession.acadSessionsWiseCredits(res.locals.slug, res.locals.biddingId),
      programSession.preReqAcadSession(),
      divisionBatch.courseList(res.locals.slug, res.locals.biddingId),
      preRequisites.getTypes()
    ]).then(result => {
      res.render('admin/preRequisites/index.ejs', {
        preRequitiesList: result[0].recordset,
        pageCount: result[1].recordset[0][''],
        active: sidebarActive[2],
        acadSessions: result[2].recordset,
        preReqAcadSessions: result[3].recordset,
        courses : result[4].recordset,
        preRequisiteType: result[5].recordset,
        breadcrumbs: req.breadcrumbs
      });
    });
  },

  delete: (req, res) => {
    preRequisites.delete(req.body.id, res.locals.slug, res.locals.biddingId, res.locals.userId)
      .then(result => {
        res.status(200).json(JSON.parse(result.output.output_json));
      })
      .catch(error => {
        if (isJsonString.isJsonString(error.originalError.info.message)) {
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

  update: (req, res) => {
    preRequisites.update(req.body.editPreRequisites, req.body.biddingSessionId, res.locals.userId, res.locals.slug)
      .then(result => {
        res.status(200).json(JSON.parse(result.output.output_json));
      })
      .catch(error => {
        if (isJsonString.isJsonString(error.originalError.info.message)) {
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

    add :(req, res) =>{
            
          Promise.all([
            preRequisites.add(res.locals.slug, res.locals.biddingId, req.body.preRequisites, res.locals.userId)
          ]).then(result =>{
            res.status(200).json(JSON.parse(result.output.output_json));
          }).catch(error => {
            console.log('value of error', error);
            if (isJsonString.isJsonString(error.originalError.info.message)) {
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

  showEntry: (req, res) => {
    Promise.all([
      preRequisites.showEntry(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo),
      preRequisites.showEntryCount(res.locals.slug, res.locals.biddingId)
    ]).then(result => {
      res.json({
        status: '200',
        message: 'Result fetched',
        data: result[0].recordset,
        length: result[1].recordset[0]['']
      });
    }).catch(error => {
      throw error;
    });
  },

  search: (req, res) => {
    Promise.all([
      preRequisites.search(res.locals.slug, res.locals.biddingId, req.body.searchLetter),
      preRequisites.searchCount(res.locals.slug, res.locals.biddingId, req.body.searchLetter)
    ]).then(result => {
      res.json({
        status: "200",
        message: "Result fetched",
        data: result[0].recordset,
        length: result[1].recordset[0]['']
      });
    }).catch(error => {
      throw error;
    });
  },

  courses: (req, res) =>{
    Promise.all([
      preRequisites.courseList(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)
    ]).then(result =>{
      res.json({
        status:200,
        data:result[0].recordset
      })
    })
  }
};
