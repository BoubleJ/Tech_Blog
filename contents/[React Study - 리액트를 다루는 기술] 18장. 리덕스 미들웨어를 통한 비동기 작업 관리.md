---
date: "2024-03-13"
title: "[React Study - 리액트를 다루는 기술] 18장. 리덕스 미들웨어를 통한 비동기 작업 관리"
categories: ["ReactStudy", "React"]
summary: "이번 포스팅은 리덕스 미들웨어를 통한 비동기 작업 관리에 대해 알아보겠습니다. 이번 챕터도 마찬가지로 '미들웨어'라는 생소한 내용이 나왔기에 서적 내용을 공부해보도록하겠습니다. "
thumbnail: "./image-57.png"
---

이번 포스팅은 리덕스 미들웨어를 통한 비동기 작업 관리에 대해 알아보겠습니다. 이번 챕터도 마찬가지로 '미들웨어'라는 생소한 내용이 나왔기에 서적 내용을 공부해보도록하겠습니다.




먼저 리덕스를 위한 코드를 준비해줍니다.

```js
//modules/counter.js

import { createAction, handleActions } from "redux-actions";

const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

const initialState = 0; // 상태는 꼭 객체일 필요 없습니다. 숫자도 작동해요.

const counter = handleActions(
  {
    [INCREASE]: (state) => state + 1,
    [DECREASE]: (state) => state - 1,
  },
  initialState
);

export default counter;
```

```js
//modules/index.js

import { combineReducers } from "redux";
import counter from "./counter";

const rootReducer = combineReducers({
  counter,
});

export default rootReducer;
```

```js
//index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { legacy_createStore as createStore } from "redux";
import rootReducer from "./modules";
import { Provider } from "react-redux";

const store = createStore(rootReducer);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
```

어김없이 createStore는 퇴물 함수라 쓰지말라지만 일단 사용해봅시다. 원리를 이해하는 것이 중요하니까요~

이제 카운터 컴포넌트와 카운터 컨테이너 컴포넌트를 만들어줍니다.

```js
//components/Counter.js
import React from "react";

const Counter = ({ onIncrease, onDecrease, number }) => {
  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
};

export default Counter;
```

```js
//containers/CounterContainer.js

import React from "react";
import { connect } from "react-redux";
import { increase, decrease } from "../modules/counter";
import Counter from "../components/Counter";

const CounterContainer = ({ number, increase, decrease }) => {
  return (
    <Counter number={number} onIncrease={increase} onDecrease={decrease} />
  );
};

export default connect(
  (state) => ({
    number: state.counter,
  }),
  {
    increase,
    decrease,
  }
)(CounterContainer);
```

# 미들웨어(Middleware)란?

이제 본격적으로 미들웨어가 뭔지 알아봅시다.

리덕스 미들웨어는 액션을 디스패치 했을 때 리듀서에 이를 처리하기에 앞서 사전이 지정된 작업들을 실행합니다. 액션과 리듀서 사이의 중간자라고 볼 수 있습니다.

실제 개발을 하면서 미들웨어를 직접 만들 일은 거의 없지만 이번엔 교재를 따라가면서 직접 만드는 시간을 가져보겠습니다.

```js
//lib/loggerMiddleware.js

const loggerMiddleware = (store) => (next) => (action) => {};

export default loggerMiddleware;
```

미들웨어의 기본구조입니다.
위 코드를 function 키워드로 풀어서 작성하면 다음과 같습니다.

```js
const loggerMiddleware = function loggerMiddleware(store) {
  return function (next) {
    return function (action) {};
  };
};
```

즉 미들웨어는 함수를 반환하는 함수를 반환하는 함수입니다. 말장난도 아니고 어질어질하네요.

