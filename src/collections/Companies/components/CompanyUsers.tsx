'use client'

import React from 'react'

import CustomRelationshipTable from '@/components/admin/fields/CustomRelationshipTable'

export default function CompanyUsers(props) {
  return <CustomRelationshipTable searchFields={['fullname']} {...props} />
}
