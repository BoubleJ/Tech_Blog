---
date: "2024-03-13"
title: "[React Study - 리액트를 다루는 기술] 17장. 리덕스를 사용하여 리액트 애플리케이션 상태 관리하기 "
categories: ["ReactStudy", "React"]
summary: "이번 포스팅은 제가 redux 원리를 정확하게 숙지하지 못했기에 이번 기회에 정확하게 짚고 넘어가고자해서 17장 내용을 공부해봤습니다. "
thumbnail: "./image-57.png"
---

이번 포스팅은 제가 redux 원리를 정확하게 숙지하지 못했기에 이번 기회에 정확하게 짚고 넘어가고자해서 17장 내용을 공부해봤습니다.

리액트 어플리케이션에서 리덕스를 사용하면 상태 업데이트에 관한 로직을 모듈로 따로 분리하여 컴포넌트 파일과 별개로 관리할 수 있으므로 코드를 유지보수 하는데 도움이 된다고 합니다.

이러한 특성을 참고해서 redux를 프로젝트에 직접 구현해봅시다.

<br><br>

# Redux 프로젝트 구현

## ui컴포넌트 제작

먼저 카운터 컴포넌트를 만들어줍니다.

```js
//components/Counter.js

import React from "react";

const Counter = React.memo(({ number, onIncrease, onDecrease }) => {
  return (
    <div>
      <h1>{number}</h1>
      <div>
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
      </div>
    </div>
  );
});

export default Counter;
```

할일 목록 컴포넌트도 만들어줍니다.

참고로 위 두 컴포넌트는 ui컴포넌트입니다.

```js
//components/Todos.js
import React from "react";

const TodoItem = ({ todo, onToggle, onRemove }) => {
  return (
    <div>
      <input type="checkbox" />
      <span>예제 텍스트</span>
      <button>삭제</button>
    </div>
  );
};

const Todos = ({
  input, // 인풋에 입력되는 텍스트
  todos, // 할 일 목록이 들어있는 객체
  onChangeInput,
  onInsert,
  onToggle,
  onRemove,
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input />
        <button type="submit">등록</button>
      </form>
      <div>
        <TodoItem />
        <TodoItem />
        <TodoItem />
        <TodoItem />
      </div>
    </div>
  );
};

export default Todos;
```

두 컴포넌트를 이제 화면에 렌더링 해줍시다.

```js
//App.js

import "./App.css";
import Todos from "./components/Todos";
import Counter from "./containers/Counter";

function App() {
  return (
    <>
      <div>
        <Counter number={0} />
        <hr />
        <Todos />
      </div>
    </>
  );
}

export default App;
```