![](https://velog.velcdn.com/images/dogmnil2007/post/04835826-3554-49d9-9cc2-ffa8e0438934/image.png)
위 그림은 미들웨어 동작 원리를 도식화한 것입니다.
미들웨어 내부에서 store.dispatch를 사용하면 첫 번째 미들웨어부터 다시 처리합니다. 만약 미들웨어에서 next를 사용하지 않으면 액션이 리듀서에 전달되지 않습니다. 즉 액션이 무시됩니다.

이제 자세히 알아봅시다. 미들웨어를 마저 구현한 모습입니다.

```js
//loggerMidderware.js
const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action && action.type); // 액션 타입으로 log 를 그룹화함
  console.log("이전 상태", store.getState());
  console.log("액션", action);
  next(action); // 다음 미들웨어 혹은 리듀서에게 전달
  console.log("다음 상태", store.getState()); // 업데이트 된 상태
  console.groupEnd(); // 그룹 끝
};

export default loggerMiddleware;
```

미들웨어는 스토어를 생성하는 과정에서 적용합니다.

```js
//index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import loggerMiddleware from "./lib/loggerMiddleware";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import rootReducer from "./modules";
import { Provider } from "react-redux";

const store = createStore(rootReducer, applyMiddleware(loggerMiddleware));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
```

![](https://velog.velcdn.com/images/dogmnil2007/post/7cb187f5-1a56-4abb-889a-2319163c7bfb/image.png)

콘솔에 무언가가 잘 찍히는 것을 확인할 수 있습니다.

## redux-logger 활용

redux-logger 라는 친구를 사용해봅시다. 방금 만든 loggerMidderware보다 더 좋다고 합니다.

```js
//index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import rootReducer from "./modules";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";

const logger = createLogger();
const store = createStore(rootReducer, applyMiddleware(logger));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
```

![](https://velog.velcdn.com/images/dogmnil2007/post/3cb6a8a4-f5e7-4bfe-8fb6-6bde3d041120/image.png)
콘솔이 좀 더 이쁘게 찍히네요ㅎㅎ 액션 디스패치 시간도 나타나고 여러 부가 기능이 있는 듯 합니다.

## redux-thunk

redux-thunk는 리덕스를 사용하는 프로젝트에서 비동기 작업을 처리할 때 가장 기본적으로 사용하는 미들웨어 입니다.
여기서 Thunk란 특정 작업을 나중에 할 수 있도록 미루기 위해 함수 형태로 감싼 것을 의미합니다.

```js
//index.js

생략;

import { thunk } from "redux-thunk";

const logger = createLogger();
const store = createStore(rootReducer, applyMiddleware(logger, thunk));

생략;
```

위 코드를 추가해 스토어를 만들 때 redux-thunk를 적용해줍니다.

redux-thunk는 액션 생성 함수에서 일반 액션 객체를 반환하지않고 함수를 반환합니다. 즉 중간에 어떠한 과정을 하나 더 거치도록 함수를 반환하고 그 함수가 실행되든 뭐하든 어떠한 작업을 거친 뒤에 액션 객체가 나오거나 디스패치가 취소되거나 하는 것이죠.

카운터값을 비동기적으로 수행하도록 변경해줍니다. 리덕스 모듈을 수정해줍시다.

```js
//modules/counter.js

import { createAction, handleActions } from "redux-actions";

const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

//1초 뒤 increase 혹은 decrease 함수를 디스패치함
export const increaseAsync = () => (dispatch) => {
  setTimeout(() => {
    dispatch(increase());
  }, 1000);
};
export const decreaseAsync = () => (dispatch) => {
  setTimeout(() => {
    dispatch(decrease());
  }, 1000);
};

const initialState = 0; // 상태는 꼭 객체일 필요 없습니다. 숫자도 작동해요.

const counter = handleActions(
  {
    [INCREASE]: (state) => state + 1,
    [DECREASE]: (state) => state - 1,
  },
  initialState
);

export default counter;
```

CounterContainer에서 호출하던 액션 생성 함수도 변경해줍니다.

```js
//container/CounterContainer.js

import React from "react";
import { connect } from "react-redux";
import { increaseAsync, decreaseAsync } from "../modules/counter";
import Counter from "../components/Counter";

const CounterContainer = ({ number, increaseAsync, decreaseAsync }) => {
  return (
    <Counter
      number={number}
      onIncrease={increaseAsync}
      onDecrease={decreaseAsync}
    />
  );
};

export default connect(
  (state) => ({
    number: state.counter,
  }),
  {
    increaseAsync,
    decreaseAsync,
  }
)(CounterContainer);
```

이제 브라우저에서 버튼을 눌러 1초뒤에 작업이 수행되는지 확인해봅시다.
액션 기록을 콘솔을 통해 확인해봅시다.
![](https://velog.velcdn.com/images/dogmnil2007/post/3e64e3a7-c156-4e20-b2fa-499e44776f10/image.png)
아주 잘 되네요ㅎㅎ

처음 디스패치 되는 액션은 함수형태, 두번째 액션은 객체 형태 입니다.

### 웹 비동기 요청 작업 처리

이제 api를 불러와보겠습니다.

```js
//lib/api.js
import axios from "axios";

export const getPost = (id) =>
  axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);

export const getUsers = (id) =>
  axios.get(`https://jsonplaceholder.typicode.com/users`);
```

새로운 리듀서 sample 리듀서를 만들어줍시다.
api에서 데이터를 받아와 상태를 관리할 리듀서입니다.

```js
//modules/sample.js

import { handleActions } from "redux-actions";
import * as api from "../lib/api";

// 액션 타입들을 선언합니다.
const GET_POST = "sample/GET_POST";
const GET_POST_SUCCESS = "sample/GET_POST_SUCCESS";
const GET_POST_FAILURE = "sample/GET_POST_FAILURE";

const GET_USERS = "sample/GET_USERS";
const GET_USERS_SUCCESS = "sample/GET_USERS_SUCCESS";
const GET_USERS_FAILURE = "sample/GET_USERS_FAILURE";

export const getPost = (id) => async (dispatch) => {
  dispatch({ type: GET_POST });
  try {
    const response = await api.getPost(id);
    dispatch({
      type: GET_POST_SUCCESS,
      payload: response.data,
    }); //요청 성공
  } catch (e) {
    dispatch({ type: GET_POST_FAILURE, payload: e, error: true });
    throw e; //나중에 컴포넌트단에서 에러를 조회 가능하게 해줌
  }
};

export const getUsers = (id) => async (dispatch) => {
  dispatch({ type: GET_USERS });
  try {
    const response = await api.getUsers();
    dispatch({
      type: GET_USERS_SUCCESS,
      payload: response.data,
    }); //요청 성공
  } catch (e) {
    dispatch({ type: GET_USERS_FAILURE, payload: e, error: true });
    throw e; //나중에 컴포넌트단에서 에러를 조회 가능하게 해줌
  }
};

//초기상태 선언

const initialState = {
  loading: {
    GET_POST: false,
    GET_USERS: false,
  },
  post: null,
  users: null,
};

const sample = handleActions(
  {
    [GET_POST]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: true, //요청 시작
      },
    }),

    [GET_POST_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: false, //요청 완료
      },
      post: action.payload,
    }),

    [GET_POST_FAILURE]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: false, //요청 완료
      },
      post: action.payload,
    }),

    [GET_USERS]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: true, //요청 시작
      },
    }),

    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: false, //요청 완료
      },
      users: action.payload,
    }),

    [GET_USERS_FAILURE]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: true, //요청 완료
      },
      users: action.payload,
    }),
  },
  initialState
);

