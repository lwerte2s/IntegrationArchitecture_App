const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const evaluationRecordSchema = new Schema({

    salesmanId: {
        type: Number,
        required: true
    },
    evaluationId: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    goals: {
        type: Array,
        required: false
    },
    remarks: {
        type: String,
        required: false
    }

});

module.exports = mongoose.model('evaluationRecord', evaluationRecordSchema);
