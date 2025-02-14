/*import { Request, Response } from 'express';
import { ProgramEnrollement } from '../models/ProgramEnrollement';

// ...existing code...

export const getAllProgramEnrollements = async (req: Request, res: Response) => {
    try {
        const enrollements = await ProgramEnrollement.findAll();
        res.status(200).json(enrollements);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching program enrollments.' });
    }
};

// ...existing code...*/