export default sample;
```

다 작성했다면 해당 리듀서를 루트 리듀서에 포함시키세요.

```js
//modules/index.js

import { combineReducers } from "redux";
import counter from "./counter";
import sample from "./sample";

const rootReducer = combineReducers({
  counter,
  sample,
});

export default rootReducer;
```

이제 데이터를 렌더링할 프레젠테이션 컴포넌트를 만들어줍니다.

```js
//components/Sample.js

import React from "react";

const Sample = ({ post, users, loadingPost, loadingUsers }) => {
  return (
    <div>
      <section>
        <h1>포스트</h1>
        {loadingPost && "로딩중..."}
        {!loadingPost && post && (
          <div>
            <h3>{post.title}</h3>
            <h3>{post.body}</h3>
          </div>
        )}
      </section>
      <hr />
      <section>
        <h1>사용자 목록</h1>
        {loadingUsers && "로딩중..."}
        {!loadingUsers && users && (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.username} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Sample;
```

이제 컨테이너 컴포넌트를 만들어줍니다.

```js
//containers/SampleContainer.js
import React from "react";
import { connect } from "react-redux";
import Sample from "../components/Sample";
import { getPost, getUsers } from "../modules/sample";

const { useEffect } = React;
const SampleContainer = ({
  getPost,
  getUsers,
  post,
  users,
  loadingPost,
  loadingUsers,
}) => {
  // 클래스 형태 컴포넌트였더라면, componentDidMount
  useEffect(() => {
    getPost(1);
    getUsers(1);
  }, [getPost, getUsers]);
  return (
    <Sample
      post={post}
      users={users}
      loadingPost={loadingPost}
      loadingUsers={loadingUsers}
    />
  );
};

export default connect(
  ({ sample }) => ({
    post: sample.post,
    users: sample.users,
    loadingPost: sample.loading.GET_POST,
    loadingUsers: sample.loading.GET_USERS,
  }),
  {
    getPost,
    getUsers,
  }
)(SampleContainer);
```

이제 app 컴포넌트에서 SampleContainer를 렌더링해봅시다.

![](https://velog.velcdn.com/images/dogmnil2007/post/0c538e5c-3f53-45ba-bcfe-1868b2c38cb4/image.png)

다 좋지만 코드 가독성이 너무 구립니다. 리팩토링이 시급해 보입니다.

지금 만드는 유틸 함수는 api 요청을 해주는 thunk 함수를 한줄로 생성할 수 있게 해줍니다.

```js
//lib/createRequestThunk.js
export default function createRequestThunk(type, request) {
  // 성공 및 실패 액션 타입을 정의합니다.
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return (params) => async (dispatch) => {
    dispatch({ type }); // 시작됨
    try {
      const response = await request(params);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      }); // 성공
    } catch (e) {
      dispatch({
        type: FAILURE,
        payload: e,
        error: true,
      }); // 에러 발생
      throw e;
    }
  };
}

// 사용법: createRequestThunk('GET_USERS',api.getUsers);
```

이제 thunk 함수를 대체해봅시다.

```js
//modules/sample.js

생략;

// export const getPost = id => async dispatch => {
//     dispatch({type : GET_POST});
//     try {
//         const response = await api.getPost(id);
//         dispatch({
//             type : GET_POST_SUCCESS,
//             payload : response.data
//         })//요청 성공

//     }
//     catch (e) {
//         dispatch({type : GET_POST_FAILURE,
//         payload : e,
//     error : true})
//     throw e //나중에 컴포넌트단에서 에러를 조회 가능하게 해줌
//     }
// }

// export const getUsers = id => async dispatch => {
//     dispatch({type : GET_USERS});
//     try {
//         const response = await api.getUsers();
//         dispatch({
//             type : GET_USERS_SUCCESS,
//             payload : response.data
//         })//요청 성공

//     }
//     catch (e) {
//         dispatch({type : GET_USERS_FAILURE,
//         payload : e,
//     error : true})
//     throw e //나중에 컴포넌트단에서 에러를 조회 가능하게 해줌
//     }
// }

//위 주석처리한 내용을 밑 2줄로 작성한 겁니다.

export const getPost = createRequestThunk(GET_POST, api.getPost);
export const getUsers = createRequestThunk(GET_POST, api.getUsers);

생략;
```

코드가 줄어들어 보기 좋네요.

이번엔 요청의 로딩 상태를 관리하는 작업을 개선하겠습니다.
로딩 상태만 관리하는 모듈을 따로 만들어 주겠습니다.

```js
//modules/loading.js

import { createAction, handleActions } from "redux-actions";

const START_LOADING = "loading/START_LOADING";
const FINISH_LOADING = "loading/FINISH_LOADING";

/*
 요청을 위한 액션 타입을 payload 로 설정합니다 (예: "sample/GET_POST")
*/

export const startLoading = createAction(
  START_LOADING,
  (requestType) => requestType
);

export const finishLoading = createAction(
  FINISH_LOADING,
  (requestType) => requestType
);

const initialState = {};

const loading = handleActions(
  {
    [START_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: true,
    }),
    [FINISH_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: false,
    }),
  },
  initialState
);

