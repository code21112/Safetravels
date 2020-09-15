////////////////////////////////////////
// MY CODE
///////////////////////////////////////

// const mongoose = require('mongoose');


// const tagSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             trim: true,
//             required: true,
//             maxLength: 32
//         },
//         slug: {
//             type: String,
//             unique: true,
//             index: true
//         },
//     },
//     { timestamp: true }
// );

// module.exports = mongoose.model('Tag', tagSchema);

////////////////////////////////////////
// END OF MY CODE
///////////////////////////////////////



const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        slug: {
            type: String,
            unique: true,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tag', tagSchema);