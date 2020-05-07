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
import ProjectsComponent from './ProjectsComponent';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import {Project} from './Types';
// import allActions from '../ActionsType';
import IssuesComponent from './IssuesComponent';
//  import { makeStyles } from '@material-ui/core/styles';

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



type State = { project: {project:Project} };

const OverviewComponent: FC<{}> = () => {
  //  const classes = useStyles();
  const typedUseSelector: TypedUseSelectorHook<State> = useSelector;
  const project = typedUseSelector(state => state.project.project);
  
  /*
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(allActions.Actions.addTitle('Jira projects!!'));
  }, []);
  */

  return (
    <div>
      {Object.keys(project).length ===0 && <ProjectsComponent />}
      {Object.keys(project).length !==0 && <IssuesComponent projectKey={project.key} />}
    </div>
  );
};

export default OverviewComponent;
