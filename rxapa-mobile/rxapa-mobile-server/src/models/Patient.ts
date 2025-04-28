/**
 * Represents a patient participating in a fitness program.
 */
export class Patient {
    firstName: string; // First name of the patient
    lastName: string; // Last name of the patient
    patientId: number; // Unique identifier for the patient

    /**
     * @param fName - First name of the patient
     * @param lName - Last name of the patient
     * @param id - Unique identifier for the patient
     */
    constructor(fName: string, lName: string, id: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.patientId = id;
    }
}