export default loading;
```

다음은 요청이 시작될 때 디스패치할 액션 입니다.

```js
{
type :'loading/START_LOADING',
payload : 'sample/GET_POST'
}
```

위 액션이 디스패치 되면 sample/GET_POST 값이 true로 설정해줍니다. 만약 기존 상태에서 sample/GET_POST 필드가 존재하지 않으면 새로 값을 설정해줍니다.
그리고 요청이 끝나면 다음 액션을 디스패치 해줍니다.

```js
{
type :'loading/FINISH_LOADING',
payload : 'sample/GET_POST'
}
```

그럼 기존에 true 였던 값이 false가 됩니다.

이제 리듀서를 루트 리듀서에 포함시켜봅시다.

```js
//modules/index.js
import { combineReducers } from "redux";
import counter from "./counter";
import sample from "./sample";
import loading from "./loading";

const rootReducer = combineReducers({
  counter,
  sample,
  loading,
});

export default rootReducer;
```

loading 리덕스 모듈에서 만든 액션 생성 함수는 앞에서 만든 createRequestThunk에서 사용해줍니다.

```js
//lib/createRequestThunk.js
import { startLoading, finishLoading } from "../modules/loading";

export default function createRequestThunk(type, request) {
  // 성공 및 실패 액션 타입을 정의합니다.
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return (params) => async (dispatch) => {
    dispatch({ type }); // 시작됨
    dispatch(startLoading(type));
    try {
      const response = await request(params);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      }); // 성공
      dispatch(finishLoading(type));
    } catch (e) {
      dispatch({
        type: FAILURE,
        payload: e,
        error: true,
      }); // 에러 발생
      dispatch(startLoading(type));
      throw e;
    }
  };
}

// 사용법: createRequestThunk('GET_USERS',api.getUsers);
```

이제 SampleContainer에서 로딩 상태를 조회할 수 있습니다.

```js
//container/SampleContainer.js
import React from "react";
import { connect } from "react-redux";
import Sample from "../components/Sample";
import { getPost, getUsers } from "../modules/sample";

const { useEffect } = React;
const SampleContainer = ({
  getPost,
  getUsers,
  post,
  users,
  loadingPost,
  loadingUsers,
}) => {
  // 클래스 형태 컴포넌트였더라면, componentDidMount
  useEffect(() => {
    // useEffect 에 파라미터로 넣는 함수는 async 로 할 수 없기 때문에
    // 그 내부에서 async 함수를 선언하고 호출해줍니다.
    const fn = async () => {
      try {
        await getPost(1);
        await getUsers(1);
      } catch (e) {
        console.log(e); // 에러 조회
      }
    };
    fn();
  }, [getPost, getUsers]);
  return (
    <Sample
      post={post}
      users={users}
      loadingPost={loadingPost}
      loadingUsers={loadingUsers}
    />
  );
};

