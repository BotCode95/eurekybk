export const TokenErrors = {
	INVALID_TOKEN: {
		code: 'INVALID_TOKEN',
		message: 'El token proporcionado no es válido.',
	},
	TOKEN_EXPIRED: {
		code: 'TOKEN_EXPIRED',
		message: 'El token ha expirado.',
	},
	MISSING_TOKEN: {
		code: 'MISSING_TOKEN',
		message: 'No se proporcionó ningún token.',
	},
	MISSING_SECRET: {
		code: 'MISSING_SECRET',
		message: 'No se ha configurado la clave secreta del token.',
	},
	INVALID_PAYLOAD_TOKEN: {
		code: 'INVALID_PAYLOAD_TOKEN',
		message: 'El payload del token es inválido o está incompleto.',
	},
	USER_NOT_FOUND: {
		code: 'USER_NOT_FOUND',
		message: 'Usuario no encontrado.',
	},
	USER_DISABLED: {
		code: 'USER_DISABLED',
		message: 'Usuario deshabilitado',
	},
}
