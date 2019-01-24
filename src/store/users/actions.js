import { 
  FETCH_USERS,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAIL,
  USER_LOGIN,
  USER_LOGOUT,
  USER_UPDATE,
  USER_UPDATE_SUCCESS,
  USER_DELETE
} from './types';

export const fetchUsers = () => {
  return {
    type: FETCH_USERS,
}}

export const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    users
}}

export const fetchUsersFail = () => {
  return {
    type: FETCH_USERS_FAIL
}}

export const userLogin = (user) => {
  return {
    type: USER_LOGIN,
    user
}}

export const userUpdate = (user) => {
  return {
    type: USER_UPDATE,
    user
}}

export const userUpdateSuccess = (user) => {
  return {
    type: USER_UPDATE_SUCCESS,
    user
}}

export const userLogout = () => {
  return {
    type: USER_LOGOUT
}}

export const userDelete = (user) => {
  return {
    type: USER_DELETE,
    user
}}