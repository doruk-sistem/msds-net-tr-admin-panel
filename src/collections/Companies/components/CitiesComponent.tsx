'use client'

import * as React from 'react'
import { SelectInput, useField, useWatchForm, useTranslation } from '@payloadcms/ui'

import { City } from 'country-state-city'

const texts = {
  label: {
    tr: 'İlçe',
    en: 'City',
  },
  noStates: {
    en: 'No cities were found for the selected country.',
    tr: 'Seçilen ülke için ilçe bulunamadı.',
  },
}

const CitiesComponent: React.FC<any> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const {
    i18n: { language: lang },
  } = useTranslation()
  const { getDataByPath } = useWatchForm()
  const country: string = getDataByPath('country')
  const state: string = getDataByPath('state')
  const cities = React.useMemo(() => City.getCitiesOfState(country, state), [country, state])

  const citiesOptions = React.useMemo(
    () =>
      cities.map((city) => ({
        value: city.name,
        label: city.name,
      })),
    [cities],
  )

  if (!country || !state) {
    return null
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label className="field-label">{texts.label[lang]}</label>
      {citiesOptions.length > 0 ? (
        <SelectInput
          path={path}
          name={path}
          options={citiesOptions}
          value={value}
          onChange={(selected: any) => setValue(selected?.value)}
        />
      ) : (
        texts.noStates[lang]
      )}
    </div>
  )
}

export default CitiesComponent