![](https://velog.velcdn.com/images/dogmnil2007/post/85397286-384a-475c-98f5-313826d82fbc/image.png)

## 리덕스 관련 코드 작성

리덕스를 사용하기 위해선 액션타입, 액션 생성 함수, 리듀서코드 총 3가지 코드를 작성해야합니다.
액션타입, 액션 생성 함수, 리듀서 함수를 기능별로 파일 하나에 몰아서 다 작성하는 방식(Ducks 패턴)이 있고

![](https://velog.velcdn.com/images/dogmnil2007/post/125fee2f-89fc-4bc8-b1af-8afeea722e26/image.png)

기능별로 묶어서 파일 하나에 작성하는 방법이 있다고 합니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/3c3b59ea-2f8f-4391-baa5-d7cf3f4c19c0/image.png)

<br><br>

그럼 이제 코드를 작성해봅시다.

초기 상태와 리듀서 함수입니다.

```js
//modules/counters.js
const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";

export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

const initialState = {
  number: 0,
};

function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return { number: state.number + 1 };
    case DECREASE:
      return { number: state.number - 1 };
    default:
      return state;
  }
}

export default counter;
```

다음으로 액션 타입을 정의하고, 액션 생성 함수를 만들어봅시다.

```js
//modules/todos.js
const CHANGE_INPUT = "todos/CHANGE_INPUT"; // 인풋 값을 변경함
const INSERT = "todos/INSERT"; // 새로운 todo 를 등록함
const TOGGLE = "todos/TOGGLE"; // todo 를 체크/체크해제 함
const REMOVE = "todos/REMOVE"; // todo 를 제거함

export const changeInput = (input) => ({
  type: CHANGE_INPUT,
  input,
});

let id = 3; // insert 가 호출 될 때마다 1씩 더해집니다.
export const insert = (text) => ({
  type: INSERT,
  todo: {
    id: id++,
    text,
    done: false,
  },
});

export const toggle = (id) => ({
  type: TOGGLE,
  id,
});
export const remove = (id) => ({
  type: REMOVE,
  id,
});
```

그리고 모듈의 초기상태 및 리듀서 함수를 만들어줍니다.

```js
//modules/todos.js
const CHANGE_INPUT = "todos/CHANGE_INPUT"; // 인풋 값을 변경함
const INSERT = "todos/INSERT"; // 새로운 todo 를 등록함
const TOGGLE = "todos/TOGGLE"; // todo 를 체크/체크해제 함
const REMOVE = "todos/REMOVE"; // todo 를 제거함

export const changeInput = (input) => ({
  type: CHANGE_INPUT,
  input,
});

let id = 3; // insert 가 호출 될 때마다 1씩 더해집니다.
export const insert = (text) => ({
  type: INSERT,
  todo: {
    id: id++,
    text,
    done: false,
  },
});

export const toggle = (id) => ({
  type: TOGGLE,
  id,
});
export const remove = (id) => ({
  type: REMOVE,
  id,
});

//여기서부터 추가한 코드

const initialState = {
  input: "",
  todos: [
    {
      id: 1,
      text: "리덕스 기초 배우기",
      done: true,
    },
    {
      id: 2,
      text: "리액트와 리덕스 사용하기",
      done: false,
    },
  ],
};

function todos(state = initialState, action) {
  switch (action.type) {
    case CHANGE_INPUT:
      return {
        ...state,
        input: action.input,
      };
    case INSERT:
      return {
        ...state,
        todos: state.todos.concat(action.todo),
      };
    case TOGGLE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo
        ),
      };
    case REMOVE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
    default:
      return state;
  }
}

export default todos;
```

리뷰서 함수를 여러개 만들었는데 createStore 함수를 사용해 store를 만들때는 리듀서 하나만 사용해야하므로 combineReducers 라는 유틸함수를 사용해줍니다.

```js
//modules/index.js
import { combineReducers } from "redux";
import counter from "./counter";
import todos from "./todos";

const rootReducer = combineReducers({
  counter,
  todos,
});

export default rootReducer;
```

## 리액트에 리덕스 적용시키기

스토어를 만들고 리액트 어플리케이션에 리덕스를 적용시켜줍시다.

음 근데 에러가떴네요

```
'createStore' is deprecated.ts(6385)
redux.d.ts(327, 4): The declaration was marked as deprecated here.
(alias) function createStore<S, A extends Action<string>, Ext extends {} = {}, StateExt extends {} = {}>(reducer: Reducer<S, A>, enhancer?: StoreEnhancer<Ext, StateExt>): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext (+1 overload)
import createStore
@deprecated
We recommend using the configureStore method of the @reduxjs/toolkit package, which replaces createStore.

Redux Toolkit is our recommended approach for writing Redux logic today, including store setup, reducers, data fetching, and more.

For more details, please read this Redux docs page: https://redux.js.org/introduction/why-rtk-is-redux-today

configureStore from Redux Toolkit is an improved version of createStore that simplifies setup and helps avoid common bugs.

You should not be using the redux core package by itself today, except for learning purposes. The createStore method from the core redux package will not be removed, but we encourage all users to migrate to using Redux Toolkit for all Redux code.

If you want to use createStore without this visual deprecation warning, use the legacy_createStore import instead:

import { legacy_createStore as createStore} from 'redux'

```

구구절절 말이 많지만 2줄만 우리는 두 줄만 보면 될 것 같습니다.

```
'createStore' is deprecated.ts(6385)
import { legacy_createStore as createStore} from 'redux'
```

createStore 기능은 퇴물이 되었다는군요. 리덕스 툴킷을 사용하라는데 이러면 머리아파지니 일단
import { legacy_createStore as createStore} from 'redux' 이 방법을 채택해서 포스팅을 이어가도록 하겠습니다.

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./modules";
import { legacy_createStore as createStore } from "redux";

const store = createStore(rootReducer);
//일단 스토어를 만들어줬습니다.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

이제 Provider 컴포넌트를 사용해 프로젝트에 리덕스를 적용시켜줍니다.

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./modules";
import { legacy_createStore as createStore } from "redux";
import { Provider } from "react-redux";
//Provider 컴포넌트를 불러옵니다.
import { devToolsEnhancer } from "redux-devtools-extension";
//리덕스 dev 툴입니다.

const store = createStore(rootReducer, devToolsEnhancer());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      //살포시 감싸줍니다.
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
```

## 컨테이너 컴포넌트 만들기

이제 컴포넌트에서 리덕스 스토어에 접근하여 원하는 상태를 받아오고 액션도 디스패치해 줄 차례입니다.

CounterContainer 컴포넌트를 만들어줍니다.

```js
//containers/CounterContainer.js

import Counter from "../components/Counter";
import { connect } from "react-redux";

const CounterContainer = () => {
  return (
    <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />
  );
};

const mapstateToProps = (state) => ({
  number: state.counter.number,
});
const mapDispatchToProps = (dispatch) => ({
  //임시함수
  increase: () => {
    console.log("increase");
  },

  decrease: () => {
    console.log("decrease");
  },
});
export default connect(mapstateToProps, mapDispatchToProps)(CounterContainer);
```

이제 브라우저에서 +1, -1 버튼을 누르면 콘솔이 찍히는 것을 확인할 수 있습니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/e545520f-585f-44ad-ad10-aa137ec9ab42/image.png)

이제 액션생성함수를 불러와서 액션 객체를 만들고 디스패치 해주도록 하겠습니다.

```js
//containers/CounterContainer.js
import Counter from "../components/Counter";
import { connect } from "react-redux";
import { increase, decrease } from "../modules/counter";

const CounterContainer = ({ number, increase, decrease }) => {
  return (
    <Counter number={number} onIncrease={increase} onDecrease={decrease} />
  );
};

const mapstateToProps = (state) => ({
  number: state.counter.number,
});
const mapDispatchToProps = (dispatch) => ({
  increase: () => {
    dispatch(increase());
  },

  decrease: () => {
    dispatch(decrease());
  },
});
export default connect(mapstateToProps, mapDispatchToProps)(CounterContainer);
```

![](https://velog.velcdn.com/images/dogmnil2007/post/bc7f8f89-1a78-4371-9a10-1ea5b0af8f57/image.png)

숫자가 변하는 것을 확인할 수 있습니다.

## TodoContainer 만들기

이번에는 Todo 컴포넌트를 위한 TodoContainer를 만들어보겠습니다.

```js
//comtainers/TodoContainer.js

import React from "react";
import { connect } from "react-redux";
import { changeInput, insert, toggle, remove } from "../modules/todos";
import Todos from "../components/Todos";

const TodosContainer = ({
  input,
  todos,
  changeInput,
  insert,
  toggle,
  remove,
}) => {
  return (
    <Todos
      input={input}
      todos={todos}
      onChangeInput={changeInput}
      onInsert={insert}
      onToggle={toggle}
      onRemove={remove}
    />
  );
};

export default connect(
  ({ todos }) => ({
    input: todos.input,
    todos: todos.todos,
  }),
  {
    changeInput,
    insert,
    toggle,
    remove,
  }
)(TodosContainer);
```

그 다음은 Todos 컴포넌트에서 받아온 props를 사용하도록 구현해줍니다.

```js
//components/Todos.js
import React from "react";

const TodoItem = ({ todo, onToggle, onRemove }) => {
  return (
    <div>
      <input
        type="checkbox"
        onClick={() => onToggle(todo.id)}
        checked={todo.done}
        readOnly={true}
      />
      <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <button onClick={() => onRemove(todo.id)}>삭제</button>
    </div>
  );
};

const Todos = ({
  input, // 인풋에 입력되는 텍스트
  todos, // 할 일 목록이 들어있는 객체
  onChangeInput,
  onInsert,
  onToggle,
  onRemove,
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    onInsert(input);
    onChangeInput(""); // 등록 후 인풋 초기화
  };
  const onChange = (e) => onChangeInput(e.target.value);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={input} onChange={onChange} />
        <button type="submit">등록</button>
      </form>
      <div>
        {todos.map((todo) => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default Todos;
```

이제 todo 리스트가 잘 동작하는지 확인해봅시다.
![](https://velog.velcdn.com/images/dogmnil2007/post/f3ce6970-f5c6-47c1-ad69-1f0c206df5bc/image.png)

# 리덕스 편하게 사용하기

## Redux-actions

Redux-actions을 사용하면 switch문 대신 handleActions라는 함수를 이용해 액션 업데이트 함수를 설정할 수 있고 코드도 짧아집니다.

```js
//modules/counter.js

import { createAction, handleActions } from "redux-actions";

const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

const initialState = {
  number: 0,
};

const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({ number: state.number + 1 }),
    [DECREASE]: (state, action) => ({ number: state.number - 1 }),
  },
  initialState
);

export default counter;
```

handleActions 함수의 첫 번째 파라미터는 액션에 대한 업데이트 함수, 두 번째 파라미터는 초기 상태를 넣어주면 됩니다.

이제 todo 모듈도 적용해줍시다.
todo 모듈의 경우 액션 생성 함수에서 파라미터를 필요로 합니다.
createAction으로 액션을 만들면 필요한 추가 데이터는 payload라는 이름으로 사용합니다.

```js
//modules/todos.js

import { createAction } from "redux-actions";

const CHANGE_INPUT = "todos/CHANGE_INPUT"; // 인풋 값을 변경함
const INSERT = "todos/INSERT"; // 새로운 todo 를 등록함
const TOGGLE = "todos/TOGGLE"; // todo 를 체크/체크해제 함
const REMOVE = "todos/REMOVE"; // todo 를 제거함

export const changeInput = createAction(CHANGE_INPUT, (input) => input);

let id = 3; // insert 가 호출 될 때마다 1씩 더해집니다.
export const insert = createAction(INSERT, (text) => ({
  id: id++,
  text,
  done: false,
}));

export const toggle = createAction(TOGGLE, (id) => id);
export const remove = createAction(REMOVE, (id) => id);

const initialState = {
  input: "",
  todos: [
    {
      id: 1,
      text: "리덕스 기초 배우기",
      done: true,
    },
    {
      id: 2,
      text: "리액트와 리덕스 사용하기",
      done: false,
    },
  ],
};

function todos(state = initialState, action) {
  switch (action.type) {
    case CHANGE_INPUT:
      return {
        ...state,
        input: action.input,
      };
    case INSERT:
      return {
        ...state,
        todos: state.todos.concat(action.todo),
      };
    case TOGGLE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo
        ),
      };
    case REMOVE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
    default:
      return state;
  }
}

