/* eslint-disable react/prop-types */
/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC } from 'react';
import {Theme,  makeStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelSummary,ExpansionPanelDetails,Typography, Table, TableBody, TableCell, TableContainer, TableRow} from '@material-ui/core';
// import {Table, TableBody, TableCell, TableContainer, TableRow} from '@material-ui/core';
import {Issue} from './Types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

/*
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});
*/

const useStyles = makeStyles((theme:Theme) => ({
  root: {
    width: '100%',
  },
  table: {
    minWidth: 650,
  },
  tableRow: {
    minWidth: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
  }
}));

type IssueProps = {
  issue: Issue;
};

const DenseTable: FC<IssueProps> = ({ issue }) => {
  const classes = useStyles();
  // const dispatch = useDispatch();
  return (
  <div className={classes.root}>
    <ExpansionPanel>
    <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{`Issue ${issue.key}`}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
    <TableContainer>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableBody>
          <TableRow key="summary" className={classes.tableRow}>
            <TableCell>
              Summary:{` ${issue.fields.summary}`}
            </TableCell>
          </TableRow>
          <TableRow key="bla" className={classes.tableRow}>
            <TableCell>
              Creator:{` ${issue.fields.creator.displayName}`}
            </TableCell>
            <TableCell>
              Reporter:{` ${issue.fields.reporter.displayName}`}
            </TableCell>
            <TableCell>
              Assignee:{` ${issue.fields.assignee}`}
            </TableCell>
          </TableRow>
          <TableRow key="desc" className={classes.tableRow}>
            <TableCell>
              Description:{` ${issue.fields.description}`}
            </TableCell>
          </TableRow>
          <TableRow key="status" className={classes.tableRow}>
            <TableCell>
              Status:{` ${issue.fields.status.statusCategory}`}
            </TableCell>
            <TableCell>
              Priority:{` ${issue.fields.priotiry}`}
            </TableCell>
          </TableRow>
          <TableRow key="created" className={classes.tableRow}>
            <TableCell>
              Created:{` ${issue.fields.created}`}
            </TableCell>
            <TableCell>
              Updated:{` ${issue.fields.updated}`}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </ExpansionPanelDetails>
    </ExpansionPanel>
    {
      /*
    <TableContainer>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableBody>
            <TableRow key={issue.key}>
              <TableCell>
                hjhjh
              </TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>*/
}
  </div>
  );
};

const IssueComponent: FC<{ issue:Issue }> = ({issue}) => {
  // Issue object från issues componenten

  return <DenseTable issue={issue || {}} />;
};

export default IssueComponent;
