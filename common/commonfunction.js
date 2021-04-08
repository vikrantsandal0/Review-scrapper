const Joi = require('joi');
const logging = require('./logging');
const _ = require('underscore');

const validateFields = (req, res, schema) => {
    const validation = Joi.validate(req, schema);
    if (validation.error) {
        let errorName = validation.error.name;
        let errorReason = validation.error.details !== undefined ? validation.error.details[0].message : 'Parameter missing or parameter type is wrong';
        let response = {
            "message": 'Insufficient information was supplied. Please check and try again',
            "status": 100,
            "data": {}
        };
        logging.log("validateFields", errorReason)
        res.send(JSON.stringify(response));
        return false;
    }
    return true;
};

const validURL = (str) => {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
exports.validateFields = validateFields;
exports.validURL = validURL;
