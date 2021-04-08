const apiReferenceModule = 'crawler';
const Joi = require('joi');
const common = require('../../common/commonfunction');
const logging = require('../../common/logging');

const scrapurl = (req, res, next) => {
    logging.log('inside validator-->', req.body);
    const schema = Joi.object().keys({
        URL: Joi.string().required()
    });
    
    if (common.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "scrapurl"
        };
        next()
    }
};

exports.scrapurl = scrapurl;