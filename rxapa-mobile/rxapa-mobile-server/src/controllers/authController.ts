//objective: to authenticate the user by checking the code in the database and return the user's information
// objective: authentifier l'utilisateur en vérifiant le code dans la base de données et renvoyer les informations de l'utilisateur
import { Request, Response } from 'express';
import { dbClient } from '../database';

export const authenticate = async (req: Request, res: Response) => {
    const { programEnrollementCode: code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: 'error_required_code' });
    }

    try {
        console.log('Executing SQL query on Program_Enrollements table...');

        const query = `
            SELECT pe.id as "programEnrollementId", p.firstname, p.lastname, pr.name as programName, pe."startDate", pr.duration
            FROM public."ProgramEnrollements" pe
            JOIN public."Patients" p ON pe."PatientId" = p.id
            JOIN public."Programs" pr ON pe."ProgramId" = pr.id
            WHERE pe."programEnrollementCode" = $1
        `;
        const values = [code];

        const result = await dbClient.query(query, values);

        console.log('Query result:', result.rows);

        if (result.rows.length > 0) {
            const { programEnrollementId, firstname, lastname, programName, startDate, duration } = result.rows[0];
            const currentDate = new Date();
            const start = new Date(startDate);
            const currentDay = Math.ceil((currentDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            return res.json({
                success: true,
                message: 'success_authentication',
                token: 'some-token',
                userType: 'user',
                data: {
                    programEnrollementId, // Utilisation correcte de l'ID récupéré
                    fullName: `Bonjour ${firstname} ${lastname}`,
                    programName: `Bienvenue dans le programme ${programName}`,
                    currentDay: `Jour ${currentDay} de ${duration}`
                }
            });
        } else {
            return res.status(401).json({ success: false, message: 'error_invalid_code' });
        }
    } catch (err) {
        console.error('Erreur pendant l\'authentification:', err);
        return res.status(500).json({ success: false, message: 'error_internal_server_error' });
    }
};
