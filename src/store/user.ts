import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/models/User.ts'

const slice = createSlice({
  name: 'user',
  initialState: null as User | null,

  reducers: {
    setUser: (user, { payload: newUser }: PayloadAction<User | null>) => {
      if (
        newUser?.zjuId == user?.zjuId &&
        newUser?.password == user?.password
      ) {
        return
      }
      console.log('setUser', { oldUser: user, newUser })
      return newUser
    },
  },
})

export const { setUser } = slice.actions

export const userReducer = slice.reducer
