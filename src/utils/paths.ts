/***** app *****/
export const signInAppPath = '/sign-in'
export const signUpAppPath = '/sign-up'
export const createPasswordAppPath = '/create-password'
export const profileAppPath = '/profile'

// set
export const setAppPath = '/sets'
export const newSetAppPath = `${setAppPath}/new`
export const getSetAppPath = (id: string) => `${setAppPath}/${id}`
export const getUpdateSetAppPath = (id: string) => `${setAppPath}/${id}/update`

export const appHost = process.env.NEXT_PUBLIC_APP_HOST

/***** api *****/
export const dictionaryApiPath = '/api/dictionary'
export const translateApiPath = '/api/translate'

export const fileUploadApiPath = '/api/files/upload'
export const fileAuthApiPath = `${appHost}/api/files/authorize`

export const twoFaApiPath = `${appHost}/api/two-fa`
export const twoFaVerifyApiPath = '/api/two-fa/verify'

export const emailCreatePassApiPath = '/api/emails/create-pass'
