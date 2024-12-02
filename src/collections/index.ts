import { CollectionConfig } from 'payload'
import { Media } from './Media'
import AdminUsers from './AdminUsers'
import CompanyUsers from './CompanyUsers'
import Companies from './Companies'
import MsdsDocs from './MsdsDocs'
import MsdsContents from './MsdsContents'

const collections: CollectionConfig[] = [
  Media,
  AdminUsers,
  CompanyUsers,
  Companies,
  MsdsDocs,
  MsdsContents,
]

export default collections
