const dkthiModels = require('../models/dkthi');


exports.show_session_for_student = (req, res) => {
    dkthiModels.show_session_for_student(req.params.id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({
            message: err
        })
    });
}

exports.booked_room = (req, res) => {
    dkthiModels.booked_room(req.body, req.query.out).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({
            message: err
        })
    });
}