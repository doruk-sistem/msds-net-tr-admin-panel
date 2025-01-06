import { type CollectionConfig } from 'payload'

import AdminUsers from './AdminUsers'
import CompanyUsers from './CompanyUsers'
import Companies from './Companies'
import MsdsDocs from './MsdsDocs'
import MsdsContents from './MsdsContents'

const collections: CollectionConfig[] = [
  AdminUsers,
  CompanyUsers,
  Companies,
  MsdsDocs,
  MsdsContents,
]

export default collections
