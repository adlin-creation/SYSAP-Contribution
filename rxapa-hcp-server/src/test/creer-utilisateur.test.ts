import { createProfessionalUser } from "../controller/ProfessionalUserController";
import { Professional_User } from "../model/Professional_User";
import { Admin } from "../model/Admin";
import { Doctor } from "../model/Doctor";
import { Kinesiologist } from "../model/Kinesiologist";
import { sendEmail, generateCode } from "../util/unikpass";
import bcrypt from "bcrypt";

jest.mock("../model/Professional_User", () => ({
  Professional_User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../model/Admin", () => ({ Admin: { create: jest.fn() } }));
jest.mock("../model/Doctor", () => ({ Doctor: { create: jest.fn() } }));
jest.mock("../model/Kinesiologist", () => ({ Kinesiologist: { create: jest.fn() } }));
jest.mock("../util/unikpass", () => ({
  sendEmail: jest.fn(),
  generateCode: jest.fn(),
}));
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("Create Professional User", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        firstname: "John",
        lastname: "Doe",
        phoneNumber: "1234567890",
        email: "john.doe11@example.com",
        password: "test123",
        role: "",
        workEnvironment: "Hospital",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should return 409 if the user already exists", async () => {
    (Professional_User.findOne as jest.Mock).mockResolvedValue({ email: req.body.email });

    await createProfessionalUser(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "existing professional user with this email" });
  });

  it("should create a Doctor successfully", async () => {
    req.body.role = "doctor";

    (Professional_User.findOne as jest.Mock).mockResolvedValue(null);
    (generateCode as jest.Mock).mockReturnValue("ABC123");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    (Professional_User.create as jest.Mock).mockResolvedValue({ id: 1, ...req.body });

    await createProfessionalUser(req, res, jest.fn());

    expect(Professional_User.create).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      phoneNumber: "1234567890",
      email: "john.doe11@example.com",
      password: "hashedpassword",
      role: "doctor",
      active: false,
    });

    expect(Doctor.create).toHaveBeenCalledWith({
      idDoctor: 1,
      workEnvironment: "Hospital",
      unikPassHashed: "hashedpassword",
    });

    expect(sendEmail).toHaveBeenCalledWith(
      "john.doe11@example.com",
      "Votre code d'accès RXAPA",
      expect.stringContaining("ABC123")
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur créé avec succès, en attente d'activation.",
    });
  });

  it("should create a Kinesiologist successfully", async () => {
    req.body.role = "kinesiologist";

    (Professional_User.findOne as jest.Mock).mockResolvedValue(null);
    (generateCode as jest.Mock).mockReturnValue("XYZ456");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    (Professional_User.create as jest.Mock).mockResolvedValue({ id: 2, ...req.body });

    await createProfessionalUser(req, res, jest.fn());

    expect(Professional_User.create).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      phoneNumber: "1234567890",
      email: "john.doe11@example.com",
      password: "hashedpassword",
      role: "kinesiologist",
      active: false,
    });

    expect(Kinesiologist.create).toHaveBeenCalledWith({
      idKinesiologist: 2,
      workEnvironment: "Hospital",
      unikPassHashed: "hashedpassword",
    });

    expect(sendEmail).toHaveBeenCalledWith(
      "john.doe11@example.com",
      "Votre code d'accès RXAPA",
      expect.stringContaining("XYZ456")
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur créé avec succès, en attente d'activation.",
    });
  });

  it("should create an Admin successfully", async () => {
    req.body.role = "admin";

    (Professional_User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    (Professional_User.create as jest.Mock).mockResolvedValue({ id: 3, ...req.body });

    await createProfessionalUser(req, res, jest.fn());

    expect(Professional_User.create).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      phoneNumber: "1234567890",
      email: "john.doe11@example.com",
      password: "hashedpassword",
      role: "admin",
      active: false,
    });

    expect(Admin.create).toHaveBeenCalledWith({
      idAdmin: 3,
    });

    expect(sendEmail).not.toHaveBeenCalled(); // Admin ne reçoit pas d'email

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur créé avec succès, en attente d'activation.",
    });
  });

  it("should return 500 if an error occurs", async () => {
    req.body.role = "doctor";

    (Professional_User.findOne as jest.Mock).mockResolvedValue(null);
    (generateCode as jest.Mock).mockReturnValue("ABC123");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    (Professional_User.create as jest.Mock).mockRejectedValue(new Error("Database error"));

    await createProfessionalUser(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error creating professional user" });
  });
});
