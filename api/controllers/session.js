const SessionModel = require('../models/session');

exports.set_one_session = (req, res) => {
    SessionModel.set_one_session(req.body).then((data) => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({
            message: err
        })
    })
}

exports.disable_session_of_course = (req, res) => {
    SessionModel.remove_multi_session_of_course(req.body).then((data) => {
        res.status(200).json({
            message: "Update thanh cong",
            sessions: data
        })
    }).catch(err => {
        res.status(500).json(err)
    })
}

exports.get_one_session = (req, res) => {
    SessionModel.get_one_session(req.params.id).then(data=>{
        res.status(200).json(data)
    }).catch(err=>{
        res.status(500).json({
            message: err
        })
    })
}

exports.modify_room_in_session = (req, res) => {
    SessionModel.modify_room_in_session(req.body).then(()=>{
        res.status(200).json({
            message: 'Cập nhật thành công ca thi'
        })
    }).catch(err=>{
        
        res.status(500).json({
            message: err
        })
    })
}
exports.get_students_in_room = (req, res) => {
    SessionModel.get_students_in_room(req.params.id).then(data=>{
        res.status(200).json(data)
    }).catch(err=>{
        res.status(500).json({
            message: err
        })
    })
}
