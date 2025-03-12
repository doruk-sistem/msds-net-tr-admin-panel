import { type CollectionConfig } from 'payload'

import AdminUsers from './AdminUsers'
import CompanyUsers from './CompanyUsers'
import Companies from './Companies'
import ContentLanguages from './ContentLanguages'
import MsdsV2 from './MsdsV2'

const collections: CollectionConfig[] = [
  AdminUsers,
  CompanyUsers,
  Companies,
  ContentLanguages,
  MsdsV2,
]

export default collections
