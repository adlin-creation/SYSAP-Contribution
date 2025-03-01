
const expect = require('chai').expect;

const ExerciseControllerModule = require("../../build/controller/exercise-controller");

const Database = require("../../build/util/database");

const { Given, When, Then, After, Before } = require('@cucumber/cucumber');

const AssociationModule =  require("../../build/model/Association");

/**
 * Initialize the database before each scenario test
 */
 Before(async () => {
    AssociationModule.createAssociations();
    await Database.initDb();
})


Given('The server application is running', function () {
    const isDatabseInitialized = Database.isDatabaseInitialized();
    expect(isDatabseInitialized).to.be.true;
    
});

When('I request to create an exercise named sit-up', async () => {

   const response = await createExercise("Sit-Up", "Sit-Up Exercise", "instructionalVideo");
   expect(response).to.have.property("statusCode", 201);
  
});

Then('The number of exercises in the database increases by {int}', async function (number) {

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

    await ExerciseControllerModule.getExercises(() => {}, res, () => {});
    expect(res.data.length).to.equal(number);
});


Then('A sit-up exercise exists in the database.', async function () {

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

    await ExerciseControllerModule.getExercises(() => {}, res, () => {});
    const exercise = res.data[0];
    expect(exercise).to.have.property("name", "Sit-Up");
});

Given('A sit-up exercise exists in the database', async function () {
    let req = {
        body: {
          name: "Sit-Up",
          description: "Sit-Up Exercise",
          instructionalVideo: "instructionalVideo",
        },
      };
      const responseData = {
        message: "",
        _id: "",
      };
      let res = {
        statusCode: 500,
        exerciseData: responseData,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.exerciseData = data;
        },
      };
      // create the first exercise
      await ExerciseControllerModule.createExercise(req, res, () => {});
  
});

/**
 * The "When" action intends to create another Sit-Up, which already exists.
 */
When('I request to create another exercise named sit-up', async function () {
    let req = {
        body: {
          name: "Sit-Up",
          description: "Sit-Up Exercise",
          instructionalVideo: "instructionalVideo",
        },
      };
      const responseData = {
        message: "",
        _id: "",
      };
      let res = {
        statusCode: 500,
        exerciseData: responseData,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.exerciseData = data;
        },
      };
  
      // create the second exercise
    const response = await ExerciseControllerModule.createExercise(req, res, () => {});
      
    //the status code should be 500, the same exercise already exist
    expect(response).to.have.property("statusCode", 500);

  });


Then('The number of exercises in the database does not change.', async function () {

  let req = {};
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

  let next = {};

    await ExerciseControllerModule.getExercises(req, res, next);
    expect(res.data.length).to.equal(1);

});

// After(function() {
//     Database.dropDatabase();
// })


//*****************************/
// HELPER FUNCTIONS           //
//*****************************/

createExercise = async (name, description, instructionalVideo) => {

  let req = {
    body: {
      name: name,
      description: description,
      instructionalVideo: instructionalVideo,
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

  const response = await ExerciseControllerModule.createExercise(
    req,
    res,
    () => {}
  );
  
  return response;
}
