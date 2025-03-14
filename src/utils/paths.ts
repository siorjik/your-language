/***** app *****/
export const signInAppPath = '/sign-in'
export const signUpAppPath = '/sign-up'
export const createPasswordAppPath = '/create-password'
export const profileAppPath = '/profile'

export const appHost = process.env.NEXT_PUBLIC_APP_HOST

/***** api *****/
export const fileUploadApiPath = '/api/files/upload'
export const fileAuthApiPath = `${appHost}/api/files/authorize`

export const twoFaApiPath = `${appHost}/api/two-fa`
export const twoFaVerifyApiPath = '/api/two-fa/verify'

export const emailCreatePassApiPath = '/api/emails/create-pass'
