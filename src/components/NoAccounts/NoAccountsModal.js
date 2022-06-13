import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import {
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import { connectProvider, disconnectProvider } from '../../utils/providerUtils'
// import NoAccounts from './NoAccounts'

export default ({ buttonText, className, anchorElUser, setAnchorElUser }) => {
  let [showModal, setShowModal] = useState(false)
  const handleCloseUserMenu = (newValue) => {
    setAnchorElUser(null);
    if (newValue === 0) {
      connectProvider()
    }
    if (newValue === 1) {
      disconnectProvider()
    }
  };

  return (
    <div className={className}>
      {/* <NoAccounts
        colour={colour}
        buttonText={buttonText}
        textColour={textColour}
        active={showModal}
        onClick={onClick}
      /> */}
      {/* <NoAccountsContainer
        colour={colour}
        className={className}
        onClick={onClick}
        active={active}
        textColour={textColour}
      >
        <span>{buttonText}</span>
      </NoAccountsContainer> */}
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={() => handleCloseUserMenu(2)}
      >
        <MenuItem onClick={() => handleCloseUserMenu(buttonText === "Connect" ? 0 : 1)}>
          <Typography textAlign="center">{buttonText}</Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}
