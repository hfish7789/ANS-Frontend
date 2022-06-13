import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import gql from 'graphql-tag'
import mq from 'mediaQuery'
import { useQuery, useMutation } from '@apollo/client'

import UnstyledBlockies from '../Blockies'
import NoAccountsModal from '../NoAccounts/NoAccountsModal'
import { GET_REVERSE_RECORD } from '../../graphql/queries'
import { imageUrl } from '../../utils/utils'
import {
  Paper,
  Stack,
  Box,
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  useScrollTrigger,
  Fab,
  Zoom,
  InputBase,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const NetworkInformationContainer = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  ${mq.medium`
    display: block;
    border: none;
  `}
`

const Blockies = styled(UnstyledBlockies)`
  border-radius: 30%;
`

const Avatar = styled('img')`
  width: 35px;
  border-radius: 30%;
`

const NetworkStatus = styled('div')`
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  text-transform: capitalize;
  font-weight: 100;
  margin-top: -2px;
  margin-left: 1px;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: flex;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: ${({ netState }) => netState === 0 ? '#94EF7E' : '#F26155'};
    margin-right: 5px;
  }
`

const Account = styled('div')`
  color: black;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AccountContainer = styled('div')`
  position: relative;
  ${mq.medium`
    transform: translate(-25px, 5px);
  `}
`

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    accounts
    isReadOnly
    isSafeApp
    avatar
    network
    displayName
  }
`

function NetworkInformation() {
  const { t } = useTranslation()
  const {
    data: { accounts, isSafeApp, network, displayName, isReadOnly }
  } = useQuery(NETWORK_INFORMATION_QUERY)

  const {
    data: { getReverseRecord } = {},
    loading: reverseRecordLoading
  } = useQuery(GET_REVERSE_RECORD, {
    variables: {
      address: accounts?.[0]
    },
    skip: !accounts?.length
  })
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  return (
    <NetworkInformationContainer hasAccount={accounts && accounts.length > 0}>
      {!isReadOnly ? (
        <AccountContainer>
          <Button onClick={handleOpenUserMenu}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="column">
                <Account data-testid="account" className="account">
                  <span>{displayName}</span>
                </Account>
                <NetworkStatus netState={network === 'unknown' ? 0 : 1}>
                  {network == 'unknown'
                    ? `avalanche ${t('c.network')}`
                    : `${network} ${t('c.network')}`}
                </NetworkStatus>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                {!reverseRecordLoading &&
                  getReverseRecord &&
                  getReverseRecord.avatar ? (
                  <Avatar
                    src={imageUrl(getReverseRecord.avatar, displayName, network)}
                  />
                ) : (
                  <Blockies address={accounts[0]} imageSize={35} />
                )}
                <KeyboardArrowDownIcon sx={{ color: "rgba(0, 0, 0, 0.4)" }} />
              </Stack>
            </Stack>
          </Button>
          {!isSafeApp && (
            <NoAccountsModal
              buttonText={t('c.disconnect')}
              anchorElUser={anchorElUser}
              setAnchorElUser={setAnchorElUser}
            />
          )}
        </AccountContainer>
      ) : (
        <AccountContainer>
          <Button onClick={handleOpenUserMenu}>
            <Stack direction="column">
              <Account data-testid="account" className="account">
                {t('c.readonly')}
              </Account>
              <NetworkStatus netState={network === 'unknown' ? 0 : 1}>
                {network === 'unknown'
                  ? `avalanche ${t('c.network')}`
                  : `${network} ${t('c.network')}`}
              </NetworkStatus>
            </Stack>
          </Button>
          <NoAccountsModal
            anchorElUser={anchorElUser}
            setAnchorElUser={setAnchorElUser}
            buttonText={t('c.connect')}
          />
        </AccountContainer>
      )}
    </NetworkInformationContainer>
  )
}
export default NetworkInformation
