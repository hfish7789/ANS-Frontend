import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'

import mq from 'mediaQuery'
import Step from './Step'
// import Button from '../../Forms/Button'
import { ReactComponent as Tick } from '../../Icons/GreyCircleTick.svg'

import { requestPermission, hasPermission } from './notification'
import CTA from './CTA'
import {
  Paper,
  Grid,
  Stack,
  Typography,
  Divider,
  Box,
  Button,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import bell from '../../../assets/bell.png'
import stepIcon from '../../../assets/Frame 14.png'
import '../../../App.css'

const Header = styled('div')`
`

const Explainer = ({ step, waitPercentComplete, waitTime, label, duration, secondsPassed, timerRunning, setTimerRunning, setCommitmentTimerRunning, commitmentTimerRunning, setBlockCreatedAt, refetch, refetchIsMigrated, isAboveMinDuration, readOnly, price, years, premium, ethUsdPrice, hasSufficientBalance, incrementStep, decrementStep, secret }) => {
  const { t } = useTranslation()
  const titles = {
    PRICE_DECISION: t('register.titles.0'),
    COMMIT_SENT: t('register.titles.1'),
    COMMIT_CONFIRMED: t('register.titles.1'),
    AWAITING_REGISTER: t('register.titles.1'),
    REVEAL_SENT: t('register.titles.1'),
    REVEAL_CONFIRMED: t('register.titles.2')
  }
  const [activeNumber, setActiveNumber] = React.useState(1);

  return (
    <>
      <Header>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ width: "100%", mb: "20px", mt: "50px" }}>
          <Stack direction='row' alignItems='center' spacing={2} sx={{ ml: "50px" }}>
            <Typography component='img' src={stepIcon} />
            <Typography className='subject-text'>Confirmation steps</Typography>
          </Stack>
          <Stack direction='row' spacing={2} alignItems='center'>
            {hasPermission() ? (
              <Button variant='outlined' sx={{ maxWidth: "208px", width: "100%", height: "56px", borderRadius: "16px", fontSize: "18px" }} onClick={requestPermission}>
                <Typography component='img' src={bell} />&nbsp;&nbsp;
                Notify&nbsp;me
              </Button>
            ) : (
              <Button variant='contained' disabled sx={{ maxWidth: "208px", width: "100%", height: "56px", borderRadius: "16px", fontSize: "18px" }}>
                <Tick style={{ marginRight: 5 }} />
                Notify&nbsp;me
              </Button>
            )}
            <CTA
              hasSufficientBalance={hasSufficientBalance}
              waitTime={waitTime}
              incrementStep={incrementStep}
              decrementStep={decrementStep}
              secret={secret}
              step={step}
              label={label}
              duration={duration}
              secondsPassed={secondsPassed}
              timerRunning={timerRunning}
              setTimerRunning={setTimerRunning}
              setCommitmentTimerRunning={setCommitmentTimerRunning}
              commitmentTimerRunning={commitmentTimerRunning}
              setBlockCreatedAt={setBlockCreatedAt}
              refetch={refetch}
              refetchIsMigrated={refetchIsMigrated}
              isAboveMinDuration={isAboveMinDuration}
              readOnly={readOnly}
              price={price}
              years={years}
              premium={premium}
              ethUsdPrice={ethUsdPrice}
            />
          </Stack>
        </Stack>
        <Paper sx={{ p: "25px 50px", background: "rgba(249, 187, 52, 0.08)", borderRadius: "16px", maxWidth: "1126px", width: "100%", mb: "30px" }}>
          <Stack direction='row' alignItems='center' spacing={2}>
            <InfoOutlinedIcon sx={{ fontSize: "50px", color: "#F9B92D" }} />
            <Box>
              <Typography sx={{ fontSize: "16px", fontWeight: 300 }}>{titles[step]}</Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: "300", opacity: "0.4" }}>{t('register.favourite')}</Typography>
            </Box>
          </Stack>
        </Paper>
      </Header>

      <Grid container alignItems='center'>
        <Grid xs={3.5}>
          <Step
            number={1}
            progress={
              step === 'PRICE_DECISION' ? 0 : step === 'COMMIT_SENT' ? 50 : 100
            }
            title={t('register.step1.title')}
            text={t('register.step1.text') + ' ' + t('register.step1.text2')}
            activeNumber={activeNumber}
            setActiveNumber={setActiveNumber}
            content={false}
            waitTime={waitTime}
          />
          <Step
            number={2}
            progress={
              step === 'PRICE_DECISION' || step === 'COMMIT_SENT'
                ? 0
                : step === 'COMMIT_CONFIRMED'
                  ? waitPercentComplete
                  : 100
            }
            title={t('register.step2.title')}
            text={t('register.step2.text')}
            activeNumber={activeNumber}
            setActiveNumber={setActiveNumber}
            content={false}
            waitTime={waitTime}
          />
          <Step
            number={3}
            progress={
              step === 'REVEAL_CONFIRMED' ? 100 : step === 'REVEAL_SENT' ? 50 : 0
            }
            title={t('register.step3.title')}
            text={t('register.step3.text')}
            activeNumber={activeNumber}
            setActiveNumber={setActiveNumber}
            content={false}
            waitTime={waitTime}
          />
        </Grid>
        <Grid container xs={0.5} sx={{ height: "250px" }} justifyContent='center'>
          <Divider orientation='vertical' />
        </Grid>
        <Grid xs={8}>
          <Step
            number={1}
            progress={
              step === 'PRICE_DECISION' ? 0 : step === 'COMMIT_SENT' ? 50 : 100
            }
            title={t('register.step1.title')}
            text={t('register.step1.text') + ' ' + t('register.step1.text2')}
            activeNumber={activeNumber}
            setActiveNumber={setActiveNumber}
            content={true}
            waitTime={waitTime}
          />
          <Step
            number={2}
            progress={
              step === 'PRICE_DECISION' || step === 'COMMIT_SENT'
                ? 0
                : step === 'COMMIT_CONFIRMED'
                  ? waitPercentComplete
                  : 100
            }
            title={t('register.step2.title')}
            text={t('register.step2.text')}
            activeNumber={activeNumber}
            setActiveNumber={setActiveNumber}
            content={true}
            waitTime={waitTime}
          />
          <Step
            number={3}
            progress={
              step === 'REVEAL_CONFIRMED' ? 100 : step === 'REVEAL_SENT' ? 50 : 0
            }
            title={t('register.step3.title')}
            text={t('register.step3.text')}
            activeNumber={activeNumber}
            setActiveNumber={setActiveNumber}
            content={true}
            waitTime={waitTime}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default Explainer