export default connect(
  ({ sample, loading }) => ({
    post: sample.post,
    users: sample.users,
    loadingPost: loading["sample/GET_POST"],
    loadingUsers: loading["sample/GET_USERS"],
  }),
  {
    getPost,
    getUsers,
  }
)(SampleContainer);
```

이제 sample 리듀서에서 불필요한 코드를 지워봅시다.

```js
//modules/sample.js
import { handleActions } from "redux-actions";
import * as api from "../lib/api";
import createRequestThunk from "../lib/createRequestThunk";

// 액션 타입들을 선언합니다.
const GET_POST = "sample/GET_POST";
const GET_POST_SUCCESS = "sample/GET_POST_SUCCESS";

const GET_USERS = "sample/GET_USERS";
const GET_USERS_SUCCESS = "sample/GET_USERS_SUCCESS";

//thunk 함수를 생성합니다. 함수 내부에서 시작할 떄, 성공했을 때, 실패했을 떄 다른 액션을 디스패치합니다.
export const getPost = createRequestThunk(GET_POST, api.getPost);
export const getUsers = createRequestThunk(GET_USERS, api.getPost);

//초기상태 선언
//요청의 로딩상태는 loading이라는 객체가 관리

const initialState = {
  post: null,
  users: null,
};

const sample = handleActions(
  {
    [GET_POST_SUCCESS]: (state, action) => ({
      ...state,
      post: action.payload,
    }),

    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      users: action.payload,
    }),
  },
  initialState
);

export default sample;
```

코드가 훨씬 깔끔해졌군요. 이제 sample 리듀서는 성공했을 때 케이스만 관리해주면 됩니다. 로딩중 상태관리는 loading 객체가 하니까요.

try / catch문을 적용한다면 다음과 같습니다.

```js
//containers/SampleContainer.js
import React from "react";
import { connect } from "react-redux";
import Sample from "../components/Sample";
import { getPost, getUsers } from "../modules/sample";

const { useEffect } = React;
const SampleContainer = ({
  getPost,
  getUsers,
  post,
  users,
  loadingPost,
  loadingUsers,
}) => {
  // 클래스 형태 컴포넌트였더라면, componentDidMount
  useEffect(() => {
    // useEffect 에 파라미터로 넣는 함수는 async 로 할 수 없기 때문에
    // 그 내부에서 async 함수를 선언하고 호출해줍니다.
    const fn = async () => {
      try {
        await getPost(1);
        await getUsers(1);
      } catch (e) {
        console.log(e); // 에러 조회
      }
    };
    fn();
  }, [getPost, getUsers]);
  return (
    <Sample
      post={post}
      users={users}
      loadingPost={loadingPost}
      loadingUsers={loadingUsers}
    />
  );
};

export default connect(
  ({ sample, loading }) => ({
    post: sample.post,
    users: sample.users,
    loadingPost: loading["sample/GET_POST"],
    loadingUsers: loading["sample/GET_USERS"],
  }),
  {
    getPost,
    getUsers,
  }
)(SampleContainer);
```

## redux-saga 활용

redux-saga는 다음과 같은 상황에 유용합니다.

- 기존 요청을 취소 처리 해야할 때
- 특정 액션이 발생했을 때 다른 액션을 발생시키거나 api요청 등 리덕스와 관계없는 코드를 실행할 때
- 웹소켓 사용 시
- api 요청 실패 시 재요청할 때

### 제너레이터 함수

redux-saga 는 제너레이터 함수를 사용합니다. 한번 알아봅시다.

제너레이터 함수의 핵심은 함수를 작성할 때 함수를 특정 구간에 멈춰 놓을 수도 있고, 원할 때 다시 돌아가게 할 수도 있다는 것입니다.

다음 예시를 봅시다.

```js
function weirdFunction() {
  return 1;
  return 2;
  return 3;
  return 4;
}
```

하나의 함수는 하나의 값만 반환합니다. 하나의 함수에서 여러개의 값을 반환할 수 없기때문에 위 코드는 에러가 납니다.

하지만 제너레이터를 사용하면 함수에서 여러 개의 값을 순차적으로 반환할 수 있습니다.

```js
function* generatorFunction() {
  console.log("안녕");
  yield 1;
  console.log("제너레이터함수");
  yield 2;
  console.log("깔깔");
  yield 3;
  return 4;
}
const generator = generatorFunction();
```

제너레이터 함수를 만들 때는 function\* 키워드를 사용합니다.

제너레이터 함수를 호출 했을 때 반환되는 객체를 제너레이터 객체라고 합니다.

generator.next(); 가 호출되면
다음 yield가 있는 곳까지 호출되고 또 호출되면 다음 yield가 있는 곳까지 호출되는 형태입니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/4e8fc38a-6c21-4cbf-8a87-21f99ea8bfd5/image.png)
사진을 보면 yield 2까지 호출된 모습을 볼 수 있습니다.

next()함수에 파라미터를 넣으면 제너레이터 함수에서 yield를 사용해서 해당 값을 조회할 수도 있습니다.

그럼 본격적으로 redux-saga를 비동기 카운터를 구현해봅시다.

INCREASE_ASYNC , DECREASE_ASYNC 액션 타입을 선언해주고 해당 액션에 대한 액션 생성함수, 제너레이터 함수를 만들어줍니다. 이 제너레이터 함수를 saga라고 부릅니다.

```js
//modules/counter.js

