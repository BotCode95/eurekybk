import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
	PORT: z.string().default('3000').transform(Number),
	MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
	MONGODB_DB_NAME: z.string().optional(),
	CORS_ORIGINS: z.string().optional(),
	SECRETORPRIVATEKEY: z.string().optional(),
	JWT_SECRET: z.string().optional(),
	JWT_EXPIRES_IN: z.string().default('24h'),
})

export const ENV = envSchema.parse(process.env)

export type Environment = z.infer<typeof envSchema>