export const userLogin = (user) => {
  return {
    type: 'USER_LOGIN',
    user
}}

export const userUpdate = (user) => {
  return {
    type: 'USER_UPDATE',
    user
}}


export const userLogout = () => {
  return {
    type: 'USER_LOGOUT'
}}
