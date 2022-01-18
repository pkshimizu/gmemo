import { StoreState } from '../index'
import { createSelector } from '@reduxjs/toolkit'

const systemSelector = (state: StoreState) => state.system
export const errorSelector = createSelector([systemSelector], (state) => state.error)
export const systemMessageSelector = createSelector([systemSelector], (state) => state.message)