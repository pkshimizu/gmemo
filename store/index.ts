import AuthRepository from '../repositories/AuthRepository'
import { combineReducers, Store } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import sessionSlice, { sessionInitialState } from './session'
import notesSlice, { notesInitialState } from './notes'
import NoteRepository from '../repositories/NoteRepository'

const rootReducer = combineReducers({
  session: sessionSlice.reducer,
  notes: notesSlice.reducer,
})

const preloadedState = () => ({
  session: sessionInitialState,
  notes: notesInitialState,
})

export type StoreState = ReturnType<typeof preloadedState>

export type ReduxStore = Store<StoreState>

export type Repositories = {
  authRepository: AuthRepository
  noteRepository: NoteRepository
}

export type ThunkExtra = {
  repositories: Repositories
}

const thunkExtra: ThunkExtra = {
  repositories: {
    authRepository: new AuthRepository(),
    noteRepository: new NoteRepository(),
  },
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: thunkExtra },
    }).concat(
      createLogger({
        diff: true,
        collapsed: true,
      })
    ),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: preloadedState(),
})

export default store
