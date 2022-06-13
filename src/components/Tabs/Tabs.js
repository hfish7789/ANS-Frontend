import React from 'react'
import styled from '@emotion/styled/macro'

export const Tab = styled('div')`
  font-size: 18px;
  font-weight: 500;
  background: ${({ active }) => (active ? '#F26155' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#F26155')};
  transform: scale(${({ active }) => (active ? '1.02' : '1')});
  transition: background 0.1s ease-out, transform 0.3s ease-out;
  padding: 15px 60px;
  border-radius: 16px;
  &:hover,
  &:visited {
    cursor: pointer;
    color: ${({ active }) => (active ? 'white' : '#F26155')};
  }
`

export const TabsContainer = styled('div')`
  display: inline-flex;
  justify-content: flex-start;
  border: 1px solid #F26155;
  border-radius: 16px;
`

export const Tabs = props => {
  return (
    <div>
      <TabsContainer>{props.children}</TabsContainer>
    </div>
  )
}
