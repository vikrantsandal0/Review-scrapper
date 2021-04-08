const crawler  = require('./controller');

const scrapurl = (req, res) => {
    crawler.scrapurl(req.body).then((data) => {
        return res.send(JSON.stringify({
            "message": 'Successful',
            "status": 200,
            "data": data
        }));
    }, (error) => {
        return res.send({
            "message": error ? error.message : 'some error occurred',
            "status": 400,
            "data": {}
        });
    });
}

exports.scrapurl = scrapurl