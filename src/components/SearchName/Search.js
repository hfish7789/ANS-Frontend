import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import { parseSearchTerm } from '../../utils/utils'
import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'
import mq from 'mediaQuery'
import LanguageSwitcher from '../LanguageSwitcher'
import { setupENS } from '@ansdomains/ui'
import {
  Paper,
  IconButton,
  InputBase,
  Typography,
} from '@mui/material'
import searchIcon from '../../assets/search.png'

window.addEventListener('load', async () => {
  const { ens, registrar } = await setupENS()
  console.log('====> registrar', registrar)
  console.log('====> ens', ens)
})

const SEARCH_QUERY = gql`
  query searchQuery {
    isENSReady @client
  }
`

function SearchDoamin({ history, className, style }) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(null)
  const handleParse = e => {
    setInputValue(
      e.target.value
        .split('.')
        .map(term => term.trim())
        .join('.')
    )
  }
  const {
    data: { isENSReady }
  } = useQuery(SEARCH_QUERY)
  let input

  const hasSearch = inputValue && inputValue.length > 0 && isENSReady
  return (
    <Paper
      component="form"
      action="#"
      onSubmit={async e => {
        e.preventDefault()
        if (!hasSearch) return
        const type = await parseSearchTerm(inputValue)
        let searchTerm
        if (input && input.value) {
          // inputValue doesn't have potential whitespace
          searchTerm = inputValue.toLowerCase()
        }
        if (!searchTerm || searchTerm.length < 1) {
          return
        }

        if (type === 'address') {
          history.push(`/address/${searchTerm}`)
          return
        }

        input.value = ''
        if (type === 'supported' || type === 'short') {
          history.push(`/name/${searchTerm}`)
          return
        } else {
          history.push(`/search/${searchTerm}`)
        }
      }}
      sx={{ p: '8px 24px', display: 'flex', alignItems: 'center', maxWidth: "500px", width: "100%", background: "rgba(0, 0, 0, 0.02)", borderRadius: "16px" }}
    >
      <InputBase
        sx={{ flex: 1, fontSize: "18px", width: "100%" }}
        placeholder={t('search.placeholder')}
        inputRef={el => (input = el)}
        onChange={handleParse}
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="submit" sx={{ p: '10px' }} disabled={!hasSearch} data-testid={'home-search-button'}>
        <Typography component='img' src={searchIcon} />
      </IconButton>
    </Paper>
  )
}

const SearchWithRouter = withRouter(SearchDoamin)

const SearchContainer = ({ searchDomain, className, style }) => {
  return (
    <SearchWithRouter
      searchDomain={searchDomain}
      className={className}
      style={style}
    />
  )
}

export { SearchWithRouter as Search }

export default SearchContainer
