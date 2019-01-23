import { FETCH_CHATROOMS, FETCH_SUCCESS, FETCH_FAIL } from './types';

export const fetchChatrooms = () => {
  return {
    type: FETCH_CHATROOMS
}}

export const fetchSuccess = (chatroom) => {
  return {
    type: FETCH_SUCCESS,
    chatroom
}}

export const fetchFail = () => {
  return {
    type: FETCH_FAIL
}}