const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const evaluationCriteria = new Schema({

    description: {
        type: String,
        required: true
    },
    targetValue: {
        type: Number,
        required: true
    },
    actualValue: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model("evaluationCriteria", evaluationCriteria);
