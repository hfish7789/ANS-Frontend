import React from 'react'
import styled from '@emotion/styled/macro'
import {
  Paper,
  Grid,
  Stack,
  Typography,
  Divider,
  Box,
  Button,
} from '@mui/material'
import step1Icon from '../../../assets/Group 2913.png';
import step2Icon from '../../../assets/Group 2912.png';
import step3Icon from '../../../assets/Group 2911.png';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';
const offset = 180

// color: ${p => (p.progress === 100 ? '#42E068' : '#dfdfdf')};
const NumberT = styled('div')`
  font-size: 18px;
  font-weight: 300;
  position: relative;
  width: 38px;
  height: 38px;

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

const SVG = styled('svg')`
  stroke: #ccc;

  circle {
    stroke-dasharray: ${offset};
    stroke-dashoffset: 0;
  }
`

const Content = styled('div')`
  margin-left: 8px;

  h3 {
    margin-top: 2px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    margin-top: 0;
  }
`
// const Empty = () => {

// }

const Step = ({ number, text, title, progress = 100, content, activeNumber, setActiveNumber, waitTime }) => {
  if (progress > 0 && progress < 100) {
    setActiveNumber(number)
  }

  return (
    <Box>
      {!content ?
        <Box>
          <Paper elevation={0} onClick={() => setActiveNumber(number)} sx={{ p: "12px 25px 12px 10%", borderRadius: "16px", background: `${number === activeNumber ? 'rgba(242, 97, 85, 0.05)' : 'transparent'}`, mb: `${number !== 3 ? '30px' : '0'}`, cursor: 'pointer' }}>
            <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ width: "100%" }}>
              <Stack direction='row' alignItems='center'>
                <NumberT progress={progress}>
                  <SVG height="38" width="38" progress={progress}>
                    <circle
                      cx="19"
                      cy="19"
                      r="19"
                      strokeWidth="0"
                      fill={progress === 0 ? (number === activeNumber ? 'white' : 'rgba(242, 97, 85, 0.08)') : '#F26155'}
                      transform="rotate(-90, 19, 19)"
                    />
                  </SVG>
                  <span style={{ color: `${progress === 0 ? (number === activeNumber ? 'black' : '#F26155') : 'white'}` }}>{progress < 100 && progress >= 0 ? number : <DoneIcon sx={{ color: "white", mb: "-6px" }} />}</span>
                </NumberT>
                <Content>
                  <h3>{title}</h3>
                </Content>
              </Stack>
              <ChevronRightIcon sx={{ fontSize: "30px", color: `${number === activeNumber ? '#F26155' : '#BFBFBF'}` }} />
            </Stack>
          </Paper>
        </Box>
        :
        <></>
      }
      {content && number === activeNumber ?
        <Box>
          <Stack direction='row' alignItems='center'>
            {activeNumber === 1 && <Typography component='img' src={step1Icon} />}
            {progress > 0 ?
              <>
                {activeNumber === 2 &&
                  <Stack direction='row' alignItems='flex-start'>
                    <Stack direction='row' alignItems='center' sx={{ zIndex: "12", mt: "15px" }}>
                      <Box className='loader' sx={{ zIndex: "12" }}></Box>
                      <Stack sx={{ ml: "-130px", mr: "10px", zIndex: "12" }} alignItems='center'>
                        <Typography sx={{ fontSize: "48px", fontWeight: 600 }}>{progress.toFixed(0)}</Typography>
                        <Typography sx={{ fontSize: "14px", fontWeight: 600, opacity: "0.25", mt: "-15px" }}>%&nbsp;TO&nbsp;END</Typography>
                      </Stack>
                    </Stack>
                    <Stack direction='row' alignItems='center' sx={{ mt: "-15px" }}>
                      <Box className='loader1' sx={{ zIndex: "1" }}></Box>
                      <Stack sx={{ ml: "-110px", mr: "110px", zIndex: "10" }} alignItems='center'>
                        <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>{(600-progress*6).toFixed(0)}<a sx={{ fontSize: "14px" }}>s</a></Typography>
                        <Typography sx={{ fontSize: "11px", fontWeight: 600, opacity: "0.25", mt: "-8px" }}>TIME&nbsp;LEFT</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                }
              </>
              :
              <>
                {activeNumber === 2 && <Typography component='img' src={step2Icon} sx={{ mr: "50px", ml: "-50px" }} />}
              </>
            }
            {activeNumber === 3 && <Typography component='img' src={step3Icon} />}
            <Box>
              <Typography sx={{ fontSize: "18px", fontWeight: "400", mb: "18px" }}>{activeNumber === 1 && 'Сonfirm the first transactions'}{activeNumber === 2 && 'Processing request'}{activeNumber === 3 && 'Completing transactions'}</Typography>
              {activeNumber === 1 && <Typography sx={{ fontSize: "16px", fontWeight: "300", mb: "62px", opacity: "0.7", maxWidth: "600px", lineHeight: "160%" }}>
                Your wallet will open and you will be asked to <a style={{ color: "#F26155" }}>confirm the first of two transactions</a> required for registration. lf the second transaction is not processed within 7 days of the first, you will need to start again from step 1
              </Typography>}
              {activeNumber === 2 && <Typography sx={{ fontSize: "16px", fontWeight: "300", mb: "62px", opacity: "0.7", maxWidth: "600px", lineHeight: "160%" }}>
                <a style={{ color: "#F26155" }}>The waiting period is required</a> to ensure another person hasn't tried to register the same name and protect you after your request
              </Typography>}
              {activeNumber === 3 && <Typography sx={{ fontSize: "16px", fontWeight: "300", mb: "62px", opacity: "0.7", maxWidth: "600px", lineHeight: "160%" }}>
                Click ‘register’ and your wallet will re-open. Only <a style={{ color: "#F26155" }}>after the 2nd transaction</a> is confirmed you'll know if you got the name
              </Typography>}
              <Stack direction='row' alignItems='center' spacing={2}>
                <Button variant='contained' sx={{ maxWidth: "208px", width: "100%", height: "56px", fontWeight: "500", fontSize: "18px", borderRadius: "16px" }}>Get&nbsp;Started</Button>
                <Button variant='outlined' sx={{ px: "25px", height: "56px", fontWeight: "500", fontSize: "18px", borderRadius: "16px" }}>Learn&nbsp;more&nbsp;about&nbsp;it</Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
        :
        <></>
      }
    </Box>
  )
}

export default Step
