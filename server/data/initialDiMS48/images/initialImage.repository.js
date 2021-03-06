const imageConstants = require('./imageConstants');
const Image = require('../../../models/defaultModels').Image;

const getDatabaseModel = function getDatabaseModel(){
    return Image;
}

const makeImage = function makeImage(localSrc, id, extra) {
    return new Image({
        _id: id,
        imgUrl: `${imageConstants.IMAGE_FOLDER}/${localSrc}/${id}.jpeg`,
        extra: extra
    });
};

const getImagesPhase1 = function getImagesPhase1(){
    let imagesArr = [];

    for (let i = 1; i <= imageConstants.AMOUNT_IMAGES; i++) {
        let idA = `A${i}`;

        let localSrc = `set${i}`;

        let amountColours = getPhase1Label(i);
        imagesArr.push(makeImage(localSrc, idA, amountColours));
    }

    return imagesArr;
};

const getImagesPhase2 = function getImagesPhase2(){
    let imagesArr = [];

    for (let i = 1; i <= imageConstants.AMOUNT_IMAGES; i++) {
        let idB = `B${i}`;
        let localSrc = `set${i}`;

        let set = getPhase2Label(i);
        imagesArr.push(makeImage(localSrc, idB, set));
    }

    return imagesArr;
};

const getPhase1Label = function getPhase1Label(imageIndex) {
    return imageConstants.PHASE1_LABELS[imageIndex];
};

const getPhase2Label = function getPhase2Label(imageIndex){
    return imageConstants.PHASE2_LABELS[imageIndex];
};

const getPhase3Label = function getPhase3Label(imageIndex){
    return imageConstants.PHASE3_LABELS[imageIndex];
};

const getAmountOfAnswersPhase1 = function getAmountOfAnswersPhase1(){
    return Object.keys(imageConstants.PHASE1_LABELS).length;
};

const getAmountOfAnswersPhase2 = function getAmountOfAnswersPhase2(){
    let amountAnswers = {abstract: 0, group: 0, unique: 0};

    Object.values(imageConstants.PHASE2_LABELS).forEach(kind => {
        switch (kind) {
            case imageConstants.SET_KINDS.Abstract:
                amountAnswers.abstract++;
                break;
            case imageConstants.SET_KINDS.Group:
                amountAnswers.group++;
                break;
            case imageConstants.SET_KINDS.Unique:
                amountAnswers.unique++;
        }
    });
    return amountAnswers;
};

const getAmountOfAnswersPhase3 = function getAmountOfAnswersPhase3(){
    return getAmountOfAnswersPhase2();
};

function getDistributionSets(){
  let amountAnswers = getAmountOfAnswersPhase2();
  amountAnswers.abstract = amountAnswers.abstract / imageConstants.AMOUNT_IMAGES;
  amountAnswers.group = amountAnswers.group / imageConstants.AMOUNT_IMAGES;
  amountAnswers.unique = amountAnswers.unique / imageConstants.AMOUNT_IMAGES;
  return amountAnswers;
}

module.exports = {
    getDatabaseModel,
    getImagesPhase1,
    getImagesPhase2,
    getPhase1Label,
    getPhase2Label,
    getPhase3Label,
    getAmountOfAnswersPhase1,
    getAmountOfAnswersPhase2,
    getAmountOfAnswersPhase3,
    getDistributionSets
};
