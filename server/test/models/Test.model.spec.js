const mongoose = require('mongoose');
const chai = require('chai');
const should = require('chai').should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const functionFactory = require('./util/functionFactory');
const defaultModels = require('../../models/defaultModels');

const databaseConnectionManager = require('../testingUtils/databaseConnectionManager');
databaseConnectionManager.connectDatabase();

describe('Test Model', () => {
    const Test = defaultModels.Test;

    beforeEach(functionFactory.createBeforeEach(Test));
    afterEach(functionFactory.createAfterEach(Test));
    after(async () => {databaseConnectionManager.disconnectDatabase()});

    it("should exsist", () => {
        Test.should.not.be.undefined;
    });

    it('should be able to get a test', async () => {
        const test = new Test({
            "_id" : 0,
            "title" : "Verwerkingsfase en onmiddellijke herkenningsfase",
            "description" : "Testen van het kortetermijngeheugen",
            "route" : "dims48a",
            "__v" : 0
        });
        await test.save();

        const foundTest = await Test.findOne({_id: 0});
        const expectedId = 0;
        const actual = foundTest._id;

        expectedId.should.equal(actual);
    });
});
