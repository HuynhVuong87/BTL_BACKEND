const TermModel = require('../models/term');

exports.add_one_term = (req, res) => {
    TermModel.add_one_term(req.body).then(()=>{
        res.status(200).json({
            message: 'Them thanh cong ki thi'
        })
    }).catch(err=>{
        res.status(500).json({
            message: err
        })
    })
}

exports.get_all_term = (req, res) => {
    TermModel.get_all_term().then(data=>{
        // console.log(data);
        res.status(200).json(data)
    }).catch(err=>res.status(500).json({
        message: err
    }))
}

exports.get_all_term_active = (req, res) => {
    TermModel.get_all_term_active().then(data=>{
        // console.log(data);
        res.status(200).json(data)
    }).catch(err=>res.status(500).json({
        message: err
    }))
}

exports.get_one_term = (req, res) => {
    TermModel.get_one_term(req.params.id).then(data=>{
        // console.log(data);
        res.status(200).json(data)
    }).catch(err=>res.status(500).json({
        message: err
    }))
}

exports.modify_term = (req, res) => {
    console.log(req.query);
    TermModel.modify_term(req.params.id, req.query).then(data=>{
        // console.log(data);
        res.status(200).json({
            message: 'Cập nhật thành công kì thi'
        })
    }).catch(err=>res.status(500).json({
        message: err
    }))
}