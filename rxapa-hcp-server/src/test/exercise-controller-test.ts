import { initDatabase } from "../util/database";

const exerciseController = require("../controller/exercise-controller");

// Imports chai to handle result comparison
const { expect } = require("chai");

import { Exercise } from "../model/Exercise";

describe("Exercise Controller", function () {
  before(function (done) {
    initDatabase().then(() => {
      done();
    });
  });

  it("should create an exercise", async () => {
    let req = {
      body: {
        name: "Sit-Up",
        description: "Sit-Up Exercise",
        instructionalVideo: "instructionalVideo",
      },
    };
    let res = {
      statusCode: 500,
      exerciseData: {} as any,
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
      json: function (data: any) {
        this.exerciseData = data;
      },
    };

    const response = await exerciseController.createExercise(
      req,
      res,
      () => {}
    );
    expect(response).to.have.property("statusCode", 201);

    const exercises = await Exercise.findAll();
    expect(exercises.length).to.equal(1);

    const exercise = exercises[0];
    expect(exercise).to.have.property("name", "Sit-Up");
  });

  it("should not create an exercise, because the exercise name exists", async () => {
    let req = {
      body: {
        name: "Sit-Up",
        description: "Sit-Up Exercise",
        instructionalVideo: "instructionalVideo",
      },
    };
    let res = {
      statusCode: 500,
      exerciseData: {} as any,
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
      json: function (data: any) {
        this.exerciseData = data;
      },
    };

    // create the first exercise
    await exerciseController.createExercise(req, res, () => {});

    // create second exercise with the same parameter values
    const response = await exerciseController.createExercise(
      req,
      res,
      () => {}
    );
    expect(response).to.have.property("statusCode", 500);

    const exercises = await Exercise.findAll();
    expect(exercises.length).to.equal(1);

    const exercise = exercises[0];
    expect(exercise).to.have.property("name", "Sit-Up");
  });

  it("should create an exercise, because the exercise name doesn't exist", async () => {
    let req = {
      body: {
        name: "Sit-Up",
        description: "Sit-Up Exercise",
        instructionalVideo: "instructionalVideo",
      },
    };
    let res = {
      statusCode: 500,
      exerciseData: {} as any,
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
      json: function (data: any) {
        this.exerciseData = data;
      },
    };

    // create the first exercise
    await exerciseController.createExercise(req, res, () => {});

    // create second exercise with the same parameter values
    req.body.name = "Sit-Up2";
    const response = await exerciseController.createExercise(
      req,
      res,
      () => {}
    );
    expect(response).to.have.property("statusCode", 201);

    const exercises = await Exercise.findAll();
    expect(exercises.length).to.equal(2);

    const exercise = exercises[1];
    expect(exercise).to.have.property("name", "Sit-Up2");

    const exercise2 = await Exercise.findOne({ where: { name: "Sit-Up2" } });
    expect(exercise2).to.not.be.null;
  });
});
