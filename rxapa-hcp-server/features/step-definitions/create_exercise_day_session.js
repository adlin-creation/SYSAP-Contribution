const expect = require('chai').expect;

const DaySessionControllerModule = require("../../build/controller/exercise-day-session");

const { Given, When, Then } = require('@cucumber/cucumber');



//*********************************************************/
// Creates a valid exercise day session step definitions
//*********************************************************/

When('I request to create an exercise day session \\(name: {string}, description: {string}, and constraints: {string}).', async function (name, description, constraints) {
    const response = await createDaySession(name, description, constraints);
    expect(response).to.have.property("statusCode", 201);
   
});

Then('The number of exercise day sessions in the database increases by {int}.', async function (number) {

  
  let res = {
    statusCode: 500,
    data: {},
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.data = data;
    },
  };

    await DaySessionControllerModule.getExerciseDaySessions(() => {}, res, () => {});
    
    expect(res.data.length).to.equal(number);
    });

//*******************************************************************/
// Creates an exercise day seesion with invalid name step definitions
//*******************************************************************/

createDaySession = async (name, description, constraints) => {

  let req = {
    body: {
      name: name,
      description: description,
      constraints: constraints,
    },
  };
  
  let res = {
    statusCode: 500,
    data: {},
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.data = data;
    },
  };

  const response = await DaySessionControllerModule.createExerciseDaySession(
    req,
    res,
    () => {}
  );
  
  return response;
}

