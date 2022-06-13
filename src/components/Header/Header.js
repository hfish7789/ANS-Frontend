import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'

import mq, { useMediaMin, useMediaMax } from 'mediaQuery'
import NetworkInformation from '../NetworkInformation/NetworkInformation'

import DefaultLogo from '../Logo'
import Search from '../SearchName/Search'
import Hamburger from './Hamburger'
import SideNav from '../SideNav/SideNav'
import Banner from '../Banner'

import { hasNonAscii } from '../../utils/utils'

import {
  Paper,
  Stack,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  CssBaseline,
  useScrollTrigger,
  Fab,
  Zoom,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Typography
} from '@mui/material'
import {
  // Search,
  KeyboardArrowUp
} from '@mui/icons-material'

import PropTypes from 'prop-types';

// function HeaderContainer() {
//   const [isMenuOpen, setMenuOpen] = useState(false)
//   const mediumBP = useMediaMin('medium')
//   const mediumBPMax = useMediaMax('medium')
//   const toggleMenu = () => setMenuOpen(!isMenuOpen)
//   const { t } = useTranslation()

//   return (
//     <>
//       <Box isMenuOpen={isMenuOpen}>
//         {/* <Logo isMenuOpen={isMenuOpen} /> */}
//         {mediumBP ? (
//           <SearchHeader />
//         ) : (
//           <Hamburger isMenuOpen={isMenuOpen} openMenu={toggleMenu} />
//         )}
//       </Box>
//       {hasNonAscii() && (
//         <StyledBanner>
//           <StyledBannerInner>
//             <p>
//               ⚠️ <strong>{t('warnings.homoglyph.title')}</strong>:{' '}
//               {t('warnings.homoglyph.content')}{' '}
//               <a
//                 target="_blank"
//                 href="https://en.wikipedia.org/wiki/IDN_homograph_attack"
//                 rel="noreferrer"
//               >
//                 {t('warnings.homoglyph.link')}
//               </a>
//               .
//             </p>
//           </StyledBannerInner>
//         </StyledBanner>
//       )}
//       {mediumBPMax && (
//         <>
//           <SideNav isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
//           <SearchHeader />
//         </>
//       )}
//     </>
//   )
// }

function ScrollTop(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

export default function HeaderContainer(props) {

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar sx={{ zIndex: 1, background: "white" }}>
        <Toolbar>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ ml: "140px", mr: "30px", width: "100%", py: "20px" }}>
            <Search />
            <NetworkInformation />
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Box sx={{ height: `${screen.height- (screen.height*25/100)}px`, overflow: "auto", mt: "46px" }}>
        {props.children}
      </Box>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}