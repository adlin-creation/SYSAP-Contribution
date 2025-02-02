const expect = require('chai').expect;

const sinon = require('sinon');

const ExerciseControllerModule = require("../../build/controller/exercise-controller");

const DaySessionControllerModule = require("../../build/controller/exercise-day-session");

const { Given, When, Then, After, Before } = require('@cucumber/cucumber');
const { ExerciseDaySession } = require('../../build/model/ExerciseDaySession');



Given('The following exercises exist:', async function (dataTable) {
    // Extract the given values from the scenario definition
    // to create the assumed existing exercises
    let name = dataTable.rawTable[1][0];
    let description = dataTable.rawTable[1][1];
    let instruction_video = dataTable.rawTable[1][2];

    let response = await createExercise(name, description, instruction_video);

    expect(response).to.have.property("statusCode", 201);

    // Second Exercise
    name = dataTable.rawTable[2][0];
    description = dataTable.rawTable[2][1];
    instruction_video = dataTable.rawTable[2][2];

    response = await createExercise(name, description, instruction_video);

    expect(response).to.have.property("statusCode", 201);
  });

  Given('The following day sessions exist:', async function (dataTable) {
    // Extract the given values from the scenario definition
    // to create the assumed existing day session
    let name = dataTable.rawTable[1][0];
    let description = dataTable.rawTable[1][1];
    let constraints = dataTable.rawTable[1][2];

    let response = await createDaySession(name, description, constraints);

    expect(response).to.have.property("statusCode", 201);
  });

  Given('The following components exist:', function (dataTable) {

    let daySessionName = dataTable.rawTable[1][0];
    let exerciseName = dataTable.rawTable[1][1];
    let rank = dataTable.rawTable[1][2];
    // let required = dataTable.rawTable[1][3];
    let required = true;
    let numberOfSeries = dataTable.rawTable[1][4];

    const response = addExercise(exerciseName, daySessionName, rank, required, numberOfSeries);

    expect(response).to.have.property("statusCode", 201)
  });


  When('I request to add an exercise \\(name: {string}) to a day session \\(name: {string}).', async function (exerciseName, daySessionName) {
    // Write code here that turns the phrase above into concrete actions

    // const exercise = await ExerciseControllerModule.getExercise(exerciseName);
    // expect(exercise.name).to.be.equal(exerciseName);

    // sinon.stub(ExerciseDaySession, 'findOne');
    // ExerciseDaySession.findOne.returns({

    // })
    // const daySession = await DaySessionControllerModule.getExerciseDaySession(daySessionName);
    // expect(daySession.name).to.be.equal(daySessionName);

    const response = addExercise(exerciseName, daySessionName, 2, true, 2);

    expect(response).to.have.property("statusCode", 201)

  });

  Then('The number of components in the database increases by {int}.', function (int) {
    // Then('The number of components in the database increases by {float}.', function (float) {
      // Write code here that turns the phrase above into concrete actions
      return 'pending';
});

Then('The new component refers to exercise \\({string}) is {string}.', function (name, result) {
    let r;
    if (result.equalsIgnoreCase("true") || result.equalsIgnoreCase("false")) {
        r = Boolean.valueOf(string);
    } else {
        // throw some exception
    }
    return 'pending';
  });

  Then('The new component refers to day session \\({string}) is {string}.', function (string, string2) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });



//*****************************/
// HELPER FUNCTIONS           //
//*****************************/

addExercise = async (exerciseName, daySessionName, rank, required, numberOfSeries) => {

    let req = {
      body: {
        exerciseName: exerciseName,
        daySessionName: daySessionName,
        rank: rank,
        required: required,
        numberOfSeries: numberOfSeries
      },
    };
    
    let res = {
      statusCode: 500,
      exerciseData: {},
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.exerciseData = data;
      },
    };
  
    const response = await DaySessionControllerModule.addExercise(
      req,
      res,
      () => {}
    );
    
    return response;
  }