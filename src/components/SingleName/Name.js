import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import { useMediaMin } from 'mediaQuery'
import { EMPTY_ADDRESS } from '../../utils/records'
import { Title } from '../Typography/Basic'
import TopBar from '../Basic/TopBar'
import DefaultFavourite from '../AddFavourite/Favourite'
import NameDetails from './NameDetails'
import DNSNameRegister from './DNSNameRegister'
import ShortName from './ShortName'
import Tabs from './Tabs'
import NameContainer from '../Basic/MainContainer'
import Copy from '../CopyToClipboard/'
import { isOwnerOfParentDomain } from '../../utils/utils'
import {
  Paper,
  Grid,
  Stack,
  Typography,
  IconButton,
} from '@mui/material'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  ContentCopy
} from '@mui/icons-material'
import mdi_web from '../../assets/mdi_web.png'
import lineLeft1 from '../../assets/line-left-1.png'
import lineLeft2 from '../../assets/line-left-2.png'
import lineLeft3 from '../../assets/line-left-3.png'
import lineRight1 from '../../assets/line-right-1.png'
import lineRight2 from '../../assets/line-right-2.png'
import lineRight3 from '../../assets/line-right-3.png'
import '../../App.css'

const Owner = styled('div')`
  color: #ccd4da;
  margin-right: 20px;
`

const Favourite = styled(DefaultFavourite)``

function isRegistrationOpen(available, parent, isDeedOwner) {
  return parent === 'avax' && !isDeedOwner && available
}

function isDNSRegistrationOpen(domain) {
  const nameArray = domain.name?.split('.')
  if (nameArray?.length !== 2 || nameArray?.[1] === 'avax') {
    return false
  }
  return domain.isDNSRegistrar && domain.owner === EMPTY_ADDRESS
}

function isOwnerOfDomain(domain, account) {
  if (domain.owner !== EMPTY_ADDRESS && !domain.available) {
    return domain.owner?.toLowerCase() === account?.toLowerCase()
  }
  return false
}

const NAME_REGISTER_DATA_WRAPPER = gql`
  query nameRegisterDataWrapper @client {
    accounts
    networkId
  }
`

export const useRefreshComponent = () => {
  const [key, setKey] = useState(0)
  const {
    data: { accounts, networkId }
  } = useQuery(NAME_REGISTER_DATA_WRAPPER)
  const mainAccount = accounts?.[0]
  useEffect(() => {
    setKey(x => x + 1)
  }, [mainAccount, networkId])
  return key
}

const NAME_QUERY = gql`
  query nameQuery {
    accounts @client
  }
`

function Name({ details: domain, name, pathname, type, refetch }) {
  const { t } = useTranslation()
  const smallBP = useMediaMin('small')
  const percentDone = 0

  const {
    data: { accounts }
  } = useQuery(NAME_QUERY)

  const account = accounts?.[0]
  const isOwner = isOwnerOfDomain(domain, account)
  const isOwnerOfParent = isOwnerOfParentDomain(domain, account)
  const isDeedOwner = domain.deedOwner === account
  const isRegistrant = !domain.available && domain.registrant === account

  const registrationOpen = isRegistrationOpen(
    domain.available,
    domain.parent,
    isDeedOwner
  )
  const preferredTab = registrationOpen ? 'register' : 'details'

  let ownerType,
    registrarAddress = domain.parentOwner
  if (isDeedOwner || isRegistrant) {
    ownerType = 'Registrant'
  } else if (isOwner) {
    ownerType = 'Controller'
  }
  let containerState
  if (isDNSRegistrationOpen(domain)) {
    containerState = 'Open'
  } else {
    containerState = isOwner ? 'Yours' : domain.state
  }

  const key = useRefreshComponent()

  return (
    <NameContainer state={containerState} key={key}>
      <Grid sx={{ m: "46px" }}>
        <Grid container>
          <Grid sm={12} md={4} container alignItems='stretch'>
            <Paper sx={{ p: "40px 8%", background: "#F26155", borderRadius: "32px", color: "white", mr: "36px", width: "100%" }}>
              {/* <Typography component='img' src={lineLeft1} sx={{ position: 'absolute', ml: "-85px" }} />
              <Typography component='img' src={lineLeft2} sx={{ position: 'absolute', ml: "-85px", mt: '15px' }} />
              <Typography component='img' src={lineLeft3} sx={{ position: 'absolute', ml: "-85px", mt: '30px' }} />
              <Typography component='img' src={lineRight1} align='right' sx={{ position: 'absolute', ml: "-85px" }} />
              <Typography component='img' src={lineRight2} align='right' sx={{ position: 'absolute', ml: "-85px", mt: '15px' }} />
              <Typography component='img' src={lineRight3} align='right' sx={{ position: 'absolute', ml: "-85px", mt: '30px' }} /> */}
              <Stack direction="row" alignItems="center" justifyContent='space-between' sx={{ width: "100%" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography component='img' src={mdi_web} sx={{ width: "44px", height: "44px" }} />
                  <Typography className="subject-text">{t('singleName.search.title')}</Typography>
                </Stack>
                {!!ownerType && (
                  <Owner data-testid="owner-type">
                    {ownerType === 'Registrant'
                      ? t('c.registrant')
                      : t('c.Controller')}
                  </Owner>
                )}
              </Stack>
              <Paper elevation={0} sx={{ p: "25px 10%", background: "rgba(255, 255, 255, 0.2)", borderRadius: "24px", mt: "29px", color: "white" }}>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                  <Grid xs={8}>
                    <Typography sx={{ fontSize: "20px" }}>{domain?.decrypted ? name : '[unknown' + domain.name?.split('.')[0].slice(1, 11) + ']' + '.' + domain.parent}</Typography>
                  </Grid>
                  <Grid xs={0.5}>
                    <CopyToClipboard text={
                      domain?.decrypted
                        ? name
                        : '[unknown' +
                        domain.name?.split('.')[0].slice(1, 11) +
                        ']' +
                        '.' +
                        domain.parent
                    }>
                      <IconButton sx={{ color: "white", p: "12px" }}><ContentCopy /></IconButton>
                    </CopyToClipboard>
                  </Grid>
                  <Grid xs={1}>
                    <Favourite domain={domain} />
                  </Grid>
                </Grid>
              </Paper>
              <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: "33px" }}>
                {smallBP && (
                  <Tabs
                    pathname={pathname}
                    tab={preferredTab}
                    domain={domain}
                    parent={domain.parent}
                  />
                )}
              </Stack>
            </Paper>
          </Grid>
          {isDNSRegistrationOpen(domain) ? (
            <DNSNameRegister
              domain={domain}
              registrarAddress={registrarAddress}
              pathname={pathname}
              refetch={refetch}
              account={account}
              readOnly={account === EMPTY_ADDRESS}
            />
          ) : type === 'short' && domain.owner === EMPTY_ADDRESS ? ( // check it's short and hasn't been claimed already
            <ShortName name={name} />
          ) : (
            <NameDetails
              tab={preferredTab}
              domain={domain}
              pathname={pathname}
              name={name}
              isOwner={isOwner}
              isOwnerOfParent={isOwnerOfParent}
              refetch={refetch}
              account={account}
              registrationOpen={registrationOpen}
            />
          )}
        </Grid>

        {!smallBP && (
          <Tabs
            pathname={pathname}
            tab={preferredTab}
            domain={domain}
            parent={domain.parent}
          />
        )}
      </Grid>
    </NameContainer>
  )
}

export default Name