import { createAction, handleActions } from "redux-actions";
import { delay, put, takeLatest, takeEvery } from "redux-saga/effects";

const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";
const INCREASE_ASYNC = "counter/INCREASE_ASYNC";
const DECREASE_ASYNC = "counter/DECREASE_ASYNC";

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);
// 마우스 클릭 이벤트가 payload 안에 들어가지 않도록 () => undefined 를 두번째 파라미터로 넣어줍니다.
export const increaseAsync = createAction(INCREASE_ASYNC, () => undefined);
export const decreaseAsync = createAction(DECREASE_ASYNC, () => undefined);

function* increaseSaga() {
  yield delay(1000); // 1초를 기다립니다.
  yield put(increase()); // 특정 액션을 디스패치 합니다.
}

function* decreaseSaga() {
  yield delay(1000); // 1초를 기다립니다.
  yield put(decrease()); // 특정 액션을 디스패치 합니다.
}

export function* counterSaga() {
  // takeEvery 는 들어오는 모든 액션에 대하여 특정 작업을 처리해줍니다.
  // yield takeEvery(INCREASE_ASYNC, increaseSaga);
  // 첫번째 파라미터: n초 * 1000
  yield takeEvery(INCREASE_ASYNC, increaseSaga);
  // takeLatest 는 만약 기존에 진행중이던 작업이 있다면 취소처리 하고
  // 가장 마지막으로 실행된 작업만을 수행합니다.
  yield takeLatest(DECREASE_ASYNC, decreaseSaga);
}

const initialState = 0; // 상태는 꼭 객체일 필요 없습니다. 숫자도 작동해요.

const counter = handleActions(
  {
    [INCREASE]: (state) => state + 1,
    [DECREASE]: (state) => state - 1,
  },
  initialState
);

export default counter;
```

다음으로 루트 사가를 만들어줍니다.

```js
//modules/index.js
import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import counter, { counterSaga } from "./counter";
import sample from "./sample";
import loading from "./loading";

const rootReducer = combineReducers({
  counter,
  sample,
  loading,
});

export function* rootSaga() {
  // all 함수는 여러 사가를 합쳐주는 역할을 합니다.
  yield all([counterSaga()]);
}

