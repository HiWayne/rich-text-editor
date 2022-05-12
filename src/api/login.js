import { post } from './request'

export const RegisterUser = params => post('/register', params)
