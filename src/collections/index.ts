import { type CollectionConfig } from 'payload'

import AdminUsers from './AdminUsers'
import CompanyUsers from './CompanyUsers'
import Companies from './Companies'
import ContentLanguages from './ContentLanguages'
import MsdsV2 from './MsdsV2'
import MsdsRequestsV2 from './MsdsRequestsV2'
import MsdsRequests from './MsdsRequests'
import FileMedia from '@/components/Media/FileMedia'

const collections: CollectionConfig[] = [
  AdminUsers,
  CompanyUsers,
  Companies,
  ContentLanguages,
  MsdsV2,
  MsdsRequestsV2,
  MsdsRequests,
  FileMedia,
]

export default collections
