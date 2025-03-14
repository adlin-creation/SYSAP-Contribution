import { initDatabase } from "../util/database";
const sessionController = require("../controller/SessionController");
import { expect } from "chai";
import { Session } from "../model/Session";
import { Transaction } from "sequelize";

describe("Tests du Contrôleur de Session", function () {
    let transaction: Transaction; 

    beforeEach(async () => {
        transaction = await Session.sequelize.transaction();
    });

    afterEach(async () => {
        await transaction.rollback();
    });

    /**
     * TEST 1 : Création d'une session réussie
     */
    it("devrait créer une session avec succès", async () => {
        let req = {
            body: {
                name: "Séance du matin",
                description: "Séance de kinésithérapie matinale.",
                constraints: "Pas de levée de poids lourds",
            },
        };
        let res: any = {
            statusCode: 500,
            body: null,
            json(data: any) {
                this.body = data;
            },
            status(code: number) {
                this.statusCode = code;
                return this;
            },
        };

        await sessionController.createSession(req, res, () => {});

        expect(res.statusCode).to.equal(201);

        const session = await Session.findOne({ where: { name: "Séance du matin" } });
        expect(session).to.not.be.null;
        expect(session?.description).to.equal("Séance de kinésithérapie matinale.");
    });

    /**
     * TEST 2 : Modification d'une session existante
     */
    it("devrait modifier une session existante", async () => {
        const session = await Session.create({
            name: "Séance initiale",
            description: "Description originale",
            constraints: "Aucune",
        });

        let req = {
            params: { sessionKey: session.key },
            body: { name: "Séance modifiée", description: "Nouvelle description" },
        };
        let res: any = {
            statusCode: 500,
            body: null,
            json(data: any) {
                this.body = data;
            },
            status(code: number) {
                this.statusCode = code;
                return this;
            },
        };

        await sessionController.updateSession(req, res, () => {});

        expect(res.statusCode).to.equal(200);

        const updatedSession = await Session.findOne({ where: { key: session.key } });
        expect(updatedSession).to.not.be.null;
        expect(updatedSession?.name).to.equal("Séance modifiée");
        expect(updatedSession?.description).to.equal("Nouvelle description");
    });

    /**
     * TEST 3 : Ne devrait pas modifier une session inexistante
     */
    it("ne devrait pas modifier une session inexistante", async () => {
        let req = {
            params: { sessionKey: "clé-inexistante" },
            body: { name: "Nouvelle séance", description: "Description mise à jour" },
        };
        let res: any = {
            statusCode: 500,
            body: null,
            json(data: any) {
                this.body = data;
            },
            status(code: number) {
                this.statusCode = code;
                return this;
            },
        };

        await sessionController.updateSession(req, res, () => {});

        expect(res.statusCode).to.equal(500); 
    });
});
