---
date: "2024-03-06"
title: "[React Study - 리액트를 다루는 기술] 15장. Context API"
categories: ["ReactStudy", "React"]
summary: "해당 단원 공부 중 Render Props 라는 생소한 용어를 맞닥뜨려 도대체 뭔지 한번 알아보았습니다."
thumbnail: "./hello.png"
---



해당 단원 공부 중 Render Props 라는 생소한 용어를 맞닥뜨려 도대체 뭔지 한번 알아보았습니다.

# Render Props
> "render prop"란, React 컴포넌트 간에 코드를 공유하기 위해 함수 props를 이용하는 간단한 테크닉입니다.
출처. 리액트 공식문서

공식문서는 간단하다 주장하지만 사실 잘 와닫지않습니다. 

좀 더 풀어서 설명하자면
Render Props는 컴포넌트 코드를 작성하는 과정에서 컴포넌트를 함수로 감싸는 것이 아니라, JSX 에서 렌더링 하는 방식으로 사용 할 수 있게 해주는 패턴입니다.

즉 Render Prop 은, 단순히 props 에 JSX 를 렌더링하는 함수를 전달 하는 것 입니다. 그리고 render 함수에서, 전달받은 함수에, 넣어주고 싶은 값을 함수의 인자로 전달하여 사용합니다.
반복되는 로직을 쉽게 재사용 할 수 있게 해주는 특징을 지니고 있습니다. 

```js
import React from 'react';
import Box from '디렉토리어딘가'

const MyComponent = () => {
  return <div>Hello, World!
    <Box />
    </div>;
}
//보통 우리가 자주 접하는 컴포넌트를 함수로 감싼 구조입니다

```


### Render Props를 활용한 예제 코드

```js
// ParentComponent.js
import React from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  
  
  
  //  renderContent는 Render Prop으로 사용될 함수
  const renderContent = (name) => {
    return <h1>{value}</h1>;
  };

  return (
    <div>
      {/* 자식 컴포넌트에게 Render Prop로 함수를 전달 */}
      <ChildComponent render={renderContent} />
    </div>
  );
};

export default ParentComponent;
```


```js
// ChildComponent.js
import React from 'react';

const ChildComponent = (props) => {
  // Render Prop로 전달된 함수 호출하여 JSX 반환
  return props.render('hello!');
};

export default ChildComponent;
```


![](https://velog.velcdn.com/images/dogmnil2007/post/cf5cb4a5-8711-48b6-b4a8-5b8721b63a1e/image.png)

화면에 정상적으로 hello!가 출력되는 것을 확인할 수 있습니다. 

<br><br>
<br>

Render Props를 활용해 상태값을 타 컴포넌트에 공유하는 것도 가능합니다. 

### 예제 코드

```js


import { useState } from "react";
import Fahreheit from "./components/Fahreheit";
import Kelvin from "./components/Kelvin";

function Input(props) {
  const [value, setValue] = useState("");

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      {props.render(value)}
    </>
  )
};
//Input 컴포넌트는 JSX 내부 <input> 요소에서 사용자의 입력을 받아들이고 , value 상태를 통해 입력된 값을 표시, onChange 이벤트 핸들러를 통해 입력값이 변경될 때마다 setValue 함수를 호출하여 상태를 업데이트합니다.
//그리고 props.render(value)를 호출하여 render prop으로 전달된 함수를 실행합니다. 이 함수는 Fahreheit와 Kelvin 컴포넌트에 value 값을 전달하고, 해당 컴포넌트들을 렌더링합니다.




export default function App() {
  return (
    <div className="App">
      <h1>Temperature Converter</h1>

      <Input render={(value) =>
        <>
          <Fahreheit value={value} />
          <Kelvin value={value}/>
        </>
      }/>
    </div>
  );
}

//App 컴포넌트는 최상위 컴포넌트로 JSX 내부에는 위에 작성되어있는 Input 컴포넌트가 있습니다. 이 컴포넌트에는 render prop으로 함수가 전달되며, 해당 함수는 Fahreheit와 Kelvin 컴포넌트를 렌더링합니다.
//render prop으로 전달된 함수는 value를 매개변수로 받아 <Fahreheit>와 <Kelvin> 컴포넌트를 렌더링합니다. 이러한 방식으로 Input 컴포넌트와 App 컴포넌트 사이에 데이터를 전달하고 관리할 수 있습니다.

```


즉 Render props 패턴은 
어떤 컴포넌트를 렌더링할지에 대한 렌더링 로직을 상위 컴포넌트가 가지고 있고,
하위 컴포넌트인 Input은 자신이 가지고 있는 상태 값으로 상위 컴포넌트로 부터 내려받은 렌더링 로직과 조합하여 타 컴포넌트와 상태값을 공유하며 사용할 수 있도록 해주는 패턴입니다. 

<br><br>
<br>



## 그럼 언제 쓰는걸까요?
Render props 패턴은 어떤 이점이 있을까요?

### 1. 상태 관리 용이
위 예제 코드처럼 상위 컴포넌트는 '**어떤 컴포넌트를 렌더링할지에 대한 렌더링 로직**'을 을 담당하고,
하위 컴포넌트인 Input은 '**자신이 가지고 있는 상태 값**'을 상위 컴포넌트로 부터 내려받은 렌더링 로직과 조합하여 렌더링하는 역할을 담당합니다. 각 컴포넌트마다 하나씩의 역할을 담당하기 때문에 상태관리에 용이하다 할 수 있습니다. 

### 2. 컴포넌트의 재사용성을 향상
예제 코드와 함께 알아보겠습니다. 

```js
// DynamicList.js
import React from 'react';

const DynamicList = ({ data, render }) => {
  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>{render(item)}</li>
      ))}
    </ul>
  );
};

export default DynamicList;
```
위의 DynamicList 컴포넌트는 배열로 전달된 data를 동적으로 렌더링하는 역할을 합니다. 이때 각 아이템에 대한 렌더링은 render prop으로 전달된 함수를 통해 이루어집니다.


```js
// App.js
import React from 'react';
import DynamicList from './DynamicList';

const App = () => {
  const numbers = [1, 2, 3, 4, 5];
  const fruits = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango'];

  const renderNumberItem = (number) => <span>{number}</span>;
  const renderFruitItem = (fruit) => <span>{fruit}</span>;

  return (
    <div>
      <h1>Dynamic List Example</h1>
      <h2>Numbers</h2>
      <DynamicList data={numbers} render={renderNumberItem} />
      <h2>Fruits</h2>
      <DynamicList data={fruits} render={renderFruitItem} />
    </div>
  );
};

export default App;
```

위의 예시에서 DynamicList 컴포넌트를 사용하여 numbers와 fruits 배열을 렌더링합니다. 각각의 아이템은 render prop으로 전달된 함수를 통해 렌더링되므로, 동일한 DynamicList 컴포넌트를 재사용하여 다양한 데이터를 재사용할 수 있습니다.




그외에도 위 예시 코드에서 보았던 것처럼 컴포넌트 간의 상태(혹은 기능) 공유가 가능하다는 장점이 있습니다.




### 3줄 요약
1. Render Props는 props 에 JSX 를 렌더링하는 함수를 전달 하는 것을 말한다. 
2. 상태 관리가 용이하고 재사용성이 크다는 장점이 있다.
3. 사실 이해하기 어려웠다. 







