import { Request, Response } from 'express';

import Patient from '../models/Patient';

import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const SYSAP_MAIL = 'sysap7931@gmail.com';
const PROF_SANTE_MAIL = 'profsante84@gmail.com';

async function send(req: Request, res: Response) {
    // get req info
    let subject: String = req.body.subject;
    let message: String = req.body.message;
    let senderId: Number = Number(req.body.senderId);
    // get patient info
    let patient = await new Patient().getPatientById(senderId);

    if (patient.error) {
        return res.status(404).json(patient);
    }


    // send the mail
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SYSAP_MAIL,
            pass: 'dojc kddj hilg ysan'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailDetails = {
        from: SYSAP_MAIL,
        to: PROF_SANTE_MAIL,
        subject: `from ${patient.firstName} ${patient.lastName} : ${subject}`,
        text: `${message}`
    };

    mailTransporter.sendMail(mailDetails, (err : Error | null, data : SMTPTransport.SentMessageInfo) => {
        if (err) {
            console.log('Error Occurs while sending email', err);
            return res.status(500).json({error : 'une erreur est survenue lors la transmission du courriel veuillez contacter votre administrateur si le problème persiste'});
        } else {
            console.log('Email sent successfully');
            return res.json({msg : 'votre courriel a été transmis avec succès!'});
        }
    });

}

export default { send };