
// 2nd method of importing CSS with next.js
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
    publicRuntimeConfig: {
        APP_NAME: 'SAFE TRAVELS',
        // APP_NAME: 'TEST',
        API_DEVELOPMENT: 'http://localhost:8000/api',
        API_PRODUCTION: 'https://seoblog.com/api',
        PRODUCTION: false,
        DOMAIN_DEVELOPMENT: 'http://localhost:3000',
        DOMAIN_PRODUCTION: 'https://seoblog.com',
        // FB_APP_ID:'il met ici l'app id fourni par Facebook'
        DISQUS_SHORTNAME: 'safe-travels'

    }
});



// module.exports = {
//     publicRuntimeConfig: {
//         APP_NAME: 'SEOBLOG',
//         // APP_NAME: 'TEST',
//         API_DEVELOPMENT: 'http://localhost:8000/api',
//         PRODUCTION: false,
//     }
// };