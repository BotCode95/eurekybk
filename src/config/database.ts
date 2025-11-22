import mongoose from 'mongoose'
import { ENV } from './env'

let isConnected = false

export async function dbConnect() {
	if (isConnected) return

	mongoose.set('strictQuery', true)

	try {
		await mongoose.connect(ENV.MONGODB_URI, {
			dbName: ENV.MONGODB_DB_NAME,
		})
		isConnected = true
		console.log('Base de datos conectada correctamente')
	} catch (err) {
		console.error({ err }, 'Error al conectar a MongoDB:')
		process.exit(1)
	}

	mongoose.connection.on('connected', () => {
		console.log('[db] connected')
	})
	mongoose.connection.on('reconnected', () => {
		console.log('[db] reconnected')
	})
	mongoose.connection.on('disconnected', () => {
		isConnected = false
		console.log('[db] disconnected')
	})
	mongoose.connection.on('error', e => {
		console.error('[db] error', e)
	})
}

export async function dbDisconnect() {
	if (!isConnected) return
	await mongoose.disconnect()
	isConnected = false
	console.log('[db] Desconectado de MongoDB')
}
