import apiRequestService from '@/services/apiRequestService'
import { fileAuthApiPath, fileUploadApiPath } from '@/utils/paths'

export default class FileStorageService {
  private storageAuth: { authToken: string; downloadUrl: string } = { authToken: '', downloadUrl: '' }
  private authTime = 1000 * 60 * 60 * 8 // 8 hours

  async authorize() {
    console.log('process.env.NEXT_PUBLIC_APP_HOST in file service - ', process.env.NEXT_PUBLIC_APP_HOST)
    console.log('fileAuthApiPath in file service - ', fileAuthApiPath)
    try {
      if (!this.storageAuth.authToken) {
        const { authorizationToken, downloadUrl }: { authorizationToken: string; downloadUrl: string } = await apiRequestService({
          url: `${process.env.NEXT_PUBLIC_APP_HOST}${fileAuthApiPath}`,
        })

        this.storageAuth = { authToken: authorizationToken, downloadUrl: downloadUrl }

        setTimeout(() => (this.storageAuth = { authToken: '', downloadUrl: '' }), this.authTime)
      }

      return this.storageAuth
    } catch (error) {
      throw error
    }
  }

  async uploadFile(fileStr: string, fileName: string) {
    try {
      const res = await fetch(fileUploadApiPath, {
        method: 'POST',
        body: JSON.stringify({ file: fileStr }),
        headers: { 'X-File-Name': fileName },
      })

      if (!res.ok) throw new Error('Uploading error')

      const url = await res.json()

      return url
    } catch (error) {
      throw error
    }
  }

  getAuthFileUrl(url: string) {
    try {
      return `${url}?Authorization=${this.storageAuth.authToken}`
    } catch (error) {
      throw error
    }
  }

  deleteAuth() {
    this.storageAuth = { authToken: '', downloadUrl: '' }
  }
}
