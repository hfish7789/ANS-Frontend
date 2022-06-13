import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'

import mq from 'mediaQuery'

const TabLink = styled(Link)`
  font-size: 18px;
  background: ${({ active }) => (active ? 'white' : 'rgba(242, 97, 85, 0.15)')};
  color: ${({ active }) => (active ? '#000000' : '#ffffff')};
  padding-top: 15px;
  padding-bottom: 15px;
  font-weight: 500;
  width: 50%;
  text-align: center;
  ${mq.small`
    padding-top: 15px;
    padding-bottom: 15px;
  `}
  &:visited {
    color: ${({ active }) => (active ? '#000000' : '#ffffff')};
  }
  border-radius: 16px;
`

const TabContainer = styled('div')`
  display: inline-flex;
  justify-content: flex-start;
  border-radius: 16px;
  margin-top: 20px;
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  ${mq.small`
    margin-right: 0;
    margin: 0;
  `}
`
function getDetailsActive(domain, pathname, tab) {
  const { name } = domain
  if (domain.parent !== 'eth') {
    return (
      pathname !== `/name/${name}/register` &&
      pathname !== `/name/${name}/subdomains`
    )
  } else {
    return (
      (tab === 'details' || pathname === `/name/${name}/details`) &&
      (pathname !== `/name/${name}/register` &&
        pathname !== `/name/${name}/subdomains`)
    )
  }
}
const Tabs = ({ domain, pathname, parent, tab }) => {
  const { t } = useTranslation()
  const { name, state } = domain
  return (
    (state !== 'Auction' || state !== 'Reveal') && (
      <TabContainer>
        {parent === 'eth' && (
          <TabLink
            active={
              (tab === 'register' || pathname === `/name/${name}/register`) &&
              (pathname !== `/name/${name}/details` &&
                pathname !== `/name/${name}/subdomains`)
            }
            to={`/name/${name}/register`}
          >
            {t('singleName.tabs.register')}
          </TabLink>
        )}

        <TabLink
          active={getDetailsActive(domain, pathname, tab)}
          to={`/name/${name}/details`}
        >
          {t('singleName.tabs.details')}
        </TabLink>
        <TabLink
          active={pathname === `/name/${name}/subdomains`}
          to={`/name/${name}/subdomains`}
        >
          {t('singleName.tabs.subdomains')}
        </TabLink>
      </TabContainer>
    )
  )
}
export default Tabs