export default rootReducer;
```

이제 스토어에 redux-saga 미들웨어를 적용해줍니다.

```js
//index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import rootReducer, { rootSaga } from "./modules";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { thunk } from "redux-thunk";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger();
const store = createStore(
  rootReducer,
  applyMiddleware(logger, thunk, sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
```

이제 CounterContainer 컴포넌트를 app 컴포넌트에 렌더링해서 잘 동작하는지 확인해봅시다.

여기서 리덕스 개발자 도구 라이브러리를 설치하고 +1 버튼을 빠르게 두번 눌러 콘솔과 리덕스 개발 툴 을 확인해봅시다.

```js
//index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import rootReducer, { rootSaga } from "./modules";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { thunk } from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger, thunk, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
```

![](https://velog.velcdn.com/images/dogmnil2007/post/2927cd13-4ee9-4ca6-9a47-2cdc50aa2ce7/image.png)
![](https://velog.velcdn.com/images/dogmnil2007/post/c9843347-f077-4eb5-9f9d-eefc096f0b9c/image.png)

+1 버튼을 두 번 누르면 INCREASE ASYNC 액션이 두 번 디스패치되고, 이에 따라 INCREASE 액션도 두 번 디스패치됩니다.

takeEvery를 사용하여 increasesaga를 등록했으므로 디스패치되는 모든
INCREASE ASYNC 액션에 대해 1초 후 INCREASE 액션을 발생시켜 줍니다.

이번에는 페이지를 새로고침한 뒤에 -1 버튼을 두 번 눌러서 어떤 액션이 디스패치되는지 확인해보세요.

조금 전과는 다르게 DECREASE ASYNC 액션이 두 번 디스패치되었음에도 불구하고 DECREASE 액션은단 한 번 디스패치되었습니다.

조금 전에 decreasesaga를 등록할 때 takelatest를 사용했기 때문입니다.

여러 액션이 중접되어 디스패치되었을 때는 기존의 것들은 무시하고 가장 마지막 액션만 제대로 처리합니다.

<br><br>

### api 요청 상태 관리

이제 redux-saga를 이용해서 api 요청을 해보겠습니다.

sample 리덕스 모듈을 다음과 같이 수정해줍니다.

```js
//modules/sample.js

import { handleActions, createAction } from "redux-actions";
import * as api from "../lib/api";
import { call, put, takeLatest } from "redux-saga/effects";
import { startLoading, finishLoading } from "./loading";

// 액션 타입들을 선언합니다.
const GET_POST = "sample/GET_POST";
const GET_POST_SUCCESS = "sample/GET_POST_SUCCESS";
const GET_POST_FAILURE = "sample/GET_POST_FAILURE";

const GET_USERS = "sample/GET_USERS";
const GET_USERS_SUCCESS = "sample/GET_USERS_SUCCESS";
const GET_USERS_FAILURE = "sample/GET_USERS_FAILURE";

//thunk 함수를 생성합니다. 함수 내부에서 시작할 떄, 성공했을 때, 실패했을 떄 다른 액션을 디스패치합니다.
export const getPost = createAction(GET_POST, (id) => id);
export const getUsers = createAction(GET_USERS);

function* getPostSaga(action) {
  yield put(startLoading(GET_POST)); // 로딩 시작
  // 파라미터로 action 을 받아오면 액션의 정보를 조회 할 수 있습니다.
  try {
    // call 을 사용하면 Promise 를 반환하는 함수를 호출하고, 기다릴 수 있습니다.
    // 첫번째 파라미터는 함수, 나머지 파라미터는 해당 함수에 넣을 인수입니다.
    const post = yield call(api.getPost, action.payload); // api.getPost(action.payload) 를 의미
    yield put({
      type: GET_POST_SUCCESS,
      payload: post.data,
    });
  } catch (e) {
    // try/catch 문을 사용하여 에러도 잡을 수 있습니다.
    yield put({
      type: GET_POST_FAILURE,
      payload: e,
      error: true,
    });
  }
  yield put(finishLoading(GET_POST)); // 로딩 완료
}

function* getUsersSaga() {
  yield put(startLoading(GET_USERS));
  try {
    const users = yield call(api.getUsers);
    yield put({
      type: GET_USERS_SUCCESS,
      payload: users.data,
    });
  } catch (e) {
    yield put({
      type: GET_USERS_FAILURE,
      payload: e,
      error: true,
    });
  }
  yield put(finishLoading(GET_USERS));
}

export function* sampleSaga() {
  yield takeLatest(GET_POST, getPostSaga);
  yield takeLatest(GET_USERS, getUsersSaga);
}

//초기상태 선언
//요청의 로딩상태는 loading이라는 객체가 관리

const initialState = {
  post: null,
  users: null,
};

const sample = handleActions(
  {
    [GET_POST_SUCCESS]: (state, action) => ({
      ...state,
      post: action.payload,
    }),

    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      users: action.payload,
    }),
  },
  initialState
);

export default sample;
```

여기서 GET_POST 액션의 경우 API 요청 할 때 어떤 id로 조회할지 정해 줘야 합니다.
redux-saga를 사용할 때는 id처럼 요청이 필요한 값을 액션의 payload로 넣어줘야합니다.

그러면 이 액션을 처리하기 위한 사가를 작성할 때 payload 값을 APT를 호출하는 합수의 인수로 넣어 주어야 합니다.

API를 호출해야 하는 상황에는 사가 내부에서 직접 호출하지 않고 ca11 함수를 사용합니다.

call함수의 경우, 첫 번째 인수는 호출하고 싶은 함수이고, 그 뒤에 오는 인수들은 해당 함수에 넣어주고 싶은 인수입니다.

지금 getpostsaga의 경우에는 id를 의미하는 action.payload가 인수가 됩니다.

이제 samplesaga를 루트 사가에 등록하세요.

```js
//modules/index.js
import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import counter, { counterSaga } from "./counter";
import sample, { sampleSaga } from "./sample";
import loading from "./loading";

const rootReducer = combineReducers({
  counter,
  sample,
  loading,
});

export function* rootSaga() {
  // all 함수는 여러 사가를 합쳐주는 역할을 합니다.
  yield all([counterSaga(), sampleSaga()]);
}

