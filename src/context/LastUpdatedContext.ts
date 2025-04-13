import { RenewService } from '@/services/RenewService'
import { createContext } from 'react'

export const LastUpdatedContext =
  createContext<RenewService['lastUpdated']>(null)
