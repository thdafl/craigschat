import { USER_LOGIN, USER_LOGOUT } from './types';

export const userLogin = (user) => {
  return {
    type: USER_LOGIN,
    user
}}

export const userLogout = () => {
  return {
    type: USER_LOGOUT
}}