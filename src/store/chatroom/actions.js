import { FETCH_CHATROOMS, FETCH_SUCCESS, FETCH_TERMINATED } from './types';

export const fetchChatrooms = () => {
  return {
    type: FETCH_CHATROOMS
}}

export const fetchSuccess = (chatroom) => {
  return {
    type: FETCH_SUCCESS,
    chatroom
}}

export const fetchTerminated = () => {
  return {
    type: FETCH_TERMINATED
}}