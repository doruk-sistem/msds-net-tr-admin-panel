import { type CollectionConfig } from 'payload'

import AdminUsers from './AdminUsers'
import CompanyUsers from './CompanyUsers'
import Companies from './Companies'
import MsdsDocs from './MsdsDocs'
import MsdsContents from './MsdsContents'
// import MsdsV2 from './Msds'
// import MsdsStorage from './MsdsStorage'

const collections: CollectionConfig[] = [
  AdminUsers,
  CompanyUsers,
  Companies,
  MsdsDocs,
  MsdsContents,
  // MsdsV2,
  // MsdsStorage,
]

export default collections
