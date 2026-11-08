import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from './relations'
import { config } from '../config'

export const db = drizzle(config.database.url, { relations })
