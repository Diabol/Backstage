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

import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table,TableBody,TableCell,TableContainer,TableRow, Button, Select, InputLabel, FormControl, MenuItem} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { Progress } from '@backstage/core';
import IssueComponent from './IssueComponent';
import {Issue, User, Status} from './Types';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import allActions from '../ActionsType';
import { KeycloakInstance } from 'keycloak-js';


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
  users: User[];
  statuses:Status[];
};

type State = {
  issues:{index:number,search:{name:string,status:string}};
  auth:{keycloakClient:KeycloakInstance};
};

const DenseTable: FC<IssuesProps> = ({ issues, users, statuses }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const typedUseSelector: TypedUseSelectorHook<State> = useSelector;
  const index = typedUseSelector(state => state.issues.index);
  const search = typedUseSelector(state => state.issues.search);

  const [name, setName] = useState(search.name);
  const [status, setStatus] = useState(search.status);
  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as string);
  };
  const handleNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setName(event.target.value as string);
  };
  

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
                    dispatch(allActions.Actions.clearIssuesIndex());
                  }}>
                  Back to projects
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <FormControl variant="filled"  margin='dense' >
                  <InputLabel id="name-dropdown" >Assignee</InputLabel>
                  <Select
                    labelId="name-dropdown"
                    id="name-dropdown-filled"
                    value={name}
                    onChange={handleNameChange}
                    autoWidth
                    MenuProps={{ style: {maxHeight: 500, minWidth:150} }}
                    style={{minWidth:120}}
                  >
                    <MenuItem value="" key='None'>
                      <em>None</em>
                    </MenuItem>
                    {users.map((user)=> (
                      <MenuItem value={user.key} key={user.key} >{`${user.displayName} ${user.emailAddress}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="filled" margin='dense' > 
                  <InputLabel id="status-dropdown" >Status</InputLabel>
                  <Select
                    labelId="status-dropdown"
                    id="status-dropdown-filled"
                    value={status}
                    onChange={handleStatusChange}
                    autoWidth
                    MenuProps={{ style: {maxHeight: 500, minWidth:100} }}
                    style={{minWidth:'100px'}}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {
                      statuses.map((element)=>(
                      <MenuItem value={element.name} key={element.name}>{element.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                <Button variant="contained" className={classes.button}
                  onClick={() => {
                      dispatch(allActions.Actions.setIssuesSearch({name:name.trim(),status:status.trim()}));
                      // TODO: send filter queries to api
                    // eslint-disable-next-line no-console
                    console.log("bla",{status, name})
                  }}>
                  Search
                </Button>
              </TableCell>
              <TableCell>
                {index > 0 && 
                <Button variant="contained" className={classes.button}
                  onClick={() => {
                    dispatch(allActions.Actions.decrementIssuesIndex());
                  }}>
                  Previous
                </Button>
                }
                <Button variant="contained" className={classes.button}
                onClick={() => {
                  dispatch(allActions.Actions.incrementIssuesIndex());
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
  const index = typedUseSelector(state => state.issues.index);
  const search = typedUseSelector(state => state.issues.search);
  const kc = typedUseSelector(state => state.auth.keycloakClient);
  
  // add som kind of caching for project data?
  const { value, loading, error } = useAsync(async (): Promise<IssuesProps> => {
    const name = search.name !== '' ? `&name=${search.name}` : ''; 
    const status = search.status !== '' ? `&status=${search.status}` : '';
    const token = kc.token;
    
    const options = {
      method:"get",
      ...(kc && token && token !== "" && {headers: {
        "Authorization": `Bearer ${token}`
      }})
    };

    const issues = await fetch(`http://localhost:3001/issues/${projectKey}?index=${index}${name}${status}`,options);
    const issuesData = await issues.json();

    const users = await fetch(`http://localhost:3001/users`,options);
    const usersData = await users.json();

    const statuses = await fetch(`http://localhost:3001/statuses`,options);
    const statusesData = await statuses.json();

    return {total:issuesData.total, issues:issuesData.issues, users:usersData, statuses:statusesData} as IssuesProps;
  }, [index,search,kc]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  
  if(!value) {
    return <DenseTable issues={[]} total={0} users={[]} statuses={[]}/>;
  }

  return <DenseTable issues={value.issues || []} total={value.total || 0 } users={value.users || []} statuses={value.statuses || []} />;
};



export default IssuesComponent;
