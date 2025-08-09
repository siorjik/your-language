/***** app *****/

// auth
export const signInAppPath = '/sign-in'
export const signUpAppPath = '/sign-up'
export const createPasswordAppPath = '/create-password'
export const recoverPasswordAppPath = '/recover-password'

export const profileAppPath = '/profile'
export const libraryAppPath = '/library'
export const activitiesAppPath = '/activities'

// set
export const setsAppPath = '/sets'
export const newSetAppPath = `${setsAppPath}/new`
export const getSetAppPath = (id: string) => `${setsAppPath}/${id}`
export const getUpdateSetAppPath = (id: string) => `${setsAppPath}/${id}/update`
export const getFlashcardsAppPath = (id: string) => `${setsAppPath}/${id}/flashcards`
export const getMemorizationAppPath = (id: string) => `${setsAppPath}/${id}/memorization`
export const getSpellingAppPath = (id: string) => `${setsAppPath}/${id}/spelling`

export const appHost = process.env.NEXT_PUBLIC_APP_HOST
console.log('process.env.NEXT_PUBLIC_APP_HOST - ', process.env.NEXT_PUBLIC_APP_HOST)
console.log('appHost - ', appHost)

/***** api *****/
export const dictionaryApiPath = '/api/dictionary'
export const translateApiPath = '/api/translate'

export const fileUploadApiPath = '/api/files/upload'
// export const fileAuthApiPath = `${appHost}/api/files/authorize`
export const fileAuthApiPath = '/api/files/authorize'

export const twoFaApiPath = `${appHost}/api/two-fa`
export const twoFaVerifyApiPath = '/api/two-fa/verify'

export const emailCreatePassApiPath = '/api/emails/create-pass'
export const emailRecoverPassApiPath = '/api/emails/recover-pass'

// export const activityTypesListApiPath = `${appHost}/api/activity-types`
export const activityTypesListApiPath = '/api/activity-types'
