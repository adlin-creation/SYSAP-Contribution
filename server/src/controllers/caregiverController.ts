import { Request, Response } from 'express';
import Caregiver from '../models/Caregiver';
import Patient from '../models/Patient';

export default class CaregiverController{
    static getPatientsForCaregiver = async (req: Request, res: Response): Promise<void> => {
        console.log('helllllllo')
        const caregiverId: string = req.params.caregiverId; // Assuming caregiverId is a parameter in the route
        console.log("hello");
        try {
            const caregiver = await Caregiver.findByPk(caregiverId, {
                include: [{ model: Patient, through: { attributes: [] }, as: 'Patients' }],
            });
        
            if (!caregiver) {
                res.status(404).json({ error: 'Caregiver not found' });
                return;
            }
        
            const patients = caregiver.get('Patients') as Patient[];
            console.log(patients);
        
            res.status(200).json({ patients });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}