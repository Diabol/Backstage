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
import { makeStyles } from '@material-ui/core/styles';
import {Table,TableBody,TableCell,TableContainer,TableRow, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { Progress } from '@backstage/core';
import IssueComponent from './IssueComponent';
import {Issue} from './Types';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import allActions from '../ActionsType';



const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button:{
    margin:"10px"
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});


type IssuesProps = {
  total: number;
  issues: Issue[];
};

type State = {
  issue:{ issue:{index:number}}
};

const DenseTable: FC<IssuesProps> = ({ issues }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const typedUseSelector: TypedUseSelectorHook<State> = useSelector;
  const index = typedUseSelector(state => state.issue.issue.index);
  // eslint-disable-next-line no-console
  // console.log(indexff)

  return (
    <div>
      <TableContainer>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableBody>
            <TableRow>
              <TableCell>
                <Button variant="contained" className={classes.button}
                  onClick={() => {
                    dispatch(allActions.Actions.removeProject());
                    dispatch(allActions.Actions.removeIssue());
                  }}>
                  Back to projects
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <label>index:{index}</label>
                {index > 0 && 
                <Button variant="contained" className={classes.button}
                  onClick={() => {
                    dispatch(allActions.Actions.addIssue({index:index-1}));
                  }}>
                  Previous
                </Button>
                }
                <Button variant="contained" className={classes.button}
                onClick={() => {
                  dispatch(allActions.Actions.addIssue({index:index+1}));
                }}>
                Next
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    <TableContainer>
      <Table className={classes.table} size="small" aria-label="a dense table">
        
        <TableBody>
          {issues.map(issue => (
            <TableRow key={issue.key}>
              <TableCell>
                <IssueComponent issue={issue} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

const IssuesComponent: FC<{ projectKey:string}> = ({projectKey}) => {

  const typedUseSelector: TypedUseSelectorHook<State> = useSelector;
  const index = typedUseSelector(state => state.issue.issue.index);

  // eslint-disable-next-line no-console
  console.log("rerender",index);

  // add som kind of caching for project data.
  // TODO: async not called on re-render...
  // Possible solution: https://dev.to/n1ru4l/homebrew-react-hooks-useasynceffect-or-how-to-handle-async-operations-with-useeffect-1fa8
  const { value, loading, error } = useAsync(async (): Promise<IssuesProps> => {

    const response = await fetch(`http://localhost:3001/issues/${projectKey}?index=${index}`);
    const data = await response.json();
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  
  if(!value) {
    return <DenseTable issues={[]} total={0} />;
  }

  // eslint-disable-next-line no-console
  console.log("rerender",index,value);

  return <DenseTable issues={value.issues || []} total={value.total || 0 } />;
};



export default IssuesComponent;
