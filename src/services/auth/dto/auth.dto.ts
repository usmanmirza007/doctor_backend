export enum UserType {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}
export interface AuthSingupDto {
  name: string
  email: string
  password: string
  number: number
  userType: UserType
}
export interface AuthSinginDto {
  email: string
  password: string
  userType: UserType
}
export interface AuthOTPDto {
  email: string,
  otp?: number
}