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

import React, { FC, useState, useEffect } from 'react';
import ProjectsComponent from './ProjectsComponent';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { Project } from './Types';
import IssuesComponent from './IssuesComponent';
import Keycloak, { KeycloakConfig, KeycloakInstance } from 'keycloak-js';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import allActions from '../ActionsType';

type State = { project: { project: Project }; auth: { token: string } };

const useStyles = makeStyles({
  button: {
    margin: '10px',
    marginLeft: 'auto',
    display: 'flex',
  },
});

const OverviewComponent: FC<{}> = () => {
  const classes = useStyles();
  const typedUseSelector: TypedUseSelectorHook<State> = useSelector;
  const project = typedUseSelector(state => state.project.project);
  const token = typedUseSelector(state => state.auth.token);
  const dispatch = useDispatch();

  const prod = process.env.NODE_ENV !== 'development';
  const config: KeycloakConfig = {
    realm: prod ? 'myrealm' : 'admin',
    url: prod
      ? 'https://keycloak.thibaut.lab.diabol.dev/auth'
      : 'http://localhost:8080/auth/',
    clientId: prod ? 'backstage-dashboard' : 'my-react-client',
  };

  const [authenticated, setAuthenticated] = useState(false);
  // eslint-disable-next-line new-cap
  const [keycloak, setKeycloak] = useState<KeycloakInstance>();

  useEffect(() => {
    // eslint-disable-next-line new-cap
    const kc = Keycloak(config);
    kc.init({ onLoad: 'login-required' }).then((auth: boolean) => {
      setAuthenticated(auth);
      dispatch(allActions.Actions.setKeycloakClient(kc));
    });
    kc.onTokenExpired = () => kc.updateToken(20);
    kc.onAuthRefreshError = () => kc.logout();

    setKeycloak(kc);
  }, []);

  if (keycloak && authenticated && keycloak.token) {
    return (
      <div>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => {
            keycloak.logout();
          }}
        >
          Logout
        </Button>
        {Object.keys(project).length === 0 && <ProjectsComponent />}
        {Object.keys(project).length !== 0 && (
          <IssuesComponent projectKey={project.key} />
        )}
      </div>
    );
  }
  return <div>`Initializing Keycloak... ${token}`</div>;
};

export default OverviewComponent;
