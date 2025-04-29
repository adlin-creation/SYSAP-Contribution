
import { createProfessionalUser } from "../controller/ProfessionalUserController";
import { Professional_User } from "../model/Professional_User";
import { Admin } from "../model/Admin";
import { Doctor } from "../model/Doctor";
import { Kinesiologist } from "../model/Kinesiologist";
import { hash } from "../controller/UserController"; // Import de la fonction hash
import { generateCode, sendEmail } from "../util/unikpass";
import { expect, jest } from "@jest/globals";

jest.mock("../model/Professional_User");
jest.mock("../model/Admin");
jest.mock("../model/Doctor");
jest.mock("../model/Kinesiologist");
jest.mock("../controller/UserController");
jest.mock("../util/unikpass");

describe("createProfessionalUser", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        password: "password123",
        role: "doctor",
        workEnvironment: "Clinic",
      },
    };
    res = {
      statusCode: 500,
      json: jest.fn(),
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
    };
    next = jest.fn();
  });

  it("should call hash function to hash the password", async () => {
    (hash as jest.MockedFunction<typeof hash>).mockResolvedValue(
      "hashedPassword"
    );

    await createProfessionalUser(req, res, next);

    expect(hash).toHaveBeenCalledTimes(2);
  });

  it("should create a professional user successfully", async () => {
    (hash as jest.MockedFunction<typeof hash>).mockResolvedValue(
      "hashedPassword"
    );

    (
      Professional_User.create as jest.MockedFunction<
        typeof Professional_User.create
      >
    ).mockResolvedValue({
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      password: "hashedPassword",
      role: "doctor",
    });

    await createProfessionalUser(req, res, next);

    expect(Professional_User.create).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      password: "hashedPassword",
      role: "doctor",
    });
    expect(res.statusCode).toBe(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        role: "doctor",
      })
    );
  });

  it("should create an admin user successfully", async () => {
    // Changement du rôle pour admin
    req.body.role = "admin";

    // Mock de la fonction hash
    (hash as jest.MockedFunction<typeof hash>).mockResolvedValue(
      "hashedPassword"
    );

    // Mock de la méthode create de Professional_User
    (
      Professional_User.create as jest.MockedFunction<
        typeof Professional_User.create
      >
    ).mockResolvedValue({
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      password: "hashedPassword",
      role: "admin",
    });

    // Mock de la méthode create de Admin
    (
      Admin.create as jest.MockedFunction<typeof Admin.create>
    ).mockResolvedValue({
      idAdmin: 1,
    });

    // Appel de la fonction à tester
    await createProfessionalUser(req, res, next);

    // Vérifications
    expect(Professional_User.create).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      password: "hashedPassword",
      role: "admin",
    });
    expect(Admin.create).toHaveBeenCalledWith({ idAdmin: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        role: "admin",
      })
    );
  });

  it("should create a kinesiologist user successfully", async () => {
    // Changement du rôle pour kinésiologue
    req.body.role = "kinesiologist";

    // Mock de la fonction hash
    (hash as jest.MockedFunction<typeof hash>).mockResolvedValue(
      "hashedPassword"
    );

    // Mock de la méthode create de Professional_User
    (
      Professional_User.create as jest.MockedFunction<
        typeof Professional_User.create
      >
    ).mockResolvedValue({
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      password: "hashedPassword",
      role: "kinesiologist",
    });

    // Mock de la méthode create de Kinesiologist
    (
      Kinesiologist.create as jest.MockedFunction<typeof Doctor.create>
    ).mockResolvedValue({
      idKinesiologist: 1,
      workEnvironment: "Clinic",
    });

    // Appel de la fonction à tester
    await createProfessionalUser(req, res, next);

    // Vérifications
    expect(Professional_User.create).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      password: "hashedPassword",
      role: "kinesiologist",
    });
    expect(Kinesiologist.create).toHaveBeenCalledWith({
      idKinesiologist: 1,
      workEnvironment: "Clinic",
      unikPassHashed: "hashedPassword",
    });
    expect(res.statusCode).toBe(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        role: "kinesiologist",
      })
    );
  });

  //Teste l'erreur lors de la création d'un admin
  it("should handle error when creating admin role", async () => {
    // Changement du rôle pour admin
    req.body.role = "admin";

    // Mock de la fonction hash
    (hash as jest.MockedFunction<typeof hash>).mockResolvedValue(
      "hashedPassword"
    );

    // Mock de la méthode create de Professional_User
    (
      Professional_User.create as jest.MockedFunction<
        typeof Professional_User.create
      >
    ).mockResolvedValue({
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      password: "hashedPassword",
      role: "admin",
    });

    // Mock de la méthode create de Admin pour simuler une erreur
    (
      Admin.create as jest.MockedFunction<typeof Admin.create>
    ).mockRejectedValue(new Error("Admin creation failed"));

    // Appel de la fonction à tester
    await createProfessionalUser(req, res, next);

    // Vérifications
    expect(Professional_User.create).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      password: "hashedPassword",
      role: "admin",
    });
    expect(Admin.create).toHaveBeenCalledWith({ idAdmin: 1 });
    expect(next).toHaveBeenCalledWith(new Error("Admin creation failed"));
    expect(res.statusCode).toBe(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Admin creation failed" });
  });

  it("should return 409 if the email is already in use", async () => {
    // Mock de la fonction findOne pour qu'elle retourne un utilisateur existant
    (
      Professional_User.findOne as jest.MockedFunction<
        typeof Professional_User.findOne
      >
    ).mockResolvedValue({
      id: 1,
      firstname: "john",
      lastname: "doe",
      email: "john.doe@example.com",
      phoneNumber: "9876543210",
      password: "hashedPassword",
      role: "doctor",
    });

    // Appel de la fonction à tester
    await createProfessionalUser(req, res, next);

    // Vérifications
    expect(Professional_User.findOne).toHaveBeenCalledWith({
      where: { email: "john.doe@example.com" },
    });
    expect(res.statusCode).toBe(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_user_exists",
    });
  });

  it("should send email to doctor or kinesiologist with their unique code", async () => {
    // Mock the code generation and email sending
    (generateCode as jest.MockedFunction<typeof generateCode>).mockReturnValue(
      "123456"
    );
    (sendEmail as jest.MockedFunction<typeof sendEmail>).mockResolvedValue();

    await createProfessionalUser(req, res, next);

    expect(generateCode).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
  });
});
