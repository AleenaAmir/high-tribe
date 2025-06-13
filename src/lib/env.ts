import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env; 