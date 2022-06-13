import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import moment from 'moment'
import { useAccount } from '../QueryAccount'
import '../../App.css'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  GET_FAVOURITES,
  GET_DOMAINS_SUBGRAPH,
  GET_REGISTRATIONS_SUBGRAPH
} from '../../graphql/queries'
import { decryptName, checkIsDecrypted } from '../../api/labels'

import mq from 'mediaQuery'

// import div from '../Basic/MainContainer'
import DefaultTopBar from '../Basic/TopBar'
import { Title as DefaultTitle } from '../Typography/Basic'
import DefaultEtherScanLink from '../Links/EtherScanLink'
import { getEtherScanAddr, filterNormalised } from '../../utils/utils'
import { calculateIsExpiredSoon } from '../../utils/dates'
import DomainList from './DomainList'
import RenewAll from './RenewAll'
import Sorting from './Sorting'
import Filtering from './Filtering'
import Loader from '../Loader'
import Banner from '../Banner'
import Checkbox from '../Forms/Checkbox'
import { SingleNameBlockies } from '../Blockies'
import Pager from './Pager'
import AddReverseRecord from '../AddReverseRecord'

import warning from '../../assets/yellowwarning.svg'
import close from '../../assets/close.svg'
import subject from '../../assets/Group 2924.png'
import linkout from '../../assets/Vector.png'
import hand from '../../assets/hand.png'
import { useBlock } from '../hooks'
import gql from 'graphql-tag'
import {
  Paper,
  Grid,
  Stack,
  Typography,
  IconButton,
  useMediaQuery
} from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {
  BookmarkBorder,
  ContentCopy
} from '@mui/icons-material'
// import {
//   NonMainPageBannerContainerWithMarginBottom,
//   DAOBannerContent
// } from '../Banner/DAOBanner'


const DEFAULT_RESULTS_PER_PAGE = 25

// const TopBar = styled(DefaultTopBar)`
//   justify-content: flex-start;
//   margin-bottom: 40px;
// `

// const Title = styled(DefaultTitle)`
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `

// const EtherScanLink = styled(DefaultEtherScanLink)`
//   min-width: 165px;
//   margin-left: auto;
// `

const Close = styled('img')`
  position: absolute;
  right: 20px;
  top: 20px;
  &:hover {
    cursor: pointer;
  }
`

const Controls = styled('div')`
  padding-left: 8px;
  display: grid;
  align-content: center;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'filters'
    'actions'
    'renew'
    'sorting'
    'selectall';
  margin-top: 50px;

  ${mq.large`
    margin-top: 50px;
    margin-left: 50px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
    'filters actions'
    'renew renew'
    'sorting selectall'
    ;
  `}
`

const SelectAll = styled('div')`
  grid-area: selectall;
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;

  ${mq.large`
    padding-right: 10px;
  `}
`

function filterOutReverse(domains) {
  return domains.filter(domain => domain.parent)
}

function normaliseAddress(address) {
  return address.toLowerCase()
}

function decryptNames(domains) {
  return domains.map(d => {
    const name = decryptName(d.domain.name)
    return {
      ...d,
      domain: {
        ...d.domain,
        name: name,
        labelName: checkIsDecrypted(name[0]) ? name.split('.')[0] : null
      }
    }
  })
}

function useDomains({
  resultsPerPage,
  domainType,
  address,
  sort,
  page,
  expiryDate
}) {
  const skip = (page - 1) * resultsPerPage
  const registrationsQuery = useQuery(GET_REGISTRATIONS_SUBGRAPH, {
    variables: {
      id: address,
      first: resultsPerPage,
      skip,
      orderBy: sort.type,
      orderDirection: sort.direction,
      expiryDate
    },
    skip: domainType !== 'registrant',
    fetchPolicy: 'no-cache'
  })

  const controllersQuery = useQuery(GET_DOMAINS_SUBGRAPH, {
    variables: {
      id: address,
      first: resultsPerPage,
      skip
    },
    skip: domainType !== 'controller',
    fetchPolicy: 'no-cache'
  })

  if (domainType === 'registrant') {
    return registrationsQuery
  } else if (domainType === 'controller') {
    return controllersQuery
  } else {
    throw new Error('Unrecognised domainType')
  }
}

