const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaultModels = require('../defaultModels');
const ResultsPhase1 = require('./results.phase1.server.model');
const ResultsPhase2 = require('./results.phase2.server.model');

const ResultSchema = new Schema({
    timestamp: {type: Date, default: Date.now()},
    clientInfo: {type: defaultModels.ClientInfoSchema, required: true},
    answersPhase1: {type: ResultsPhase1.schema, required: true},
    answersPhase2: {type: ResultsPhase2.schema, required: true},
    answersPhase3: ResultsPhase2.schema,
});

module.exports = {
    model: mongoose.model('Results', ResultSchema),
    schema: ResultSchema,
};

