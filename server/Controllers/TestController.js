let defaultModels = require('../models/defaultModels');

function makeGetter(whereClause, fields){
  return new Promise((s,f)=>{
    let query = Test.find(whereClause, fields);
    query.exec(function(err,data){
      if(err)f(err);
      s(data);
    })
  })
}

let Test = defaultModels.Test;
function getTestCategories(){
  return makeGetter({}, {title:1});
}

function getTestConfig(testTitle){
  return makeGetter({title: testTitle}, {config: 1, _id:0});
}

function getDetails(testTitle){
  return new Promise((resolve, reject) => {
    makeGetter({title: testTitle}, {__v:0, config:0, _id:0})
    .then((results) => {
      if(results.length <= 0){
        reject({
          name: 'notFound'
        });
      }else{
        resolve(results);
      }
    })
    .catch((err) => {
      reject(err);
    });
  })
}

function updateConfig(testTitle, newConfig){
  return new Promise((s,f)=>{
    console.log(newConfig);
    s({msg: "not implemented yet"});
    // TODO: update test config using title
  })
}

module.exports = {
  getTestCategories,
  getTestConfig,
  getDetails,
  updateConfig
};