export default todos;
```

insert의 경우 todo 객체를 액션 객체 안에 넣어줘야 하기 때문에 두 번째 파라미터에 text를 넣으면 todo 객체가 반환되는 함수를 넣어줬습니다.

액션 생성 함수를 다 작성했으면 handiections로 리듀서를 재작성해 보겠습니다. createAction으로 만든 액션 생성 함수는 파라미터로 받아 온 값을 객체 안에 봉을 때 원하는 이름으로 넣는 것이 아니라 action.id, action.todo와 같이 action.payload라는 이름을 공통적으로 넣어 주게 됩니다.
그렇기 패문에 기존의 업데이트 로직에서도 모두 action.payload 값을 조회하여 업데이트하도록 구현해 주어야 합니다.
액션 생성 함수는 액션에 필요한 추가 데이터를 모투 payload라는 이름으로 사용하기 때문에 action.id, action.tod를 조회하는 대신, 모두 공통적으로 action. payload 값을 조회하도록 리듀서를 구현해 주어야 합니다.

```js
//modules/todos.js
import { createAction, handleActions } from "redux-actions";

const CHANGE_INPUT = "todos/CHANGE_INPUT"; // 인풋 값을 변경함
const INSERT = "todos/INSERT"; // 새로운 todo 를 등록함
const TOGGLE = "todos/TOGGLE"; // todo 를 체크/체크해제 함
const REMOVE = "todos/REMOVE"; // todo 를 제거함

