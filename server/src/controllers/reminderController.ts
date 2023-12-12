import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Reminder from '../models/Reminder';
import * as dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env'});

export default class ReminderController {
  static setReminder = async (req: Request, res: Response) => {

    try {

      const {NextReminder, Frequency, UserId} = req.body;

      // Si y'a deja un reminder, on l'update
      const existingReminder = await Reminder.findOne({ where: {UserId}});

      if (existingReminder != null) {
        // const nextReminderDate = calculateNextReminder(existingReminder.NextReminder,
        //   existingReminder.Frequency);


        await existingReminder.update(
          {
            NextReminder: NextReminder,
          },
          {
            where: { UserId: UserId },
          }
        );

        res.status(200).json({ msg: "Reminder updated" })

      } else {
        const newReminder = createReminder(NextReminder, Frequency, UserId);
        res.status(200).json({ msg: "Reminder saved" })
      }


    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  static getReminder = async (req: Request, res: Response) =>{
    res.status(200).send("allo");
    console.log(res)
  }

}

async function createReminder(nextReminder: Date, frequency: number, userId: number) : Promise<Reminder> {
  return Reminder.create({
    NextReminder: nextReminder,
    Frequency: frequency,
    UserId : userId 
  });
}

function calculateNextReminder(currentReminder: Date, frequency: number) : Date {
  const nextReminder = new Date(currentReminder);
  nextReminder.setDate(nextReminder.getDate() + 1);
  console.log("nextReminder: " + nextReminder);
  return nextReminder;
}