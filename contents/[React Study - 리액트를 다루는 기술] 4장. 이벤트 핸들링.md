---
date: "2024-01-24"
title: "[React Study - 리액트를 다루는 기술] 4장. 이벤트 핸들링"
categories: ["ReactStudy", "React"]
summary: "4장은 리액트 이벤트 설정인데 다들 아실거라 생각되어 이벤트 핸들링의 원리를 딥다이브 해보았습니다."
thumbnail: "./리액트구조.png"
---




4장은 리액트 이벤트 설정인데 다들 아실거라 생각되어 이벤트 핸들링의 원리를 딥다이브 해보았습니다.

# 리액트 이벤트 핸들링 원리

## 이벤트(Event)란
- 웹 브라우저에서 DOM 요소와 사용자가 상호작용하는 것을 의미
- 사용자가 버튼을 클릭하거나 입력창에 정보를 입력하는 등 다양한 행위들 모두 이벤트라 할 수 있습니다.
- 즉 이벤트가 발생했다는 것은 웹 페이지에서 특정 동작이 발생하여, 웹 브라우저가 그 사실을 알려주는 것 입니다.

## 이벤트 핸들러란(EventHandler)?
- 특정 요소(ex. Dom 요소)에서 발생하는 이벤트를 처리하기 위해 사용되는 함수
- 이벤트 핸들러가 연결된 특정 요소에서 지정된 타입의 이벤트가 발생하면 웹 브라우저는 연결된 이벤트를 실행
- onclick, onkeydown 등 다양한 함수가 존재

예시
```js

//<script>
function handleclickBtn() {
	let time = new Date()
	console.log(time.toLocalString())
}
 
//<body>
<input type='button' value='click' onclick='handleclickBtn()'>
  //button 요소를 클릭하면 handleclickBtn 함수가 실행


```


리액트도 자바스크립트와 마찬가지로 onClick, onChange등의 이벤트 핸들러를 사용합니다. 

```js
import React, { useCallback } from "react";

export default function App() {
  const handleClick = useCallback((e) => {
    console.log("Event Object: ", e);
  }, []);

  return (
    <div className="App">
      <button onClick={handleClick}>Try Me!</button>
    </div>
  );
}

//button 요소 클릭시 handleClick 함수 실행

```
<br><br>

그렇다면 리액트의 이벤트핸들링 원리를 자세히 알아봅시다.

리액트 공식문서에 따르면, React 17버전부터 이벤트 핸들러를 “Document” 레벨이 아닌 리액트 트리가 렌더되는 root DOM container에 접근한다고 명시되어있습니다. 
즉 16 이하 버전과 17 이후 버전에 이벤트 핸들러를 부착하는 방식이 차이가 있다는 뜻입니다.


즉, 이벤트 핸들러를 내가 Button 컴포넌트에 붙이든, Input 컴포넌트에 붙이든 상관없이 모든 이벤트 핸들러들이 **root DOM container**에 부착된다는 의미입니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/d1d32690-866d-49fb-9aa5-b99c2b9e1045/image.png)

다음 예시를 통해 확인해보겠습니다.
```js
import React, { useCallback } from "react";

export default function App() {
  const handleClick = useCallback((e) => {
    console.log(e.nativeEvent.currentTarget);
  }, []);

  return (
    <div className="App">
      <button id="test" onClick={handleClick}>
        Try Me!
      </button>
    </div>
  );
}
```
결과
![](https://velog.velcdn.com/images/dogmnil2007/post/ed53dd2e-f5c0-4e48-9da0-f28c57a4f952/image.png)
위 결과를 통해 e.nativeEvent.currentTarget이 root Node임을 확인할 수 있습니다.
즉  리액트는 이벤트 위임(Event Delegation) 방식을 통해 이벤트를 처리합니다.
특정 컴포넌트의 버튼에서 클릭 이벤트가 발생하더라도, 실제로 이벤트 핸들러는 해당 버튼에 붙어있는 것이 아닌 root DOM Container 에 붙어있게 되는 것입니다.

### 왜 이런 업데이트를 진행했을까요?
기존(17버전 이전)에는 규모가 큰 앱의 리액트 버전을 업데이트 할 때, 한번에 업데이트 하지 않고 부분부분 업데이트를 하는 상황, 즉 하나의 애플리케이션에서 서로 다른 버전의 리액트가 존재하는 상황에서 이러한 이벤트 핸들링의 방식이 버그 요인으로 지목 되곤 했습니다. 
하나의 애플리케이션에서 서로 다른 두 버전의 리액트가 존재한다고 했을 때, 두 버전의 리액트가 모두 Document Level에 이벤트 리스너를 부착하기 때문에 버그가 생기기 쉬운 환경이 되는 것입니다.

하지만 이번 업데이트에서는 이벤트 리스너를 Document Level이 아닌 root DOM container에 부착함으로써, 서로 다른 버전의 리액트가 각자 자신의 root DOM container에서 이벤트 리스너를 각기 독립적으로 운영할 수 있게 되었습니다.
즉 최적화를 위한 업데이트라 할 수 있습니다. 

