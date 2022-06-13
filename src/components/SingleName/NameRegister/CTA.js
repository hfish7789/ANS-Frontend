import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import moment from 'moment'
import { css } from 'emotion'
import { useHistory } from 'react-router-dom'
import { Mutation } from '@apollo/client/react/components'
import { useTranslation } from 'react-i18next'
import EthVal from 'ethval'

import { trackReferral } from '../../../utils/analytics'
import { COMMIT, REGISTER } from '../../../graphql/mutations'

import Tooltip from 'components/Tooltip/Tooltip'
import PendingTx from '../../PendingTx'
import AddToCalendar from '../../Calendar/RenewalCalendar'
import { ReactComponent as DefaultPencil } from '../../Icons/SmallPencil.svg'
import { ReactComponent as DefaultOrangeExclamation } from '../../Icons/OrangeExclamation.svg'
import { useAccount } from '../../QueryAccount'
import {
  Button
} from '@mui/material'

const CTAButton = styled(Button)`
  max-width: 250px;
  width: 100%; 
  height: 56px;
  border-radius: 16px;
  font-size: 18px;
`

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Pencil = styled(DefaultPencil)`
  margin-right: 5px;
`

const Prompt = styled('span')`
  color: #ffa600;
  margin-right: 10px;
`

const OrangeExclamation = styled(DefaultOrangeExclamation)`
  margin-right: 5px;
  height: 12px;
  width: 12px;
`

const LeftLink = styled(Link)`
  margin-right: 20px;
`

function getCTA({
  step,
  incrementStep,
  secret,
  duration,
  label,
  hasSufficientBalance,
  txHash,
  setTxHash,
  setCommitmentTimerRunning,
  commitmentTimerRunning,
  isAboveMinDuration,
  refetch,
  refetchIsMigrated,
  readOnly,
  price,
  years,
  premium,
  history,
  t,
  ethUsdPrice,
  account
}) {
  const CTAs = {
    PRICE_DECISION: (
      <Mutation
        mutation={COMMIT}
        variables={{ label, secret, commitmentTimerRunning }}
        onCompleted={data => {
          const txHash = Object.values(data)[0]
          setTxHash(txHash)
          setCommitmentTimerRunning(true)
          incrementStep()
        }}
      >
        {mutate =>
          isAboveMinDuration && !readOnly ? (
            hasSufficientBalance ? (
              <CTAButton variant='contained' data-testid="request-register-button" onClick={mutate}>
                Request&nbsp;to&nbsp;register
              </CTAButton>
            ) : (
              <>
                <Prompt>
                  <OrangeExclamation />
                  {t('register.buttons.insufficient')}
                </Prompt>
                <CTAButton variant='contained' data-testid="request-register-button" type="disabled">
                  Request&nbsp;to&nbsp;register
                </CTAButton>
              </>
            )
          ) : readOnly ? (
            <Tooltip
              text="<p>You are not connected to a web3 browser. Please connect to a web3 browser and try again</p>"
              position="top"
              border={true}
              offset={{ left: -30, top: 10 }}
            >
              {({ showTooltip, hideTooltip }) => {
                return (
                  <CTAButton variant='contained'
                    data-testid="request-register-button"
                    type="disabled"
                    onMouseOver={() => {
                      showTooltip()
                    }}
                    onMouseLeave={() => {
                      hideTooltip()
                    }}
                  >
                    Request&nbsp;to&nbsp;register
                  </CTAButton>
                )
              }}
            </Tooltip>
          ) : (
            <CTAButton variant='contained' data-testid="request-register-button" type="disabled">
              Request&nbsp;to&nbsp;register
            </CTAButton>
          )
        }
      </Mutation>
    ),
    COMMIT_SENT: <PendingTx txHash={txHash} />,
    COMMIT_CONFIRMED: (
      <CTAButton variant='contained' data-testid="disabled-register-button" type="disabled">
        Request&nbsp;to&nbsp;register
      </CTAButton>
    ),
    AWAITING_REGISTER: (
      <Mutation
        mutation={REGISTER}
        variables={{ label, duration, secret }}
        onCompleted={data => {
          const txHash = Object.values(data)[0]
          setTxHash(txHash)
          incrementStep()
        }}
      >
        {mutate => (
          <>
            {hasSufficientBalance ? (
              <>
                <Prompt>
                  <OrangeExclamation />
                  {t('register.buttons.warning')}
                </Prompt>
                <CTAButton variant='contained' data-testid="register-button" onClick={mutate}>
                  Request&nbsp;to&nbsp;register
                </CTAButton>
              </>
            ) : (
              <>
                <Prompt>
                  <OrangeExclamation />
                  {t('register.buttons.insufficient')}
                </Prompt>
                <CTAButton variant='contained' data-testid="register-button" type="disabled">
                  Request&nbsp;to&nbsp;register
                </CTAButton>
              </>
            )}
          </>
        )}
      </Mutation>
    ),
    REVEAL_SENT: (
      <PendingTx
        txHash={txHash}
        onConfirmed={async () => {
          if (ethUsdPrice) {
            // this is not set on local test env
            trackReferral({
              transactionId: txHash,
              labels: [label],
              type: 'register', // renew/register
              price: new EthVal(`${price._hex}`)
                .toEth()
                .mul(ethUsdPrice)
                .toFixed(2), // in wei, // in wei
              years,
              premium
            })
          }
          incrementStep()
        }}
      />
    ),
    REVEAL_CONFIRMED: (
      <>
        <AddToCalendar
          css={css`
            margin-right: 20px;
          `}
          name={`${label}.avax`}
          startDatetime={moment()
            .utc()
            .add(duration, 'seconds')
            .subtract(30, 'days')}
        />
        <LeftLink
          onClick={async () => {
            await Promise.all([refetch(), refetchIsMigrated()])
            history.push(`/name/${label}.avax`)
          }}
          data-testid="manage-name-button"
        >
          {t('register.buttons.manage')}
        </LeftLink>
        <CTAButton variant='contained'
          onClick={async () => {
            await Promise.all([refetchIsMigrated()])
            history.push(`/address/${account}`)
          }}
        >
          <Pencil />
          {t('register.buttons.setreverserecord')}
        </CTAButton>
      </>
    )
  }
  return CTAs[step]
}

const CTA = ({
  step,
  incrementStep,
  secret,
  duration,
  label,
  hasSufficientBalance,
  setTimerRunning,
  setCommitmentTimerRunning,
  commitmentTimerRunning,
  setBlockCreatedAt,
  isAboveMinDuration,
  refetch,
  refetchIsMigrated,
  readOnly,
  price,
  years,
  premium,
  ethUsdPrice
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const account = useAccount()
  const [txHash, setTxHash] = useState(undefined)

  useEffect(() => {
    return () => {
      if (step === 'REVEAL_CONFIRMED') {
        refetch()
      }
    }
  }, [step])

  return (
    <CTAContainer>
      {getCTA({
        step,
        incrementStep,
        secret,
        duration,
        label,
        hasSufficientBalance,
        txHash,
        setTxHash,
        setTimerRunning,
        setBlockCreatedAt,
        setCommitmentTimerRunning,
        commitmentTimerRunning,
        isAboveMinDuration,
        refetch,
        refetchIsMigrated,
        readOnly,
        price,
        years,
        premium,
        history,
        t,
        ethUsdPrice,
        account
      })}
    </CTAContainer>
  )
}

export default CTA