export const changeInput = createAction(CHANGE_INPUT, (input) => input);

let id = 3; // insert 가 호출 될 때마다 1씩 더해집니다.
export const insert = createAction(INSERT, (text) => ({
  id: id++,
  text,
  done: false,
}));

export const toggle = createAction(TOGGLE, (id) => id);
export const remove = createAction(REMOVE, (id) => id);

const initialState = {
  input: "",
  todos: [
    {
      id: 1,
      text: "리덕스 기초 배우기",
      done: true,
    },
    {
      id: 2,
      text: "리액트와 리덕스 사용하기",
      done: false,
    },
  ],
};
const todos = handleActions(
  {
    [CHANGE_INPUT]: (state, action) => ({ ...state, input: action.payload }),
    [INSERT]: (state, action) => ({
      ...state,
      todos: state.todos.concat(action.payload),
    }),

    [TOGGLE]: (state, action) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      ),
    }),

    [REMOVE]: (state, action) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== action.payload),
    }),
  },
  initialState
);

export default todos;
```

모든 추가 데이터값을 action.payload로 사용하면 헷갈릴 수 있으니 객체 비구조화 할당 문법으로 나누어줍니다.

```js
//modules/todos.js
const todos = handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: input }) => ({ ...state, input }),
    [INSERT]: (state, { payload: todo }) => ({
      ...state,
      todos: state.todos.concat(todo),
    }),

    [TOGGLE]: (state, { payload: id }) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      ),
    }),

    [REMOVE]: (state, { payload: id }) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
    }),
  },
  initialState
);

