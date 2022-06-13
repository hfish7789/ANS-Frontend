import React from 'react'
import styled from '@emotion/styled/macro'
import Years from './NameRegister/Years'
import Price from './NameRegister/Price'
import EthRegistrationGasPrice from './NameRegister/EthRegistrationGasPrice'
import { ReactComponent as DefaultOrangeExclamation } from '../Icons/OrangeExclamation.svg'
import mq from 'mediaQuery'
import { ReactComponent as ChainDefault } from '../Icons/chain.svg'
import chainIcon from '../../assets/akar-icons_link-chain.png'
import { useTranslation } from 'react-i18next'
import {
  Grid,
  Stack,
  Typography,
  Divider,
  Alert
} from '@mui/material'

const PricingContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 20px;
  margin-top: 20px;
  ${mq.medium`
    grid-template-columns:
      minmax(min-content, 200px) minmax(min-content, min-content)
      minmax(200px, 1fr);
  `}
`

const OrangeExclamation = styled(DefaultOrangeExclamation)`
  height: 12px;
  width: 12px;
`

function PricerInner({
  years,
  setYears,
  duration,
  ethUsdPriceLoading,
  ethUsdPrice,
  ethUsdPremiumPrice,
  className,
  loading,
  price,
  gasPrice,
  reference,
  underPremium,
  displayGas = false
}) {
  const { t } = useTranslation()
  return (
    <>
      <Grid container direction="row" alignItems='center' justifyContent='space-between' sx={{ height: "205px" }}>
        <Grid xs={5.5} md={5.5}>
          {years <= 1 && (
            <Alert severity="error" sx={{ background: "transparent" }}>{t('register.increaseRegistrationPeriod')}</Alert>
          )}
          <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Grid xs={5.5}>
              <Years years={years} setYears={setYears} />
            </Grid>
            <Grid xs={1}>
              <Typography component='img' src={chainIcon} />
            </Grid>
            <Grid xs={5.5}>
              <Price
                price={price}
                gasPrice={gasPrice}
                loading={loading}
                ethUsdPriceLoading={ethUsdPriceLoading}
                ethUsdPrice={ethUsdPrice}
                ethUsdPremiumPrice={ethUsdPremiumPrice}
                underPremium={underPremium}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation='vertical' />
        <Grid xs={5.5} md={5.5}>
          {displayGas && gasPrice && (
            <div>
              <EthRegistrationGasPrice
                price={price}
                gasPrice={gasPrice}
                loading={loading}
                ethUsdPriceLoading={ethUsdPriceLoading}
                ethUsdPrice={ethUsdPrice}
                ethUsdPremiumPrice={ethUsdPremiumPrice}
                underPremium={underPremium}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export const PricerAll = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />
})

const Pricer = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />
})

export default Pricer
