import React from 'react'
import styled from '@emotion/styled/macro'
import { Link, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DELETE_SUBDOMAIN } from 'graphql/mutations'
import { SingleNameBlockies } from '../Blockies'
import Checkbox from '../Forms/Checkbox'
import mq, { useMediaMin } from 'mediaQuery'
import Tooltip from '../Tooltip/Tooltip'
import QuestionMark from '../Icons/QuestionMark'
import { checkIsDecrypted, truncateUndecryptedName } from '../../api/labels'
import ExpiryDate from './ExpiryDate'
import { useMutation } from '@apollo/client'
import Bin from '../Forms/Bin'
import { useEditable } from '../hooks'
import PendingTx from '../PendingTx'
import AddFavourite from '../AddFavourite/AddFavourite'
import {
  Stack,
  TableCell,
  TableRow,
  Typography,
  Chip
} from '@mui/material'
import DoneIcon from '@mui/icons-material/Done';

export default function ChildDomainItem({
  name,
  owner,
  expiryDate,
  isMigrated,
  isFavourite,
  checkedBoxes,
  setCheckedBoxes,
  setSelectAll,
  showBlockies = true,
  canDeleteSubdomain
}) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  let history = useHistory();
  let { t } = useTranslation()
  const smallBP = useMediaMin('small')
  const isDecrypted = checkIsDecrypted(name)
  let label = isDecrypted ? `${name}` : truncateUndecryptedName(name)
  if (isMigrated === false)
    label = label + ` (${t('childDomainItem.notmigrated')})`
  const [mutate] = useMutation(DELETE_SUBDOMAIN, {
    onCompleted: data => {
      startPending(Object.values(data)[0])
    },
    variables: {
      name: name
    }
  })

  return (
    <TableRow
      hover
      key={name}
    >
      <TableCell component="th" scope="row" padding="none">
        <Stack direction='row' alignItems='center' spacing={1}>
          <AddFavourite domain={{ name }} isSubDomain={false} isFavourite={isFavourite} />
          <Typography sx={{ fontSize: "18px" }} onClick={() => history.push(`/name/${name}`)}>{name}</Typography>
        </Stack>
      </TableCell>
      <TableCell align="center" onClick={() => history.push(`/name/${name}`)}>
        {canDeleteSubdomain ? (
          pending && !confirmed ? (
            <PendingTx
              txHash={txHash}
              onConfirmed={() => {
                setConfirmed()
              }}
            />
          ) : (
            <Bin
              data-testid={'delete-name'}
              onClick={e => {
                e.preventDefault()
                mutate()
              }}
            />
          )
        ) : (
          <ExpiryDate name={name} expiryDate={expiryDate} />
        )}
      </TableCell>
      <TableCell align="center" onClick={() => history.push(`/name/${name}`)}>
        <Stack direction='row' alignItems='center' spacing={1} justifyContent='center'>
          <DoneIcon sx={{ color: "#76DC86", fontSize: "18px" }} />
          <Typography sx={{ fontSize: "18px" }}>Enabled</Typography>
        </Stack>
      </TableCell>
      <TableCell align="center" onClick={() => history.push(`/name/${name}`)}>
        <Chip label="Enabled" sx={{ background: "rgba(118, 220, 134, 0.1)", color: "#7DB786", fontSize: "18px" }} />
      </TableCell>
      <TableCell align="center">
        {checkedBoxes && isDecrypted && (
          <Checkbox
            testid={`checkbox-${name}`}
            checked={checkedBoxes[name]}
            onClick={e => {
              e.preventDefault()
              setCheckedBoxes(prevState => {
                return { ...prevState, [name]: !prevState[name] }
              })
              if (checkedBoxes[name]) {
                setSelectAll(false)
              }
            }}
          />
        )}
      </TableCell>
    </TableRow>
    // <DomainLink
    //   showBlockies={showBlockies}
    //   data-testid={`${name}`}
    //   warning={isMigrated === false ? true : false}
    //   key={name}
    //   to={`/name/${name}`}
    // >
    //   {showBlockies && smallBP && (
    //     <SingleNameBlockies imageSize={24} address={owner} />
    //   )}
    //   <AddFavourite
    //     domain={{ name }}
    //     isSubDomain={false}
    //     isFavourite={isFavourite}
    //   />
    //   <h3>{label}</h3>
    //   {canDeleteSubdomain ? (
    //     pending && !confirmed ? (
    //       <PendingTx
    //         txHash={txHash}
    //         onConfirmed={() => {
    //           setConfirmed()
    //         }}
    //       />
    //     ) : (
    //       <Bin
    //         data-testid={'delete-name'}
    //         onClick={e => {
    //           e.preventDefault()
    //           mutate()
    //         }}
    //       />
    //     )
    //   ) : (
    //     <ExpiryDate name={name} expiryDate={expiryDate} />
    //   )}

    //   {!isDecrypted && (
    //     <Tooltip
    //       text="<p>This name is only partially decoded. If you know the name, you can search for it in the search bar to decrypt it and renew</p>"
    //       position="top"
    //       border={true}
    //       offset={{ left: 0, top: 10 }}
    //     >
    //       {({ tooltipElement, showTooltip, hideTooltip }) => {
    //         return (
    //           <div style={{ position: 'relative' }}>
    //             <QuestionMark
    //               onMouseOver={() => {
    //                 showTooltip()
    //               }}
    //               onMouseLeave={() => {
    //                 hideTooltip()
    //               }}
    //             />
    //             &nbsp;
    //             {tooltipElement}
    //           </div>
    //         )
    //       }}
    //     </Tooltip>
    //   )}
    //   {checkedBoxes && isDecrypted && (
    //     <Checkbox
    //       testid={`checkbox-${name}`}
    //       checked={checkedBoxes[name]}
    //       onClick={e => {
    //         e.preventDefault()
    //         setCheckedBoxes(prevState => {
    //           return { ...prevState, [name]: !prevState[name] }
    //         })
    //         if (checkedBoxes[name]) {
    //           setSelectAll(false)
    //         }
    //       }}
    //     />
    //   )}
    // </DomainLink>
  )
}
