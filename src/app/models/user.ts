export interface IUser{
  id?: number
  login: string
  password?: string
  userType?: UserType
}

export enum UserType {MEMBER = "MEMBER", ADMIN = "ADMIN"}

export interface AdminRequest {
  id?: number
  user: IUser
  requestDate: string
  status: string
  comment: string
}
