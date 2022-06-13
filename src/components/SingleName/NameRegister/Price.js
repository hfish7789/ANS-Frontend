import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'
import EthVal from 'ethval'
import { InlineLoader } from 'components/Loader'
import {
  Paper,
  Grid,
  Stack,
  Typography,
  IconButton,
  Divider,
  Box
} from '@mui/material'

const Value = styled(Stack)`
  font-family: Overpass;
  font-weight: 400;
  font-size: 18px;
  color: #2b2b2b;
  margin-top: 8px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dbdbdb;
  ${mq.small`
    font-size: 18px;
  `}
`

const Description = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  margin-top: 10px;
`

const USD = styled('span')`
  font-size: 18px;
  color: #adbbcd;
  ${mq.small`
    font-size: 18px;
  `}
`

const Price = ({
  loading,
  price,
  ethUsdPrice,
  ethUsdPremiumPrice,
  ethUsdPriceLoading,
  initialGasPrice,
  underPremium
}) => {
  const { t } = useTranslation()

  let ethPrice = <InlineLoader />
  let ethVal, basePrice, withPremium, usdPremium
  if (!loading && price) {
    ethVal = new EthVal(`${price}`).toEth()
    ethPrice = ethVal && ethVal.toFixed(3)
    if (ethUsdPrice && ethUsdPremiumPrice) {
      basePrice = ethVal.mul(ethUsdPrice) - ethUsdPremiumPrice
      withPremium =
        underPremium && ethUsdPremiumPrice
          ? `$${basePrice.toFixed(0)}(+$${ethUsdPremiumPrice.toFixed(2)}) =`
          : null
      usdPremium = ethVal.mul(ethUsdPrice).toFixed(2)
    } else if (ethUsdPrice) {
      usdPremium = ethVal.mul(ethUsdPrice).toFixed(2)
    }
  }
  return (
    <Box>
      <Value direction='row' alignItems="center" justifyContent='space-between'>
        {ethPrice}&nbsp;AVAX&nbsp;&nbsp;
        {ethVal && ethUsdPrice && (
          <USD>
            {withPremium}${usdPremium}
            USD
          </USD>
        )}
      </Value>
      <Description>
        Registration&nbsp;price&nbsp;to&nbsp;pay
      </Description>
    </Box>
  )
}

export default Price
