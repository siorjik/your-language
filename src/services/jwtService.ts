import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const encodeKey = new TextEncoder().encode(process.env.JWT_SECRET)
const alg = 'HS256'

export const createToken = async (data: { [k: string]: string }, expiration: number = 1): Promise<string> => {
  const token = new SignJWT(data).setProtectedHeader({ alg }).setExpirationTime(`${expiration}m`).sign(encodeKey)

  return token
}

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  try {
    const { payload } = await jwtVerify(token, encodeKey, { algorithms: [alg] })

    return payload
  } catch (error) {
    const err = { ...(error as object) } as Error

    if (err.name === 'JWTExpired') throw Error('Your link was expired!')

    throw error
  }
}
