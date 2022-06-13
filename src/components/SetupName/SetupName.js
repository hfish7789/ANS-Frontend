import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import mq from '../../mediaQuery'
import { ReactComponent as BookPen } from '../Icons/BookPen.svg'
import DefaultRotatingSmallCaret from '../Icons/RotatingSmallCaret'
import {
  Paper,
  Grid,
  Stack,
  Typography,
  Divider,
  Box,
  Button
} from '@mui/material'
import editIcon from '../../assets/Frame 13.png'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import helpImg1_h from '../../assets/Rectangle 9000.png'
import helpImg2_h from '../../assets/Group 24 (1).png'
import helpImg3_h from '../../assets/Group 2876.png'

const Header = styled('header')`
  display: flex;
  position: relative;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`

const RotatingSmallCaret = styled(DefaultRotatingSmallCaret)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%)
    ${p => (p.rotated ? 'rotate(0)' : 'rotate(-90deg)')};
`

const H2 = styled('h2')`
  margin: 0;
  margin-left: 10px;
  font-size: 20px;
  font-weight: 300;
`

const Block = styled('section')`
  margin-right: 40px;
  &:last-child {
    margin-right: 0;
  }
  h3 {
    font-size: 18px;
    font-weight: 300;
  }

  p {
    font-size: 14px;
    font-weight: 300;
  }
`

function SetupName({ initialState = false }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(initialState)
  const [initial, setInitial] = useState(initialState)
  const [helpState, setHelpState] = useState(1);
  // Change the open state when resolver is set/unset
  if (initial !== initialState) {
    setInitial(initialState)
    setOpen(initialState)
  }

  const toggleOpen = () => setOpen(!open)
  return (
    <Paper sx={{ borderRadius: "32px", p: "40px 50px", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent='space-between' sx={{ width: "100%" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography component='img' src={editIcon} sx={{ width: "44px", height: "44px" }} />
          <Typography className='subject-text'>{t('singleName.learnmore.title')}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button onClick={() => setHelpState(prev => (prev === 1 ? 3 : prev - 1))} sx={{ p: "12px", background: "white", borderRadius: "16px", boxShadow: '4px 8px 60px rgba(0, 0, 0, 0.06)' }}>
            <ChevronLeftIcon sx={{ fontSize: "30px" }} />
          </Button>
          <Button onClick={() => setHelpState(prev => (prev === 3 ? 1 : prev + 1))} sx={{ p: "12px", background: "white", borderRadius: "16px", boxShadow: '4px 8px 60px rgba(0, 0, 0, 0.06)' }}>
            <ChevronRightIcon sx={{ fontSize: "30px" }} />
          </Button>
        </Stack>
      </Stack>
      <Stack direction='row' alignItems='center' spacing={2} sx={{ mt: "40px" }}>
        <Paper sx={{ borderRadius: "32px", height: "215px", width: `${helpState === 1 ? '660px' : '180px'}`, p: "50px 30px" }}>
          <Stack direction='row' alignItems='center' spacing={3}>
            <Typography component='img' src={helpImg1_h} />
            {helpState === 1 &&
              <Box sx={{ width: "410px" }}>
                <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>{t('singleName.learnmore.step1.title')}</Typography>
                <Typography sx={{ fontSize: "16px", fontWeight: "300", color: "#4D4D4D" }}>{t('singleName.learnmore.step1.text')}</Typography>
              </Box>
            }
          </Stack>
        </Paper>
        <Paper sx={{ borderRadius: "32px", height: "215px", width: `${helpState === 2 ? '660px' : '180px'}`, p: "50px 30px" }}>
          <Stack direction='row' alignItems='center' spacing={3}>
            <Typography component='img' src={helpImg2_h} />
            {helpState === 2 &&
              <Box sx={{ width: "410px" }}>
                <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>{t('singleName.learnmore.step2.title')}</Typography>
                <Typography sx={{ fontSize: "16px", fontWeight: "300", color: "#4D4D4D" }}>{t('singleName.learnmore.step2.text')}</Typography>
              </Box>
            }
          </Stack>
        </Paper>
        <Paper sx={{ borderRadius: "32px", height: "215px", width: `${helpState === 3 ? '660px' : '180px'}`, p: "50px 30px" }}>
          <Stack direction='row' alignItems='center' spacing={3}>
            <Typography component='img' src={helpImg3_h} />
            {helpState === 3 &&
              <Box sx={{ width: "410px" }}>
                <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>{t('singleName.learnmore.step3.title')}</Typography>
                <Typography sx={{ fontSize: "14px", fontWeight: "300", color: "#4D4D4D" }}>{t('singleName.learnmore.step3.text')}</Typography>
              </Box>
            }
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  )
}
export default SetupName
