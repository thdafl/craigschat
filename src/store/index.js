import { combineReducers } from 'redux';
import users from './users/reducer';

export const rootReducer = combineReducers({ users });