import React from 'react'
import styled from '@emotion/styled/macro'
import {
  Paper,
  Stack,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
// const NoAccountsContainer = styled('div')`
//   box-shadow: ${({ active }) =>
//     active ? '0 -10px 30px 0 rgba(108, 143, 167, 0.05)' : 'none'};
//   padding: 5px 20px;
//   border-bottom: 1px solid
//     ${({ active, colour }) => (active ? '#F5A623' : colour)};
//   border-top: ${({ active, colour }) =>
//     `1px solid ${active ? '#fff' : colour}`};
//   border-left: ${({ active, colour }) =>
//     `1px solid ${active ? '#fff' : colour}`};
//   border-right: ${({ active, colour }) =>
//     `1px solid ${active ? '#fff' : colour}`};
//   border-radius: ${({ active }) => (active ? '6px 6px 0 0' : '6px')};
//   background: ${({ active }) => (active ? 'white' : 'transparent')};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: relative;
//   width: ${({ active }) => (active ? '150px' : '150px')};
//   transition: 0.2s;

//   span {
//     color: ${({ active, colour }) => (active ? '#F5A623' : colour)};
//   }

//   &:hover {
//     cursor: ${({ onClick }) => (onClick ? 'pointer' : 'auto')};
//   }
// `
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const handleCloseUserMenu = () => {
  setAnchorElUser(null);
};
const handleOpenUserMenu = (event) => {
  setAnchorElUser(event.currentTarget);
};

const NoAccounts = ({
  className,
  colour = '#282929',
  textColour,
  onClick,
  buttonText,
  active,
  anchorElUser
}) => (
  // <NoAccountsContainer
  //   colour={colour}
  //   className={className}
  //   onClick={onClick}
  //   active={active}
  //   textColour={textColour}
  // >
  //   <span>{buttonText}</span>
  // </NoAccountsContainer>
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
    onClose={handleCloseUserMenu}
  >
    {settings.map((setting) => (
      <MenuItem key={setting} onClick={handleCloseUserMenu}>
        <Typography textAlign="center">{setting}</Typography>
      </MenuItem>
    ))}
  </Menu>
)

export default NoAccounts
