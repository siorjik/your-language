import bcrypt from 'bcryptjs'

export const encode = (str: string): string => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(str, salt)
}

export const isVerifiedStr = async (str: string, hash: string): Promise<boolean> => await bcrypt.compare(str, hash)
