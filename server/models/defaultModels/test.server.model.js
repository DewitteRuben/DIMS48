const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TestsDatabase = require('../../util/databaseGetter').TestDatabase;

const phaseTestSchema = require('./phase.test.server.model').schema;
const optionSchema = require('./option.server.model').schema;

const TestSchema = new Schema({
    _id: Number,
    title: {type: String, required: true},
    description: String,
    phases: [phaseTestSchema],
    config: [optionSchema]
}, {_id: false});

module.exports = {
    model: TestsDatabase.model('Test', TestSchema),
    schema: TestSchema,
};
