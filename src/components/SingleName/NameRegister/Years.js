import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'
import {
  Paper,
  Grid,
  Stack,
  Typography,
  IconButton,
  Divider,
  Box,
  Input
} from '@mui/material'

const YearsContainer = styled('div')`
  ${mq.medium`
    max-width: 220px;
  `}
`

const Stepper = styled('div')`
  display: grid;
  grid-template-columns:
    10px auto
    10px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dfdfdf;
`

const Icon = styled('div')`
  font-family: Overpass;
  font-size: 28px;
  font-weight: 400;
  color: #adbbcd;
  ${p => p.emphasize && 'background-color: #282929;'}
  ${p => (p.emphasize ? 'color: white;' : 'color: #adbbcd;')}
  ${p => (p.emphasize ? 'border-color: white;' : 'color: #adbbcd;')}
  
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  transition: 0.2s;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);

  &:hover {
    color: #2500a6;
    cursor: pointer;
  }
`

const Amount = styled(Stack)`
  font-family: Overpass;
  font-size: 18px;
  font-weight: 400;
  color: #2b2b2b;

  input {
    background: transparent;
    font-family: Overpass;
    font-size: 18px;
    font-weight: 400;
    color: #2b2b2b;
    border: none;
    outline: 0;
  }
`

const Description = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  margin-top: 10px;
`

const Years = ({ years, setYears }) => {
  const { t } = useTranslation()
  const incrementYears = () => setYears(years + 1)
  const decrementYears = () => (years >= 1 ? setYears(years - 1) : null)
  const currentLanguage = window.localStorage.getItem('language')
  return (
    <YearsContainer>
      <Stack direction='row' alignItems="center" justifyContent='space-between'>
        <Icon onClick={decrementYears}>-</Icon>
        <Amount direction='row' alignItems='center'>
          <Input
            type="text"
            value={years}
            onChange={e => {
              const sign = Math.sign(e.target.value)
              if (sign === -1 || isNaN(sign)) {
                setYears(0)
              } else {
                setYears(e.target.value)
              }
            }}
            disableUnderline
            sx={{ maxWidth: '20px' }}
          />{' '}
          <Typography>{t('pricer.yearUnit')}</Typography>
          {/* {currentLanguage === 'en' && years > 1 && 's'} */}
        </Amount>
        <Icon onClick={incrementYears} emphasize={years < 2}>
          +
        </Icon>
      </Stack>
      <Divider sx={{ mt: "20px" }} />
      <Description>{t('pricer.registrationPeriodLabel')}</Description>
    </YearsContainer>
  )
}

export default Years
