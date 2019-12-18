const userModel = require('../models/user');
exports.get_all_students = (req, res) => {
    userModel.get_all_students().then(data => {
        res.status(200).json(data);
    }).catch(err => res.status(500).json({
        message: err
    }));
}

exports.add_students = async (req, res) => {
    // console.log(req.body);
    // res.status(200).json({
    //     data: req.body
    // });
    userModel.import_students(req.body.data).then((result) => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    })
}

exports.get_all = () => {
    userModel.list_user()
}

exports.get_email = (req, res) => {
    console.log(req.query.username);
    userModel.get_email(req.query.username).then((result) => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    })
}