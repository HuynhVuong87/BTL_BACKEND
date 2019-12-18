const { validationResult, matchedData } = require('express-validator');

exports.check = (req, res, next) => {
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
        return res.status(422).json({
            errors: result.array()
        });
    };
    req.body = matchedData(req);
    next();
}