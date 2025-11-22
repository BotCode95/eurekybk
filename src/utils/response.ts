import { Response } from 'express'

interface Meta {
	status: number
	message?: string
	timestamp?: string
}

interface ErrorDetail {
	code?: string
	message: string
	details?: string
}
interface ApiResponse {
	meta: Meta
	data?: any
	errors?: ErrorDetail[]
}
export function success(res: Response, status = 200, message = 'OK', data: any = null) {
	const payload: ApiResponse = {
		meta: { status, message, timestamp: new Date().toISOString() },
		data,
	}
	return res.status(status).json(payload)
}

export function fail(res: Response, status = 500, message = 'Error interno', errors: any = null) {
	const payload: ApiResponse = {
		meta: { status, timestamp: new Date().toISOString() },
		data: null,
		errors: errors
			? Array.isArray(errors)
				? errors
				: [{ message: String(errors) }]
			: [{ message: String(message) }],
	}
	return res.status(status).json(payload)
}
