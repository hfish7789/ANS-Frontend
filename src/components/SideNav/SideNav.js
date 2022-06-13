import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import Header from '../Header/Header'

import Heart from '../Icons/Heart'
import File from '../Icons/File'
import {
  Person,
  PersonOutline,
  Bookmark,
  BookmarkBorder,
  LiveHelpOutlined,
  LiveHelp,
  Info,
  InfoOutlined
} from '@mui/icons-material'
import {
  Tabs,
  Tab,
  Box,
  Button
} from '@mui/material'
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

import mystyle from '@mui/material/styles/styled'
import { aboutPageURL, hasNonAscii } from '../../utils/utils'
import SpeechBubble from '../Icons/SpeechBubble'
import user_o from '../../assets/user-o.png'
import hand from '../../assets/hand.png'
import user_f from '../../assets/user-f.png'
import quote_o from '../../assets/quote-o.png'
import quote_f from '../../assets/quote-f.png'
import bookmark_o from '../../assets/bookmark-o.png'
import bookmark_f from '../../assets/bookmark-f.png'
import info_o from '../../assets/info-o.png'

import mq from 'mediaQuery'
import { Link, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { isENSReady } from '../../apollo/reactiveVars'

const SideNavContainer = styled('nav')`
  display: ${p => (p.isMenuOpen ? 'block' : 'none')};
  position: fixed;
  z-index: 1;
  ${mq.medium`
    z-index: 1;
  `}
  
  left: 0;
  height: auto;
  background: #121d46;
  width: 100%;
  ${mq.medium`
    padding: 0;
    height: auto;
    background: transparent;
    width: 100%;
    display: block;
  `}

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
  }
`
function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
      sx={{ height: "80px", py: "10px", my: '6px' }}
    />
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const SIDENAV_QUERY = gql`
  query getSideNavData {
    accounts
    isReadOnly
  }
`

const TabButton = mystyle(Button)(() => ({
  padding: "19px 21px",
  margin: "0 10px",
  height: "65px",
  background: "rgba(242, 97, 85, 0.06)",
  borderRadius: "20px",
}));

function SideNav({ match, isMenuOpen, toggleMenu, children }) {
  const { url } = match
  const { t } = useTranslation()
  const {
    data: { accounts, isReadOnly }
  } = useQuery(SIDENAV_QUERY)
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <SideNavContainer isMenuOpen={isMenuOpen} hasNonAscii={hasNonAscii()}>
      {/* <NetworkInformation /> */}
      <Box dataTestid="sitenav" sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
        <Tabs
          orientation="vertical"
          sx={{ borderRight: 1, borderColor: 'divider', pt: "150px", background: "white", zIndex: 100 }}
          value={value}
          onChange={handleChange}
        >
          {accounts?.length > 0 && !isReadOnly ? (
            <LinkTab
              onClick={toggleMenu}
              icon={value === 0 ? <TabButton><Typography component='img' src={user_f} /></TabButton> : <Link to={'/address/' + accounts[0]}><Box sx={{ p: "20px 25px" }}><Typography component='img' src={user_o} /></Box></Link>}
              {...a11yProps(0)}
            />
          ) : null}
          <LinkTab
            onClick={toggleMenu}
            icon={(value === (accounts?.length > 0 && !isReadOnly ? 1 : 0)) ? <TabButton><Typography component='img' src={bookmark_f} /></TabButton> : <Link to="/favourites"><Box sx={{ p: "20px 25px" }}><Typography component='img' src={bookmark_o} /></Box></Link>}
            {...a11yProps(1)}
          />
          <LinkTab
            onClick={toggleMenu}
            icon={(value === (accounts?.length > 0 && !isReadOnly ? 2 : 1)) ? <TabButton><Typography component='img' src={quote_f} /></TabButton> : <Link to="/faq"><Box sx={{ p: "20px 25px" }}><Typography component='img' src={quote_o} /></Box></Link>}
            {...a11yProps(2)}
          />
          <LinkTab
            icon={(value === (accounts?.length > 0 && !isReadOnly ? 3 : 2)) ? <TabButton><Info /></TabButton> : <Typography component='img' src={info_o} />}
            {...a11yProps(3)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Header>{children}</Header>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Header>{children}</Header>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Header>{children}</Header>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Header>{children}</Header>
        </TabPanel>
      </Box>
    </SideNavContainer>
  )
}
export default withRouter(SideNav)