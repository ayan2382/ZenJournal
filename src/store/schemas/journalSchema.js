import {z} from 'zod';


export const journalSchema = z.object({
  text: z.string().min(1, "Journal entry cannot be empty").max(5000, "Journal entry is too long"),
  mood: z.enum(["Depressed", "Sad", "Neutral", "Good", "Great!"], "Invalid mood selection"),
  tags: z.string().optional(), // Accept string input from form
});