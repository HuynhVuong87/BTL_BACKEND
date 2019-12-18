const admin = require('firebase-admin');

//middleware kiểm tra client request có phải là admin không?
exports.isAdmin = (req, res, next) => {
    const idToken = req.headers['authorization'].toString();
    try {
        admin.auth().verifyIdToken(idToken.split(' ')[1]).then((claims) => {
            if (claims.admin === true) {
                // Allow access to requested admin resource.
                next()
            }else {
                res.status(500).json({
                    message: 'Bạn không phải admin, vui lòng kiểm tra lại'
                }); 
            };
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: 'Có lỗi, vui lòng kiểm tra lại...!'
        });
    };     
}

exports.isStudent = (req, res, next) => {
    const idToken = req.headers['authorization'].toString();
    try {
        admin.auth().verifyIdToken(idToken.split(' ')[1]).then((claims) => {
            if (claims.student === true) {
                // Allow access to requested admin resource.
                next()
            }else {
                res.status(500).json({
                    message: 'Bạn không phải sinh viên, vui lòng kiểm tra lại'
                }); 
            };
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: 'Có lỗi, vui lòng kiểm tra lại...!'
        });
    };     
}


exports.belongUser = (req, res, next) => {
    const idToken = req.headers['authorization'].toString();
    try {
        admin.auth().verifyIdToken(idToken.split(' ')[1]).then((claims) => {
            if (claims.uid == req.params.id) {
                // Allow access to requested admin resource.
                next()
            }else {
                res.status(500).json({
                    message: 'Bạn không phải là người dùng này, vui lòng kiểm tra lại!...'
                }); 
            };
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: 'Có lỗi, vui lòng kiểm tra lại...!'
        });
    };     
}