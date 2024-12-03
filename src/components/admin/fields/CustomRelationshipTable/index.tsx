'use client'
import {
  Button,
  ChevronIcon,
  Column,
  FieldLabel,
  ListQueryProvider,
  Pill,
  RelationshipProvider,
  TextInput,
  useAuth,
  useConfig,
  useDocumentDrawer,
  useDocumentInfo,
  useField,
  useServerFunctions,
  useTranslation,
  withCondition,
} from '@payloadcms/ui'
import { useIgnoredEffect } from '@payloadcms/ui/hooks/useIgnoredEffect'
import { hoistQueryParamsToAnd } from '@payloadcms/ui/utilities/mergeListSearchAndWhere'
import { DrawerLink } from '@payloadcms/ui/elements/RelationshipTable/cells/DrawerLink'
import type {
  ClientCollectionConfig,
  JoinFieldClientProps,
  ListQuery,
  PaginatedDocs,
  Where,
} from 'payload'

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimateHeight } from './AnimateHeight'
import { RelationshipTablePagination } from './Pagination'
import { TableColumnsProvider } from './TableColumns'
// import { ColumnSelector } from '@payloadcms/ui/elements/ColumnSelector'
import ColumnSelector from './ColumnSelector'

const baseClass = 'relationship-table'

interface Props extends JoinFieldClientProps {
  searchFields?: string[]
}

