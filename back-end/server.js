const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();

// bring routes
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const formRoutes = require('./routes/form');
// const DB = process.env.DATABASE_CLOUD.replace('<PASSWORD>', process.env.PASSWORD)

// app under construction
const app = express();


// connection database


mongoose
    .connect(process.env.DATABASE_CLOUD, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log("dB connected"));


// middlewares
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
// CE QUE JE RAJOUTE SUITE A UNE RECHERCHE SUR INTERNET
// app.use(bodyParser.urlencoded({ extended: false }))
// FIN DE CE QUE JE RAJOUTE SUITE A UNE RECHERCHE SUR INTERNET

// app.use(bodyParser.json());

app.use(cookieParser());

// routes Middlewares
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', formRoutes);


// cors
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));

}


// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port port ${port}`)
});



///////////////////  CODE FROM SENDINBLUE

// const SibApiV3Sdk = require('sib-api-v3-sdk');

// const next = require("next");
// const dev = process.env.NODE_ENV !== "production";
// const app2 = next({ dev });
// const handle = app.getRequestHandler();

// app2
//     .prepare()
//     .then(() => {
//         const server = express();
//         server.get("*", (req, res) => {
//             return handle(req, res);
//         });
//         server.listen(3000, (err) => {
//             if (err) throw err;
//             console.log("> Ready on http://localhost:3000");
//         });


//     })
//     .catch((ex) => {
//         console.error(ex.stack);
//         process.exit(1);
//     });

// app.use(bodyParser.json()).post('/api/contact', (req, res) => {
//     const { email = '', msg = '' } = req.body; //We will use this later

//     res.send('success');

// });

// var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
// var apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = process.env.SENDINBLUE_APIKEY
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKey.apiKeyPrefix['api-key'] = "Token"

// Configure API key authorization: partner-key
// var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = "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"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//partnerKey.apiKeyPrefix['partner-key'] = "Token"

// var api = new SibApiV3Sdk.AccountApi()
// api.getAccount().then(function (data) {
//     console.log('API called successfully. Returned data: ' + data);
//     console.log(data)
// }, function (error) {
//     console.error(error);
// });

