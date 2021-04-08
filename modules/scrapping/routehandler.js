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
            "message": 'Some error occurred while executing.',
            "status": 400,
            "data": {}
        });
    });
}

exports.scrapurl = scrapurl