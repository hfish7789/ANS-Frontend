import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import { Query } from '@apollo/client/react/components'
import DomainItem from '../components/DomainItem/DomainItem'
import { getNamehash } from '@ansdomains/ui'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import {
  GET_FAVOURITES,
  GET_SUBDOMAIN_FAVOURITES,
  GET_OWNER,
  GET_REGISTRATIONS_BY_IDS_SUBGRAPH
} from '../graphql/queries'

import mq from 'mediaQuery'
import moment from 'moment'

import { H2 as DefaultH2 } from '../components/Typography/Basic'
// import LargeHeart from '../components/Icons/LargeHeart'
import RenewAll from '../components/Address/RenewAll'
import Checkbox from '../components/Forms/Checkbox'
import { useAccount } from '../components/QueryAccount'
import { filterNormalised } from '../utils/utils'
import {
  NonMainPageBannerContainer,
  DAOBannerContent
} from '../components/Banner/DAOBanner'

import {
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material'
import {
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  Box
} from '@mui/material'
import mystyle from '@mui/material/styles/styled'
import favMark from '../assets/Group 2902.png'

const FavPaper = mystyle(Paper)(() => ({
  borderRadius: "32px",
  padding: "40px 46px",
  margin: "46px"
}));

const SelectAll = styled('div')`
  grid-area: selectall;
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;
  margin: 2em 0;
`

// const NoDomainsContainer = styled('div')`
//   display: flex;
//   padding: 40px;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   background: white;
//   border-radius: 6px;
//   margin-bottom: 40px;

//   h2 {
//     color: #adbbcd;
//     font-weight: 100;
//     margin-bottom: 0;
//     padding: 0;
//     margin-top: 20px;
//     text-align: center;
//     max-width: 500px;
//   }

//   p {
//     color: #2b2b2b;
//     font-size: 18px;
//     font-weight: 300;
//     margin-top: 20px;
//     line-height: 1.3em;
//     text-align: center;
//     max-width: 400px;
//   }
// `

const NoDomains = () => {
  const { t } = useTranslation()
  return (
    <Stack direction="row" justifyContent="center" alignItems="flex-end">
      <Typography component='img' src={favMark} sx={{ maxWidth: "456px", maxHeight: "271px", width: "100%" }} />
      <Stack direction="column" justifyContent="center" sx={{ maxWidth: "315px", ml: "70px" }}>
        <Typography sx={{ fontWeight: 500, fontSize: "24px" }}>{t('favourites.nofavouritesDomains.title')}</Typography>
        <Typography sx={{ fontWeight: 200, fontSize: "16px", maxWidth: "269px" }}>{t('favourites.nofavouritesDomains.text')}</Typography>
        <Button startIcon={<BookmarkBorder sx={{ fontSize: "30px !important" }} />} sx={{ border: "1px dashed #F26155", borderRadius: "16px", background: "rgba(242, 97, 85, 0.04)", mt: "50px", py: "20px", fontSize: "18px" }}>Add</Button>
      </Stack>
    </Stack>
  )
}

function getAvailable(expiryDate) {
  let e = moment(parseInt(expiryDate * 1000))
  let e2 = moment().subtract(90, 'days')
  return e2.diff(e) > 0
}

function getDomainState(owner, available) {
  if (!owner || available) return 'Open'
  return parseInt(owner, 16) === 0 ? 'Open' : 'Owned'
}

const RESET_STATE_QUERY = gql`
  query resetStateQuery @client {
    networkId
  }
`
export const useResetState = (setYears, setCheckedBoxes, setSelectAll) => {
  const {
    data: { networkId }
  } = useQuery(RESET_STATE_QUERY)
  useEffect(() => {
    setYears(1)
    setCheckedBoxes({})
    setSelectAll(null)
  }, [networkId])
}

function Favourites() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = 'ANS Favourites'
  }, [])

  let [years, setYears] = useState(1)
  let [checkedBoxes, setCheckedBoxes] = useState({})
  const [selectAll, setSelectAll] = useState(false)

  useResetState(setYears, setCheckedBoxes, setSelectAll)

  const { data: { favourites: favouritesWithUnnormalised } = [] } = useQuery(
    GET_FAVOURITES
  )
  useEffect(() => {
    document.title = 'ANS Favourites'
  }, [])

  const { data: { subDomainFavourites } = [] } = useQuery(
    GET_SUBDOMAIN_FAVOURITES
  )
  const favourites = filterNormalised(favouritesWithUnnormalised, 'name')
  const ids = favourites && favourites.map(f => getNamehash(f.name))
  const { data: { registrations } = [], refetch } = useQuery(
    GET_REGISTRATIONS_BY_IDS_SUBGRAPH,
    {
      variables: { ids },
      fetchPolicy: 'no-cache',
      nextFetchPolicy: 'no-cache',
      context: {
        queryDeduplication: false
      }
    }
  )

  // if (!favourites || (favourites.length === 0 && !registrations)) {
  //   return <NoDomains />
  // }
  let favouritesList = []
  if (favourites.length > 0) {
    if (registrations && registrations.length > 0) {
      favouritesList = favourites.map(f => {
        let r = registrations.filter(
          a => a.domain.id === getNamehash(f.name)
        )[0]
        return {
          name: f.name,
          owner: r && r.registrant.id,
          available: getAvailable(r && r.expiryDate),
          expiryDate: r && r.expiryDate
        }
      })
    } else {
      // Fallback when subgraph is not returning result
      favouritesList = favourites.map(f => {
        return {
          name: f.name
        }
      })
    }
  }

  const hasFavourites =
    (favouritesList && favouritesList.length > 0) ||
    (subDomainFavourites && subDomainFavourites.length > 0)
  if (!hasFavourites) {
    return (
      <FavouritesContainer data-testid="favourites-container">
        <FavPaper>
          <Typography sx={{ fontWeight: "600", fontSize: "28px" }}>{t('favourites.favouriteTitle')}</Typography>
          <Divider sx={{ my: "30px" }} />
          <Box sx={{ mt: "55px" }}>
            <NoDomains />
          </Box>
        </FavPaper>
      </FavouritesContainer>
    )
  }

  const selectedNames = Object.entries(checkedBoxes)
    .filter(([key, value]) => value)
    .map(([key]) => key)

  const allNames = favouritesList.map(f => f.name)
  const selectAllNames = () => {
    const obj = favouritesList.reduce((acc, f) => {
      if (f.expiryDate) {
        acc[f.name] = true
      }
      return acc
    }, {})
    setCheckedBoxes(obj)
  }
  let data = []
  const account = useAccount()
  const checkedOtherOwner =
    favouritesList.filter(
      f =>
        f.expiryDate &&
        f.owner !== account?.toLowerCase() &&
        checkedBoxes[f.name]
    ).length > 0
  const canRenew = favouritesList.filter(f => f.expiryDate).length > 0
  return (
    <FavouritesContainer data-testid="favourites-container">
      {/*<NonMainPageBannerContainer>
        <DAOBannerContent />
      </NonMainPageBannerContainer>*/}
      <FavPaper>
        <Typography sx={{ fontWeight: "600", fontSize: "28px" }}>{t('favourites.favouriteTitle')}</Typography>
        <Divider sx={{ my: "30px" }} />
        <Box sx={{ mt: "55px" }}>
          {canRenew && (
            <>
              <RenewAll
                years={years}
                setYears={setYears}
                selectedNames={selectedNames}
                setCheckedBoxes={setCheckedBoxes}
                setSelectAll={setSelectAll}
                allNames={allNames}
                refetch={refetch}
                data={data}
                getterString="registrations"
                checkedOtherOwner={checkedOtherOwner}
              />
              <SelectAll>
                <Checkbox
                  testid="checkbox-renewall"
                  type="double"
                  checked={selectAll}
                  onClick={() => {
                    if (!selectAll) {
                      selectAllNames()
                    } else {
                      setCheckedBoxes({})
                    }
                    setSelectAll(selectAll => !selectAll)
                  }}
                />
              </SelectAll>
            </>
          )}

          {favouritesList &&
            favouritesList.map(domain => {
              return (
                <DomainItem
                  domain={{
                    ...domain,
                    state: getDomainState(domain.owner, domain.available),
                    owner: domain.owner
                  }}
                  isFavourite={true}
                  checkedBoxes={checkedBoxes}
                  setCheckedBoxes={setCheckedBoxes}
                  setSelectAll={setSelectAll}
                />
              )
            })}
          {subDomainFavourites &&
            subDomainFavourites.map(domain => (
              <Query
                query={GET_OWNER}
                variables={{ name: domain.name }}
                key={domain.name}
              >
                {({ loading, error, data }) => {
                  if (error)
                    return <div>{(console.log(error), JSON.stringify(error))}</div>
                  return (
                    <DomainItem
                      loading={loading}
                      domain={{
                        ...domain,
                        state: getDomainState(data?.getOwner, false),
                        owner: data?.getOwner
                      }}
                      isSubDomain={true}
                      isFavourite={true}
                    />
                  )
                }}
              </Query>
            ))}
        </Box>
      </FavPaper>
    </FavouritesContainer>
  )
}

const FavouritesContainer = styled('div')`
  padding-bottom: 60px;
`

export default Favourites
