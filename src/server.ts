import express, { Application } from 'express'
import cors from 'cors'

import { dbConnect, dbDisconnect } from './config/database'

import authRoutes from './modules/auth/auth.routes'
import taskRoutes from './modules/task/task.routes'
import projectRoutes from './modules/project/project.routes'

class Server {
	private app: Application
	private port: number
	private readonly pathBase = '/api'
	private readonly path = {
		auth: `${this.pathBase}/auth`,
		task: `${this.pathBase}/tasks`,
		project: `${this.pathBase}/projects`,
	}

	private corsOptions: cors.CorsOptions = {
		origin: (process.env.CORS_ORIGINS ?? 'http://localhost:5173,https://botcode95.github.io/eureky/').split(',').map(s => s.trim()),
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
		allowedHeaders: ['Content-Type','Authorization'],
		credentials: true,
	}

	constructor() {
		this.app = express()

		const isDev = (process.env.NODE_ENV ?? 'development') === 'dev'
		const envPort = process.env.PORT || (isDev ? process.env.PORT_DEVELOPMENT : undefined)
		this.port = Number(envPort ?? 3000)

		this.middlewares()
		this.routes()
	}

	private middlewares() {
		this.app.use(express.json({ limit: '1mb' }))
		this.app.use(cors(this.corsOptions))
		this.app.options('/', cors(this.corsOptions))
	}

	private routes() {
		this.app.use(this.path.auth, authRoutes)
		this.app.use(this.path.task, taskRoutes)
		this.app.use(this.path.project, projectRoutes)

		this.app.use((_req, res) => res.status(404).json({ code: 'NOT_FOUND' }))
	}

	public async listen() {
		await dbConnect()

		const server = this.app.listen(this.port, () => {
			console.log({ port: this.port }, 'Server running')
		})


		const shutdown = async (signal: string) => {
			console.log({ signal }, 'Shutdown signal received')
			server.close(async () => {
				await dbDisconnect()
				process.exit(0)
			})
			setTimeout(() => process.exit(1), 10_000).unref()
		}
		process.on('SIGINT', () => shutdown('SIGINT'))
		process.on('SIGTERM', () => shutdown('SIGTERM'))
	}

	public getApp(): Application {
		return this.app
	}
}

export const server = new Server()