export default rootReducer;
```

이제 app 컴포넌트에 SampleContainer를 렌더링해줍니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/60848c34-6ade-4b9f-bc8a-892e33a1e5a6/image.png)
잘 나오네요ㅎㅎ

### 리팩토링

이제 복잡한 코드를 리팩토링 하는 시간을 가져보겠습니다.

createRequestSaga.js 라는 함수를 만들어줍니다.

```js
//lib/createRequestSaga.js

import { call, put } from "redux-saga/effects";
import { startLoading, finishLoading } from "../modules/loading";

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    yield put(startLoading(type)); // 로딩 시작
    try {
      const response = yield call(request, action.payload);
      yield put({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }
    yield put(finishLoading(type)); // 로딩 끝
  };
}
```

이제 사가를 짧은 코드로 구현할 수 있습니다.

```js
//modules/sample.js

import createRequestSaga from "../lib/createRequestSaga";

생략;

// 액션 타입들을 선언합니다.
const GET_POST = "sample/GET_POST";
const GET_POST_SUCCESS = "sample/GET_POST_SUCCESS";
//fail 처리 삭제

const GET_USERS = "sample/GET_USERS";
const GET_USERS_SUCCESS = "sample/GET_USERS_SUCCESS";
//fail 처리 삭제

생략;

// function* getPostSaga(action) {
//   yield put(startLoading(GET_POST)); // 로딩 시작
//   // 파라미터로 action 을 받아오면 액션의 정보를 조회 할 수 있습니다.
//   try {
//     // call 을 사용하면 Promise 를 반환하는 함수를 호출하고, 기다릴 수 있습니다.
//     // 첫번째 파라미터는 함수, 나머지 파라미터는 해당 함수에 넣을 인수입니다.
//     const post = yield call(api.getPost, action.payload); // api.getPost(action.payload) 를 의미
//     yield put({
//       type: GET_POST_SUCCESS,
//       payload: post.data
//     });
//   } catch (e) {
//     // try/catch 문을 사용하여 에러도 잡을 수 있습니다.
//     yield put({
//       type: GET_POST_FAILURE,
//       payload: e,
//       error: true
//     });
//   }
//   yield put(finishLoading(GET_POST)); // 로딩 완료
// }

// function* getUsersSaga() {
//   yield put(startLoading(GET_USERS));
//   try {
//     const users = yield call(api.getUsers);
//     yield put({
//       type: GET_USERS_SUCCESS,
//       payload: users.data
//     });
//   } catch (e) {
//     yield put({
//       type: GET_USERS_FAILURE,
//       payload: e,
//       error: true
//     });
//   }
//   yield put(finishLoading(GET_USERS));
// }

//위 주석처리된 코드들을 밑 두줄로 대체해줍니다.

const getPostSaga = createRequestSaga(GET_POST, api.getPost);
const getUsersSaga = createRequestSaga(GET_USERS, api.getUsers);

생략;
```

마지막으로 시가 내부에서 현재 상태를 조회하는 방법, 시가 실행 주기 제한 방법을 알아보겠습니다.

### 현재 상태 조회 방법

```js
//modules/counter.js
import { delay, put, takeLatest, takeEvery, select } from "redux-saga/effects";

생략;

function* increaseSaga() {
  yield delay(1000); // 1초를 기다립니다.
  yield put(increase()); // 특정 액션을 디스패치 합니다.
  const number = yield select((state) => state.counter);
  console.log(`현재 값은 ${number}입니다.`);
}

생략;
```

CounterContainer를 렌더링하고 버튼을 눌러보면

![](https://velog.velcdn.com/images/dogmnil2007/post/bd10e41b-c938-496d-9909-549697e0d1ac/image.png)
현재 상태를 참조할 수 있습니다.

### 시가 실행 주기 제한 방법

다음은 시가 실행 주기 제한 방법입니다.
코드르 다음과 같이 수정하면 increaseSaga는 3초에 단 한번 호출됩니다.

```js
//modules/counter.js

import {
  delay,
  put,
  takeLatest,
  takeEvery,
  select,
  throttle,
} from "redux-saga/effects";

생략;

export function* counterSaga() {
  // takeEvery 는 들어오는 모든 액션에 대하여 특정 작업을 처리해줍니다.
  // yield takeEvery(INCREASE_ASYNC, increaseSaga);
  // 첫번째 파라미터: n초 * 1000
  yield throttle(3000, INCREASE_ASYNC, increaseSaga);

  // takeLatest 는 만약 기존에 진행중이던 작업이 있다면 취소처리 하고
  // 가장 마지막으로 실행된 작업만을 수행합니다.
  yield takeLatest(DECREASE_ASYNC, decreaseSaga);
}

생략;
```

### 3줄 요약

1. 리덕스 미들웨어는 redux-thunk, redux-saga가 대표적이다.
2. 미들웨어에는 호출 제한 기능, 현재 상태 조회 등 다양한 부가기능이 있다.
3. 불편하다면 굳이 안써도 된다.
