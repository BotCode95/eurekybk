import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User  from '../modules/user/User'
import { TokenErrors } from '../utils/tokenErrors'
import { ErrorType } from '../utils/errorType'
import { fail } from '../utils/response'

type Claims = JwtPayload & {
	uid?: string | null
	role?: string
}

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.header('authorization') || req.header('Authorization')
	const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
	const token = bearerToken

	if (!token) {
		return fail(res, 401, ErrorType.UNAUTHORIZED, [
			{ code: TokenErrors.MISSING_TOKEN.code, message: TokenErrors.MISSING_TOKEN.message },
		])
	}

	try {
		const secret: string = process.env.SECRETORPRIVATEKEY ?? ''
		if (!secret) {
			return fail(res, 500, ErrorType.INTERNAL_SERVER_ERROR, [
				{ code: TokenErrors.MISSING_SECRET.code, message: TokenErrors.MISSING_SECRET.message },
			])
		}

		const payload = jwt.verify(token, secret) as Claims
		const uid = payload.uid || payload.userId

		if (!uid) {
			return fail(res, 401, ErrorType.UNAUTHORIZED, [
				{
					code: TokenErrors.INVALID_PAYLOAD_TOKEN.code,
					message: TokenErrors.INVALID_PAYLOAD_TOKEN.message,
				},
			])
		}

		const user = await User.findById(uid).lean()
		if (!user) {
			return fail(res, 401, ErrorType.UNAUTHORIZED, [
				{ code: TokenErrors.USER_NOT_FOUND.code, message: TokenErrors.USER_NOT_FOUND.message },
			])
		}
        
		;(req as any).user = user
		;(req as any).auth = payload
		;(req as any).userId = String(uid)
		;(req as any).role =payload.role

		return next()
	} catch (error: any) {
		return res.status(401).json({ msg: 'Token is not valid' })
	}
}
