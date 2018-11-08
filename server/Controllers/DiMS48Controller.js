let DiMS48Models;
let defaultModels;

const scoreCalculator = require('../util/scoreCalculator');
const excelGenerator = require('../util/excelGenerator');
const imageSeeder = require('../seeders/imagesSeeder');

function makeGetter(model, whereClause){
  return new Promise(function(s,f){
    let query = model.find(whereClause).lean();

    query.exec(function(err,data){
      if(err)f(err);
      s(data);
    })
  })
}

function getTests(){
  return makeGetter(defaultModels.Test, null);
}

function getImages(){
  return makeGetter(defaultModels.Image, null);
}

function getInstructions(part){
  let whereClause = part === 'begin' ? {$or:[{_id: "phase1"},{_id: "interference"},{_id: "phase2"}]} : {_id: "phase3"};
  return makeGetter(DiMS48Models.Instruction, whereClause);
}

function getOptions(part){
  let whereClause = part === 'begin' ? {$or:[{_id: "phase1Options"},{_id: "phase2Options"}]} : {_id: "phase2Options"};
  return makeGetter(DiMS48Models.Option, whereClause);
}

function getResults(){
  return new Promise(function(s,f){
    makeGetter(DiMS48Models.Result, null).then(results=>{
      results.forEach(result=>{
        if(result.answersPhase3.answers.length <= 0) result.answersPhase3.scores = null;
      });
      s(results);
    }).catch(err=>f(err))
  })
}

function getResult(id){
  return makeGetter(DiMS48Models.Result, {_id: id}).then(data=>{
    excelGenerator.makeExcel(data[0]); return data[0];
  });
}

function getUnfinishedTests(){
  return makeGetter(DiMS48Models.Result, { $where: "this.answersPhase3.answers.length <= 0"})
}

function addResult(data){
  return new Promise((resolve, reject) => {
      addCorrectAnswersPhase1(data.answersPhase1);
    data['answersPhase1'] = {
      score: scoreCalculator.calculateScorePhase1(data.answersPhase1),
      answers: addCorrectAnswersPhase1(data.answersPhase1)
    };
    data['answersPhase2'] = {
      scores: scoreCalculator.calculateScorePhase2(data.answersPhase2),
      answers: addCorrectAnswersPhase2(data.answersPhase2)
    };
    data['answersPhase3'] = {
      scores: {
        abstractScore: 0,
        groupedScore: 0,
        uniqueScore: 0
      },
      answers: []
    };

    const newResult = new DiMS48Models.Result(data);
    newResult.save((err, data) => {
      if(err){
        reject(err);
      }else{
        resolve(data);
      }
    });
  })
}

function appendResult(data){
    return new Promise((resolve, reject) => {
      data.answersPhase3 = {
        scores: scoreCalculator.calculateScorePhase2(data.answersPhase3),
        answers: addCorrectAnswersPhase3(data.answersPhase3)
      };

      DiMS48Models.Result.findByIdAndUpdate(data._id, {answersPhase3: data.answersPhase3}, (err, data) => {
           if(err){
               reject(err);
           }else{
               resolve();
           }
        })
    })
}

//TODO refactor!!!
const addCorrectAnswersPhase1 = function addCorrectAnswersPhase1(clientAnswers){
    clientAnswers.forEach((answerAndId) => {
        const answerIdIndex = parseInt(answerAndId._id.substring(1));
        const correct = imageSeeder.getAmountOfColours(answerIdIndex);
        answerAndId.correctAnswer = correct;
    });

    return clientAnswers;
};

const addCorrectAnswersPhase2 = function addCorrectAnswersPhase2(clientAnswers){
    clientAnswers.forEach((answerAndId) => {
        const answerIdIndex = parseInt(answerAndId._id.substring(1));
        const correct = `A${answerIdIndex}`;
        answerAndId.correctAnswer = correct;
    });

    return clientAnswers;
};

const addCorrectAnswersPhase3 = function addCorrectAnswersPhase3(clientAnswers){
    return addCorrectAnswersPhase2(clientAnswers);
};

module.exports = (injectedDiMS48Models, injectedDefaultModels) => {
    DiMS48Models = injectedDiMS48Models;
    defaultModels = injectedDefaultModels;

    return {
        getTests,
        getImages,
        getInstructions,
        getOptions,
        getResults,
        getUnfinishedTests,
        getResult,
        addResult,
        appendResult,
    }
};
