'use client'

import React from 'react'

import CustomRelationshipTable from '@/components/admin/fields/CustomRelationshipTable'

export default function MsdsContents(props) {
  return <CustomRelationshipTable searchFields={['name']} {...props} />
}
