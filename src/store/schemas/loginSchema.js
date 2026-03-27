import {z} from 'zod';

export const loginSchema = z.object({
  email: z.string().min(5, "Put an email in here").email("Invalid email address!"),
  password: z.string().min(4, "Password must be at least 4 characters long").max(100, "Whoa... that's a long password!"),
});

export const registrationSchema = z.object({
name: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name is too long"),
  email: z.string().min(5, "Put an email in here").email("Invalid email address!"),
  password: z.string().min(8, "Password must be at least 8 characters long").max(100, "Whoa... that's a long password!"),
});