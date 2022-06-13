import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  IconButton
} from '@mui/material'
const HOVER_TIMEOUT = 1000

const CopyContainer = styled('span')`
  margin: 0 5px;
  position: relative;
  &:hover {
    cursor: pointer;
  }
`

const Copied = styled('span')`
  font-size: 16px;
`

export default function Copy({ value, iconColour }) {
  const [copied, setCopied] = useState(false)
  return (
    <CopyContainer>
      {copied ? (
        <Copied>Copied</Copied>
      ) : (
        <CopyToClipboard
          text={value}
          onCopy={() => {
            setCopied(true)
            setTimeout(() => setCopied(false), HOVER_TIMEOUT)
          }}
        >
          <ContentCopyIcon sx={{ color: "rgba(0, 0, 0, 0.25)", fontSize: "15px" }} />
        </CopyToClipboard>
      )}
    </CopyContainer>
  )
}
