'use client'

import { Pagination, useListQuery } from '@payloadcms/ui'
import React from 'react'

export const RelationshipTablePagination: React.FC = () => {
  const { data, handlePageChange } = useListQuery()

  return (
    <Pagination
      hasNextPage={data.hasNextPage}
      hasPrevPage={data.hasPrevPage}
      limit={data.limit}
      nextPage={data.nextPage || 2}
      numberOfNeighbors={1}
      onChange={(e) => {
        void (handlePageChange as any)(e)
      }}
      page={data.page || 1}
      prevPage={data.prevPage || undefined}
      totalPages={data.totalPages}
    />
  )
}
