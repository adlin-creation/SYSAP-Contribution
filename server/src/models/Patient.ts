import db from '../db/db-access';

export class Patient {
    firstName: string;
    lastName: string;
    id: number;

    constructor(fName: string, lName: string, id: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.id = id;
    }

    // TODO: all CRUD methods in models are subject to change, here now for testing
    static getAllPatients(callback: (patients: Patient[]) => void): void {
        const query = 'SELECT * FROM Patient';

        db.all(query, (err: Error, rows: Patient[]) => {
            if (err) {
                console.error('Error fetching patients:', err.message);
                callback([]);
            } else {
                callback(rows);
            }
        });
    }

    static getPatientById(id: number, callback: (patient: Patient | null) => void): void {
        const query = 'SELECT * FROM Patient WHERE idPatient = ?';

        db.get(query, [id], (err: Error, row: Patient) => {
            if (err) {
                console.error('Error fetching patient:', err.message);
                callback(null);
            } else if (!row) {
                callback(null);
            } else {
                const patient = new Patient(row.firstName, row.lastName, row.id);
                callback(patient);
            }
        });
    }

    static createPatient(patient: Patient, callback: (success: boolean) => void): void {
        const query = 'INSERT INTO Patient (PatientFirstName, PatientLastName) VALUES (?, ?)';

        db.run(query, [patient.firstName, patient.lastName], function (err) {
            if (err) {
                console.error('Error creating patient:', err.message);
                callback(false);
            } else {
                callback(true);
            }
        });
    }

    static updatePatientById(id: number, patient: Patient, callback: (success: boolean) => void): void {
        const query = 'UPDATE Patient SET PatientFirstName = ?, PatientLastName = ? WHERE idPatient = ?';

        db.run(query, [patient.firstName, patient.lastName, id], function (err) {
            if (err) {
                console.error('Error updating patient:', err.message);
                callback(false);
            } else {
                callback(this.changes > 0);
            }
        });
    }

    static deletePatientById(id: number, callback: (success: boolean) => void): void {
        const query = 'DELETE FROM Patient WHERE idPatient = ?';

        db.run(query, [id], function (err) {
            if (err) {
                console.error('Error deleting patient:', err.message);
                callback(false);
            } else {
                callback(this.changes > 0);
            }
        });
    }
    // TEMPORARY 
}