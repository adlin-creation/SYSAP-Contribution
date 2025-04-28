import { expect } from "chai";
import { sequelize } from "../util/database";
import { Session } from "../model/Session";
import { SessionHistory } from "../model/SessionHistory";
import { v4 as uuidv4 } from "uuid";

describe("SessionHistory Tests", () => {
    let testSessionKey: string;

    before(async () => {
        try {
            // Force sync all models
            await sequelize.sync({ force: true });
            
            // Create a test session
            testSessionKey = uuidv4();
            await Session.create({
                key: testSessionKey,
                name: "Test Session",
                description: "Initial description",
                constraints: "Initial constraints"
            });
        } catch (error) {
            console.error("Setup failed:", error);
            throw error;
        }
    });

    after(async () => {
        try {
            // Clean up
            await sequelize.close();
        } catch (error) {
            console.error("Cleanup failed:", error);
        }
    });

    it("should create a session history entry", async () => {
        try {
            const session = await Session.findOne({ where: { key: testSessionKey } });
            if (!session) {
                throw new Error("Test session not found");
            }

            const historyEntry = await SessionHistory.create({
                sessionKey: session.key,
                date: new Date(),
                previousName: "Old Name",
                previousDescription: "Old Description",
                previousConstraints: "Old Constraints",
                previousDay: "Monday"
            });

            expect(historyEntry).to.not.be.null;
            expect(historyEntry.sessionKey).to.equal(session.key);
            expect(historyEntry.previousName).to.equal("Old Name");
        } catch (error) {
            console.error("Test failed:", error);
            throw error;
        }
    });

    it("should retrieve session history entries", async () => {
        try {
            const historyEntries = await SessionHistory.findAll({
                where: { sessionKey: testSessionKey }
            });

            expect(historyEntries).to.be.an("array");
            expect(historyEntries.length).to.be.greaterThan(0);
        } catch (error) {
            console.error("Test failed:", error);
            throw error;
        }
    });
}); 