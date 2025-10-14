export const DB_ERROR_LIST: { code: string; message: string }[] = [{ code: 'P2002', message: 'This email already exists!' }]

export const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Russian', value: 'ru' },
  { label: 'Ukrainian', value: 'ua' },
]

export const THEMES = [
  { label: 'Default', name: 'default', value: 'theme-default' },
  { label: 'Default Dark', name: 'defaultDark', value: 'theme-default-dark' },
  { label: 'Sky-Blue', name: 'blue', value: 'theme-blue' },
  { label: 'Sky-Blue Dark', name: 'blueDark', value: 'theme-blue-dark' },
  { label: 'Browny-Red', name: 'red', value: 'theme-red' },
  { label: 'Browny-Red Dark', name: 'redDark', value: 'theme-red-dark' },
  { label: 'Purple', name: 'purple', value: 'theme-purple' },
  { label: 'Purple Dark', name: 'purpleDark', value: 'theme-purple-dark' },
  { label: 'Green', name: 'green', value: 'theme-green' },
  { label: 'Green Dark', name: 'greenDark', value: 'theme-green-dark' },
]

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const NOTIFICATION_TYPES = {
  createdSet: 'createdSet',
  createdClass: 'createdClass',
  sentClassJoinRequest: 'sentClassJoinRequest',
  approvedClassJoinRequest: 'approvedClassJoinRequest',
}

export const NOTIFICATION_STATUSES = { new: 'new', read: 'read' }

export const SOCKET_EVENTS = { notification: 'notification', message: 'message', signOut: 'sign out' }
export const SOCKET_EVENT_LIST = SOCKET_EVENTS.notification || SOCKET_EVENTS.message

export const ACTIVITIES_NAMES = { flashcards: 'flashcards', memorization: 'memorization', spelling: 'spelling' }

export const INFINITY_SCROLL_LIMIT = 10

export const SESSION_DURATION = 1000 * 60 * 60 * 4 // 4 hours

// eslint-disable-next-line max-len
export const BLURRED_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAJAAUDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAjEAABAwMCBwAAAAAAAAAAAAAEAAIDARExBRITITNBc4HC/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAdEQABAwUBAAAAAAAAAAAAAAABABIhAgMEUaET/9oADAMBAAIRAxEAPwCZnjgkDiMMn0mOGFlWwO4e3e2+b0zTHP12qilh/RC8H25EYN0y7gVbseiPPu50v//Z'
