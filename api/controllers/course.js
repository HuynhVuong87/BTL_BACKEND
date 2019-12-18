const helperServices = require("../services/helper");
const CourseModel = require("../models/course");

exports.get_all_courses = (req, res) => {
    if (req.query.field) {
        CourseModel.get_all_courses_with_field(req.query.field)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err =>
                res.status(500).json({
                    message: err
                })
            );
    } else
        CourseModel.get_all_courses()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err =>
            res.status(500).json({
                message: err
            })
        );
};

exports.add_students_for_course = (req, res) => {
    CourseModel.add_students_for_course(req.params.id, req.body.data)
        .then(() => {
            res.status(200).json({
                message: "THEM THANH CONG SINH VIEN"
            });
        })
        .catch(err =>
            res.status(500).json({
                message: err
            })
        );
};

exports.add_one_course = (req, res) => {
    CourseModel.set_one_course(req.body)
        .then(data => {
            res.status(200).json({
                message: "THEM THANH CONG HOC PHAN"
            });
        })
        .catch(err =>
            res.status(500).json({
                message: err
            })
        );
};

exports.get_one_course = (req, res) => {
    CourseModel.get_one_course(req.params.id)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err =>
            res.status(500).json({
                message: err
            })
        );
};

exports.update_one_course = (req, res) => {
    CourseModel.update_one_course(req.params.id, req.body)
        .then(() => {
            res.status(200).json({
                message: "update thanh cong"
            });
        })
        .catch(err =>
            res.status(500).json({
                message: err
            })
        );
};

exports.set_term_for_courses = (req, res) => {
    CourseModel.set_term_for_courses(req.body)
        .then(() => {
            res.status(200).json({
                message: "update thanh cong"
            });
        })
        .catch(err =>
            res.status(500).json({
                message: err
            })
        );
};