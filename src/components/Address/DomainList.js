import React from 'react'
import styled from '@emotion/styled/macro'

import DomainItem from '../DomainItem/ChildDomainItem'
import {
  Divider,
  Typography
} from '@mui/material'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

const NoDomainsContainer = styled('div')`
  display: flex;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 6px;
  margin-bottom: 40px;

  h2 {
    color: #adbbcd;
    font-weight: 100;
    margin-bottom: 0;
    padding: 0;
    margin-top: 20px;
    text-align: center;
    max-width: 500px;
  }

  p {
    color: #2b2b2b;
    font-size: 18px;
    font-weight: 300;
    margin-top: 20px;
    line-height: 1.3em;
    text-align: center;
    max-width: 400px;
  }
`

const DomainsContainer = styled('div')`
  margin-top: 20px;
  padding-bottom: 30px;
  padding-left: 60px;
  padding-right: 40px;
`

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Subdomain',
    isSort: true
  },
  {
    id: 'expiryDate',
    numeric: true,
    disablePadding: false,
    label: 'Next Due',
    isSort: true
  },
  {
    id: 'autoRenew',
    numeric: false,
    disablePadding: false,
    label: 'Auto Renew',
    isSort: false
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
    isSort: false
  },
  {
    id: 'select',
    numeric: false,
    disablePadding: false,
    label: 'Select',
    isSort: false
  },
];

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(orderBy === "expiryDate" ? a : a.domain, orderBy === "expiryDate" ? b : b.domain, orderBy)
    : (a, b) => -descendingComparator(a.domain, b.domain, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === "name" ? 'left' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.isSort ?
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                sx={{ mr: "-20px" }}
              >
                <Typography sx={{ fontSize: "18px", fontWeight: 400, opacity: 0.5 }}>{headCell.label}</Typography>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
              :
              <Typography sx={{ fontSize: "18px", fontWeight: 400, opacity: 0.5 }}>{headCell.label}</Typography>
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function DomainList({
  favourites = [],
  address,
  activeSort,
  activeFilter,
  checkedBoxes,
  setCheckedBoxes,
  setSelectAll,
  domains,
  showBlockies
}) {
  if (!domains || domains.length === 0) {
    return (
      <NoDomainsContainer>
        <h2>This address does not own any domains</h2>
      </NoDomainsContainer>
    )
  }

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <DomainsContainer>
      <Divider />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(domains, getComparator(order, orderBy))
              .map((row, index) => {
                const isFavourite = favourites.map(m => m.name).includes(row.domain.name)
                return (
                  <DomainItem
                    key={row.domain.name}
                    name={row.domain.name}
                    owner={address}
                    domain={row.domain}
                    expiryDate={row?.expiryDate}
                    labelName={row.domain.labelName}
                    labelhash={row.domain.labelhash}
                    parent={row.domain.parent.name}
                    checkedBoxes={activeFilter === 'registrant' ? checkedBoxes : null}
                    setCheckedBoxes={
                      activeFilter === 'registrant' ? setCheckedBoxes : null
                    }
                    setSelectAll={setSelectAll}
                    showBlockies={showBlockies}
                    isFavourite={isFavourite}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </DomainsContainer>
  )
}
