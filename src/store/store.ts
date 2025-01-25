import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user.ts'

export default configureStore({
  reducer: {
    user: userReducer,
  },
})
