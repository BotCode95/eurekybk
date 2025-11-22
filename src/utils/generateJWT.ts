import jwt from 'jsonwebtoken'

interface GenerateTokenData {
	uid?: string
	data?: Data
}
interface Data {
	role: string
}


export const generateJWT = ({ uid = '', data }: GenerateTokenData) => {
	const { role = ''} = data || {}

	return new Promise((resolve, reject) => {
		const payload = { uid, role }
		const secret: string = process.env.SECRETORPRIVATEKEY ?? ''
		jwt.sign(
			payload,
			secret,
			{
				expiresIn: '3d',
			},
			(err, token) => {
				if (err) {
					console.log(err)
					reject('Could not generate token')
				} else {
					resolve(token)
				}
			}
		)
	})
}