export default todos;
```

## immer 활용

객체 구조가 복잡해지거나 객체로 이루어진 배열을 다룰 경우 immer를 사용하면 더 편리합니다.

```js
//modules/todos.js

const todos = handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: input }) =>
      produce(state, (draft) => {
        draft.input = input;
      }),
    [INSERT]: (state, { payload: todo }) =>
      produce(state, (draft) => {
        draft.todos.push(todo);
      }),
    [TOGGLE]: (state, { payload: id }) =>
      produce(state, (draft) => {
        const todo = draft.todos.find((todo) => todo.id === id);
        todo.done = !todo.done;
      }),
    [REMOVE]: (state, { payload: id }) =>
      produce(state, (draft) => {
        const index = draft.todos.findIndex((todo) => todo.id === id);
        draft.todos.splice(index, 1);
      }),
  },
  initialState
);
```

## hook을 사용한 컨테이너 컴포넌트 제작

useSelector를 사용하면 connect를 사용하지 않고도 리덕스 상태를 조회할 수 있습니다.

useDispatch라는 훅은 컴포넌트 내부에서 스토어의 내장 함수 dispatch를 사용할 수 있게 해줍니다. 컨테이너 컴포넌트에서 액션을 디스패치한다면 이 훅을 사용하면 됩니다.

추가로 컴포넌트 성능 최적화를 위해 useCallback으로 액션을 디스패치하는 함수를 감싸줍시다.

```js
//containers/CounterContainer.js
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Counter from "../components/Counter";
import { increase, decrease } from "../modules/counter";

const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  const dispatch = useDispatch();
  const onIncrease = useCallback(() => dispatch(increase()), [dispatch]);
  const onDecrease = useCallback(() => dispatch(decrease()), [dispatch]);

  return (
    <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />
  );
};

export default CounterContainer;
```

## useAction 유틸 hook을 만들어서 사용하기

useAction 훅은 여러 개의 액션을 사용할 경우 유용합니다.
lib 디렉토리를 만들고 useAction.js 파일을 만들고 코드를 작성해봅시다.

```js
//lib/useAction.js
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

export default function useActions(actions, deps) {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map((a) => bindActionCreators(a, dispatch));
      }
      return bindActionCreators(actions, dispatch);
    },
    deps ? [dispatch, ...deps] : deps
  );
}
```

방금 작성한 useActions Hook은 액션 생성 함수를 액션을 디스패치하는 함수로 변환해 줍니다.
액션 생성 함수를 사용하여 액션 객체를 만들고, 이를 스토어에 디스패치하는 작업을 해 주는 함수를 자동으로 만들어 주는 것이죠.
useActions는 두 가지 파라미터가 필요합니다.
첫 번째 파라미터는 액션 생성 함수로 이루어진 배열입니다.
두 번째 파라미터는 deps 배열이며, 이 배열 안에 들어 있는 원소가 바뀌면 액션을 디스패치하는 함수를 새로 만들게 됩니다.

한번 TodoContainer에서 useActions를 불러와 사용해 봅시다.

```js
//containers/TodoContainer.js

import React from "react";
import { useSelector } from "react-redux";
import { changeInput, insert, toggle, remove } from "../modules/todos";
import Todos from "../components/Todos";
import useActions from "../lib/useActions";

const TodosContainer = () => {
  const { input, todos } = useSelector(({ todos }) => ({
    input: todos.input,
    todos: todos.todos,
  }));

  const [onChangeInput, onInsert, onToggle, onRemove] = useActions(
    [changeInput, insert, toggle, remove],
    []
  );

  return (
    <Todos
      input={input}
      todos={todos}
      onChangeInput={onChangeInput}
      onInsert={onInsert}
      onToggle={onToggle}
      onRemove={onRemove}
    />
  );
};

export default React.memo(TodosContainer);
```

잘 동작하는지 확인해봅시다~

### 3줄 요약

1. redux를 사용하기 위해선 액션 타입, 액션 생성함수, 리듀서, 스토어 가 필요하다.
2. react에서 제공하는 hook을 사용해서 redux 기능을 구현할 수 있다.
3. 최적화는 마구잡이로 하는 것이 아닌 필요할 때 하는 것이 좋다.
