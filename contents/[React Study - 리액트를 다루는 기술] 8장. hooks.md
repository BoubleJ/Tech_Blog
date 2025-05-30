---
date: "2024-02-07"
title: "[React Study - 리액트를 다루는 기술] 8장. hooks"
categories: ["ReactStudy", "React"]
summary: "훅을 도대체 왜 쓰는걸까??"
thumbnail: "./리액트훅.png"
---

# 훅을 도대체 왜 쓰는걸까??

<br><br>

## 1. Hook은 계층의 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와줍니다.

React에 hook이 도입되기 전에는 상태 관련 로직을 구현하기 위해서 클래스형 컴포넌트 내부에서 구현해야 하는 경우가 많았기 때문에 코드 재사용에 어려움을 겪었습니다.
또한 상태 관련 논리를 컴포넌트끼리 공유하려면 상속이나 고차 컴포넌트와 같은 기술을 사용해야 하므로 코드가 더 복잡해지고 유지 관리가 더 어려웠습니다.

하지만 hook을 사용하면 위와 같은 복잡한 과정없이 사용자 정의 hook 내에서 상태 관련 로직을 캡슐화하여 여러 컴포넌트에서 재사용할 수 있습니다. 이러한 접근 방식을 사용하면 코드 재사용이 촉진되고 코드를 더 쉽게 관리하고 유지할 수 있습니다.
또한 여러 hook을 결합하여 더 복잡한 동작을 생성하고 코드 작업을 더욱 고도화 시킬 수 있습니다.

예를 들어 상태관리 로직이 필요하다면 간단히 useState hook을 import 해와서 쓰면 된다는 것이죠.

<br><br>

## 2. lifeCycle로 인한 중복로직을 피하기 위해서

클래스형 컴포넌트 생명주기 메서드에는 자주 관련 없는 로직이 섞여들어가고는 합니다. 예시로 componentDidMount 와 componentDidUpdate는 컴포넌트안에서 데이터를 가져오는 작업을 수행할 때 사용 되어야 하지만, 같은 componentDidMount에서 이벤트 리스너를 설정하는 것과 같은 관계없는 로직이 포함되기도 하며, componentWillUnmount에서 cleanup 로직을 수행하기도 합니다.

<br>


아래 예시는 라이프 사이클에 중복된 로직을 사용하는 경우입니다

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

위의 코드를 react Hook의 useEffect를 사용하여 라이프사이클을 통합한 예제입니다.

```js
import { useState, useEffect } from "react";
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

useEffect hook을 사용하니 lifeCycle의 중복로직 문제가 해결된 것을 볼 수 있습니다.

<br><br>

## 3. class의 this키워드로 인한 문제

React 에서의 Class 사용을 위해서는 JavaScript의 this 키워드가 어떻게 작동하는지 알아야만 합니다.

JavaScript의 this키워드는 대부분의 다른 언어에서와는 다르게 작동함으로 사용자에게 큰 혼란을 주었으며, 코드의 재사용성과 구성을 매우 어렵게 만들었습니다. 사용자들은 props, state, 그리고 top-down 데이터 흐름을 완벽하게 하고도, Class를 이해하는데 어려움을 느꼈습니다.

이러한 문제를 해결하기 위해, Hook은 Class없이 React 기능들을 사용하는 방법을 제시해줍니다.
