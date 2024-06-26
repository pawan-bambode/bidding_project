const bonusBidPoints = require('../../../models/admin/bonusBidPoints/bonusbidpoints');
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        Promise.all([bonusBidPoints.getList(res.locals.slug, res.locals.biddingId)])
            .then(result => {
                res.render('admin/bonusBidPoints/index', {
                    active: sidebarActive[2],
                    breadcrumbs: req.breadcrumbs,
                    bonusBidPoints: result[0].recordset
                });
            });
    },

    add: (req, res) => {
        bonusBidPoints.add(res.locals.slug, res.locals.userId, res.locals.biddingId, req.body.InputJson)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                handleErrorResponse(error, res);
            });
    },

    delete: (req, res) => {
        bonusBidPoints.delete(res.locals.slug, res.locals.userId, res.locals.biddingId, req.body.Id)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                handleErrorResponse(error, res);
            });
    },

    update: (req, res) => {
        bonusBidPoints.update(res.locals.slug, res.locals.userId, res.locals.biddingId, req.body.inputJson)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                handleErrorResponse(error, res);
            });
    }
};

function handleErrorResponse(error, res) {
    if (isJsonString.isJsonString(error.originalError.info.message)) {
        res.status(500).json(JSON.parse(error.originalError.info.message));
    } else {
        res.status(500).json({
            status: 500,
            description: error.originalError.info.message,
            data: []
        });
    }
}
