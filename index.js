const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const generate = require('./generate');

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/api/sign', cors(), (req, res) => {
    const { wallet, index } = req.query || {};
    if (!wallet || Number.isNaN(+index)) {
        return res.status(200).json({ proof: [], amount: 0 });
    };
    return res.status(200).json({ ...generate(wallet) });
});

app.listen(7001, () => {
    console.info('server running port 7001');
});
