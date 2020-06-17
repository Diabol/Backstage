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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { Progress, InfoCard } from '@backstage/core';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import allActions from '../ActionsType';
import {Project} from './Types';
import { KeycloakInstance } from 'keycloak-js';

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


type ProjectsProps = {
  projects: Project[];
};

const DenseTable: FC<ProjectsProps> = ({ projects }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  if (projects ===[] ) return (<div>No projects available!</div>);

  return (
    <InfoCard title="Projects">
      <TableContainer>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Go to project</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map(project => (
              <TableRow key={project.key}>
                <TableCell>
                  <img
                    src={project.avatarUrls['48x48']}
                    className={classes.avatar}
                    alt=""
                  />
                </TableCell>
                <TableCell>
                  <Link component={RouterLink} to="/home">
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <img
                    src={project.lead.avatarUrls['48x48']}
                    className={classes.avatar}
                    alt=""
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => {
                      dispatch(allActions.Actions.addProject(project));
                    }}
                  >
                    Go to Project
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </InfoCard>
  );
};

type State = {
  auth:{keycloakClient: KeycloakInstance };
};

const ProjectsComponent: FC<{}> = () => {
  const typedUseSelector: TypedUseSelectorHook<State> = useSelector;
  const kc = typedUseSelector(state => state.auth.keycloakClient);
  
  const { value, loading, error } = useAsync(async (): Promise<Project[]> => {
    const token = kc.token;
    const options = {
      method:"get",
      ...(kc && token && token !== "" && {headers: {
        "Authorization": `Bearer ${token}`
      }})
    };

    const response = await fetch('http://localhost:3001/projects', options);
    const data = await response.json();
    return data;
  }, [kc]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable projects={value || []} />;
};

export default ProjectsComponent;
