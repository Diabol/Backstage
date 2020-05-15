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

type action = {
  type: string;
  search:Object;
};

// const initialState={title:"Jira Projects", project:{}, issue:{}};

const issues = (state:{index:number,search:{name:string,status:string}} = {index:0,search:{name:'',status:''} } , action: action) => {
  switch (action.type) {
    case 'INCREMENT_INDEX':
      return { ...state, index: state.index+20 };
    case 'DECREMENT_INDEX':
      if(state.index <=20) return { ...state, index: 0 };
      return { ...state, index: state.index-20 };
    case 'CLEAR_INDEX':
      return { ...state, index: 0 };
    case 'SET_SEARCH':
      return { ...state, search:action.search, index:0 };
    case 'CLEAR_SEARCH':
      return { ...state, search:{name:'',status:''} };
    default:
      return state;
  }
};

export default issues;
