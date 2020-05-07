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


export interface avatarUrls {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': String;
  }

export interface Issue {
    id: string;
    key: string;
    fields: {
      created:string;
      priotiry:{
        name:string;
        iconUrl:string;
      };
      labels:string[];
      assignee:string;
      updated:string;
      status:{
        description:string;
        iconUrl:string;
        statusCategory:{
          name:string;
        };
      };
      components:string[];
      description:string;
      summary:string;
      creator:{
        key:string;
        name:string;
        avatarUrls:avatarUrls;
        displayName:string;
      };
      subtasks:string[];
      reporter:{
        key:string;
        name:string;
        emailAddress:string;
        avatarUrls:avatarUrls;
        displayName:string;
      }
  
  
    };
  }

  export interface Project {
    self: string;
    id: string;
    key: string;
    description: string;
    lead: {
      self: string;
      key: string;
      name: string;
      avatarUrls: avatarUrls;
      displayName: string;
      active: boolean;
    };
    name: string;
    avatarUrls: avatarUrls;
    projectKeys: string[];
    projectTypeKey: string;
  };