export const RelationshipTable = ({ searchFields = [], ...props }: Props) => {
  const {
    field,
    field: { admin, collection, label, localized, on, required },
    path,
  } = props

  const { id: docID } = useDocumentInfo()

  const { customComponents: { Label } = {}, value } = useField<PaginatedDocs>({
    path,
  })

  const [searchValue, setSearchValue] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')

  const filterOptions: null | Where = useMemo(() => {
    if (!docID) {
      return null
    }

    const obj = {}

    searchFields.forEach((fieldKey) => {
      obj[fieldKey] = searchValue ? { like: searchValue } : {}
    })

    const where: Where = {
      [on]: {
        equals: docID,
      },
      ...obj,
      //   name: searchValue ? { like: searchValue } : {},
    }

    if (field.where) {
      return {
        and: [where, field.where],
      }
    }

    return where
  }, [docID, on, field.where, searchValue])

  const allowCreate = typeof docID !== 'undefined' && admin?.allowCreate
  const disableTable = filterOptions === null
  const initialDataFromProps = docID && value ? value : ({ docs: [] } as unknown as PaginatedDocs)
  const initialDrawerData = {
    [on]: docID,
  }
  const relationTo = collection

  const [Table, setTable] = useState<React.ReactNode>(null)

  const { getEntityConfig } = useConfig()

  const { permissions } = useAuth()

  const [initialData] = useState<any>(() => {
    if (initialDataFromProps) {
      return {
        ...initialDataFromProps,
        docs: Array.isArray(initialDataFromProps.docs)
          ? initialDataFromProps.docs.reduce((acc, doc) => {
              if (typeof doc === 'string') {
                return [
                  ...acc,
                  {
                    id: doc,
                  },
                ]
              }
              return [...acc, doc]
            }, [])
          : [],
      }
    }
  })

  const { i18n, t } = useTranslation()

  const [query, setQuery] = useState<ListQuery>()
  const [openColumnSelector, setOpenColumnSelector] = useState(false)

  const [collectionConfig] = useState(
    () => getEntityConfig({ collectionSlug: relationTo }) as ClientCollectionConfig,
  )

  const [isLoadingTable, setIsLoadingTable] = useState(true)
  const [data, setData] = useState<PaginatedDocs>(initialData)
  const [columnState, setColumnState] = useState<Column[]>([])

  const { getTableState } = useServerFunctions()

  const renderTable = useCallback(
    async (docs?: PaginatedDocs['docs']) => {
      const newQuery: ListQuery = {
        ...(query || {}),
        where: { ...(query?.where || {}) },
      }

      if (filterOptions) {
        newQuery.where = hoistQueryParamsToAnd(newQuery.where as any, filterOptions)
      }

      const {
        data: newData,
        state: newColumnState,
        Table: NewTable,
      } = await getTableState({
        collectionSlug: relationTo,
        docs,
        enableRowSelections: false,
        query: newQuery,
        renderRowTypes: true,
        tableAppearance: 'condensed',
      })

      setData(newData)
      setTable(NewTable)
      setColumnState(newColumnState as any)
      setIsLoadingTable(false)
    },
    [getTableState, relationTo, filterOptions, query],
  )

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchInputValue !== '') {
        setSearchValue(searchInputValue)
      } else {
        setSearchValue('')
      }
    }, 400)

    return () => clearTimeout(timerId)
  }, [searchInputValue])

  useIgnoredEffect(
    () => {
      void renderTable()
      //   if (!disableTable && (!Table || query)) {
      //     void renderTable()
      //   }
    },
    [query, disableTable, searchValue],
    // [query, disableTable],
    [Table, renderTable],
  )

  const [DocumentDrawer, DocumentDrawerToggler, { closeDrawer, openDrawer }] = useDocumentDrawer({
    collectionSlug: relationTo,
  })

  const onDrawerSave = useCallback<any>(
    (args) => {
      const foundDocIndex = data?.docs?.findIndex((doc) => doc.id === args.doc.id)
      let withNewOrUpdatedDoc: PaginatedDocs['docs'] | undefined = undefined

      if (foundDocIndex !== -1) {
        const newDocs = [...data.docs]
        newDocs[foundDocIndex] = args.doc
        withNewOrUpdatedDoc = newDocs
      } else {
        withNewOrUpdatedDoc = [args.doc, ...data.docs]
      }

      void renderTable(withNewOrUpdatedDoc)
    },
    [data.docs, renderTable],
  )

  const onDrawerCreate = useCallback<any>(
    (args) => {
      closeDrawer()
      void onDrawerSave(args)
    },
    [closeDrawer, onDrawerSave],
  )

  const preferenceKey = `${relationTo}-list`

  const canCreate = allowCreate !== false && permissions?.collections?.[relationTo]?.create

  return (
    <div className={baseClass}>
      {searchFields.length > 0 && (
        <div
          style={{
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
          }}
        >
          <TextInput
            style={{ width: '100%' }}
            path=""
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            placeholder={`Search by ${searchFields.join(', ')}`}
          />
        </div>
      )}
      <div className={`${baseClass}__header`}>
        <h4 style={{ margin: 0 }}>
          {Label || (
            <FieldLabel label={label} localized={localized} path={path} required={required} />
          )}
        </h4>
        <div className={`${baseClass}__actions`}>
          {canCreate && (
            <DocumentDrawerToggler className={`${baseClass}__add-new`}>
              {i18n.t('fields:addNew')}
            </DocumentDrawerToggler>
          )}
          <Pill
            aria-controls={`${baseClass}-columns`}
            aria-expanded={openColumnSelector}
            className={`${baseClass}__toggle-columns ${
              openColumnSelector ? `${baseClass}__buttons-active` : ''
            }`}
            icon={<ChevronIcon direction={openColumnSelector ? 'up' : 'down'} />}
            onClick={() => setOpenColumnSelector(!openColumnSelector)}
            pillStyle="light"
          >
            {t('general:columns')}
          </Pill>
        </div>
      </div>
      {isLoadingTable ? (
        <p>{t('general:loading')}</p>
      ) : (
        <Fragment>
          {data.docs && data.docs.length === 0 && (
            <div className={`${baseClass}__no-results`}>
              <p>
                {i18n.t('general:noResults', {
                  //   label: getTranslation(collectionConfig?.labels?.plural, i18n),
                  label: collectionConfig?.labels?.plural,
                })}
              </p>
              {canCreate && (
                <Button onClick={openDrawer}>
                  {i18n.t('general:createNewLabel', {
                    // label: getTranslation(collectionConfig?.labels?.singular, i18n),
                    label: collectionConfig?.labels?.singular,
                  })}
                </Button>
              )}
            </div>
          )}
          {data.docs && data.docs.length > 0 && (
            <RelationshipProvider>
              <ListQueryProvider
                collectionSlug={relationTo}
                data={data}
                defaultLimit={collectionConfig?.admin?.pagination?.defaultLimit}
                modifySearchParams={false}
                onQueryChange={setQuery}
                preferenceKey={preferenceKey}
              >
                <TableColumnsProvider
                  collectionSlug={relationTo}
                  columnState={columnState}
                  docs={data.docs}
                  LinkedCellOverride={<DrawerLink onDrawerSave={onDrawerSave} />}
                  preferenceKey={preferenceKey}
                  renderRowTypes
                  setTable={setTable}
                  sortColumnProps={{
                    appearance: 'condensed',
                  }}
                  tableAppearance="condensed"
                >
                  <AnimateHeight
                    className={`${baseClass}__columns`}
                    height={openColumnSelector ? 'auto' : 0}
                    id={`${baseClass}-columns`}
                  >
                    <div className={`${baseClass}__columns-inner`}>
                      <ColumnSelector collectionSlug={collectionConfig.slug} />
                    </div>
                  </AnimateHeight>
                  {Table}
                  <RelationshipTablePagination />
                </TableColumnsProvider>
              </ListQueryProvider>
            </RelationshipProvider>
          )}
        </Fragment>
      )}
      <DocumentDrawer initialData={initialDrawerData} onSave={onDrawerCreate} />
    </div>
  )
}

export default withCondition(RelationshipTable)
