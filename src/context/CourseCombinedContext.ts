import { createContext } from 'react'
import { CourseCombined } from '../models/CourseCombined'

export const CourseCombinedContext = createContext<CourseCombined[]>([])