const RESET_STATE_QUERY = gql`
  query resetStateQuery @client {
    networkId
    isENSReady
  }
`

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export const useResetState = (
  setYears,
  setCheckedBoxes,
  setSelectAll,
  networkId
) => {
  useEffect(() => {
    setYears(1)
    setCheckedBoxes({})
    setSelectAll(null)
  }, [networkId])
}

export default function Address({
  url,
  address,
  showOriginBanner,
  domainType = 'registrant'
}) {
  const matches1500 = useMediaQuery('(min-width: 1500px)');
  const {
    data: { networkId, isENSReady }
  } = useQuery(RESET_STATE_QUERY)
  const normalisedAddress = normaliseAddress(address)
  const { search } = useLocation()
  const account = useAccount()
  const pageQuery = new URLSearchParams(search).get('page')
  const page = pageQuery ? parseInt(pageQuery) : 1
  const { block } = useBlock()
  let [resultsPerPage, setResultsPerPage] = useState(DEFAULT_RESULTS_PER_PAGE)
  let { t } = useTranslation()
  let [showOriginBannerFlag, setShowOriginBannerFlag] = useState(true)
  let [etherScanAddr, setEtherScanAddr] = useState(null)
  let [activeSort, setActiveSort] = useState({
    type: 'expiryDate',
    direction: 'asc'
  })
  let [checkedBoxes, setCheckedBoxes] = useState({})
  let [years, setYears] = useState(1)
  const [selectAll, setSelectAll] = useState(false)
  useResetState(setYears, setCheckedBoxes, setSelectAll, networkId)

  let currentDate, expiryDate
  if (process.env.REACT_APP_STAGE === 'local') {
    if (block) {
      currentDate = moment(block.timestamp * 1000)
    }
  } else {
    currentDate = moment()
  }
  if (currentDate) {
    expiryDate = currentDate.subtract(90, 'days').unix()
  }

  const { loading, data, error, refetch } = useDomains({
    resultsPerPage,
    domainType,
    address: normalisedAddress,
    sort: activeSort,
    page,
    expiryDate
  })

  const { data: { favourites } = [] } = useQuery(GET_FAVOURITES)
  useEffect(() => {
    if (isENSReady) {
      getEtherScanAddr().then(setEtherScanAddr)
    }
  }, [isENSReady])

  if (error) {
    console.log(error)
    return <Loader withWrap large />
    // return <>Error getting domains. {JSON.stringify(error)}</>
  }

  if (loading) {
    return <Loader withWrap large />
  }

  let normalisedDomains = []

  if (domainType === 'registrant' && data.account) {
    normalisedDomains = [...data.account.registrations]
  } else if (domainType === 'controller' && data.account) {
    normalisedDomains = [
      ...filterOutReverse(data.account.domains).map(domain => ({ domain }))
    ]
  }

  let decryptedDomains = filterNormalised(
    decryptNames(normalisedDomains),
    'labelName',
    true
  )
  // let sortedDomains = decryptedDomains.sort(getSortFunc(activeSort))
  let domains = decryptedDomains
  const selectedNames = Object.entries(checkedBoxes)
    .filter(([key, value]) => value)
    .map(([key]) => key)

  const allNames = domains
    .filter(d => d.domain.labelName)
    .map(d => d.domain.name)

  const selectAllNames = () => {
    const obj = allNames.reduce((acc, name) => {
      acc[name] = true
      return acc
    }, {})

    setCheckedBoxes(obj)
  }

  const hasNamesExpiringSoon = !!domains.find(domain =>
    calculateIsExpiredSoon(domain.expiryDate)
  )

  return (
    <>
      {/*<NonMainPageBannerContainerWithMarginBottom>
        <DAOBannerContent />
      </NonMainPageBannerContainerWithMarginBottom>*/}

      {showOriginBanner && showOriginBannerFlag && (
        <Banner>
          <Close onClick={() => setShowOriginBannerFlag(false)} src={close} />
          {t('address.transactionBanner')}
        </Banner>
      )}
      {hasNamesExpiringSoon && (
        <Banner>
          <h3>
            <img alt="exclamation mark" src={warning} />
            &nbsp; {t('address.namesExpiringSoonBanner.title')}
            <p>
              <Trans i18nKey="address.namesExpiringSoonBanner.text">
                One or more names are expiring soon, renew them all in one
                transaction by selecting multiple names and click "Renew"
              </Trans>
            </p>
          </h3>
        </Banner>
      )}

      <Grid sx={{ m: "46px" }}>
        {/* <TopBar>
          <SingleNameBlockies address={address} />
          <Title>{address}</Title>
          {etherScanAddr && (
            <EtherScanLink address={address}>
              {t('address.snowtraceButton')}
            </EtherScanLink>
          )}
        </TopBar> */}
        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: "45px" }}>
          <Typography sx={{ fontSize: "28px" }}>Welcome back, <a style={{ fontWeight: "750", lineHeight: "34px" }}>Johny!</a></Typography>
          <Typography component='img' src={hand} />
        </Stack>
        <Grid container direction="row" justifyContent="space-between">
          <Grid sm={12} md={3.8} container alignItems='stretch'>
            <Paper sx={{ p: "40px 10%", background: "#F26155", borderRadius: "32px", color: "white", width: '100%' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography component="img" src={subject} className="subject-icon" />
                <Typography className="subject-text">Your ANS Name</Typography>
              </Stack>
              <Paper elevation={0} sx={{ p: "29px 10%", background: "rgba(255, 255, 255, 0.2)", borderRadius: "24px", mt: "29px", color: "white" }}>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                  <Grid xs={8}>
                    <Typography sx={{ fontSize: "20px" }}>{address.length > 21 ? address.slice(0, matches1500 ? 18 : 8) + "..." : address}</Typography>
                  </Grid>
                  <Grid xs={0.5}>
                    <CopyToClipboard text={address}>
                      <IconButton sx={{ color: "white", p: "5%" }}><ContentCopy /></IconButton>
                    </CopyToClipboard>
                  </Grid>
                  <Grid xs={1}>
                    <IconButton sx={{ color: "white", p: "5%" }}><BookmarkBorder /></IconButton>
                  </Grid>
                </Grid>
              </Paper>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} sx={{ mt: "33px", mb: "45px" }}>
                <Typography sx={{ fontSize: "18px" }}>View on Snowtrace.io</Typography>
                <IconButton sx={{ color: "white" }} onClick={() => window.open(`https://snowtrace.io/address/${address}`, '_blank', 'noopener')}><Typography component="img" src={linkout} sx={{ width: "18px", height: "18px" }} /></IconButton>
              </Stack>
            </Paper>
          </Grid>
          <Grid sm={12} md={8}>
            <AddReverseRecord account={account} currentAddress={address} />
          </Grid>
        </Grid>
        <Controls>
          <Filtering
            activeFilter={domainType}
            setActiveSort={setActiveSort}
            url={url}
          />

          {domainType === 'registrant' && (
            <RenewAll
              years={years}
              setYears={setYears}
              activeFilter={domainType}
              selectedNames={selectedNames}
              setCheckedBoxes={setCheckedBoxes}
              setSelectAll={setSelectAll}
              allNames={allNames}
              address={address}
              data={data}
              refetch={refetch}
              getterString="account.registrations"
            />
          )}
          {/* <Sorting
            activeSort={activeSort}
            setActiveSort={setActiveSort}
            activeFilter={domainType}
          /> */}

          {/* {domainType === 'registrant' && (
            <>
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
          )} */}
        </Controls>

        <DomainList
          setSelectAll={setSelectAll}
          address={address}
          domains={domains}
          favourites={filterNormalised(favourites, 'labelName')}
          activeSort={activeSort}
          activeFilter={domainType}
          checkedBoxes={checkedBoxes}
          setCheckedBoxes={setCheckedBoxes}
          showBlockies={false}
        />
        <Pager
          variables={{ id: address, expiryDate }}
          currentPage={page}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          pageLink={`/address/${address}/${domainType}`}
          query={
            domainType === 'registrant'
              ? GET_REGISTRATIONS_SUBGRAPH
              : GET_DOMAINS_SUBGRAPH
          }
        />
      </Grid>
    </>
  )
}
