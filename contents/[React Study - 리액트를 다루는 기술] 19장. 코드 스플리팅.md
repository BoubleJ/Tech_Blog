---
date: "2024-03-20"
title: "[React Study - 리액트를 다루는 기술] 19장. 코드 스플리팅"
categories: ["ReactStudy", "React"]
summary: "이번 포스팅은 코드 스플리팅에 대해서 알아보겠습니다."
thumbnail: "./image-59.png"
---

이번 포스팅은 코드 스플리팅에 대해서 알아보겠습니다.

예를 들어 페이지 A, B, C로 구성된 싱글 페이지 애플리케이션(SPA)을 개발한다고 가정해 봅시다.

사용자가 A 페이지에 방문했다면 B 페이지와 C 페이지에서 사용하는 컴포년트 정보는 필요하지 않습니다. 사용자가 실제로 B 혹은 C 페이지로 이동하려고 할 때만 필요하겠죠.

하지만 리액트 프로젝트에 별도로 설정하지 않으면 A. B, C 컴포넌트에 대한 코드가 모두 한 파일(main)에 저장되어 버립니다. 만약 애플리케이션의 규모가 커지면 지금 당장 필요하지 않은 컴포넌트 정보도 모두 불러오면서 파일 크기가 매우 커집니다. 그러면 로딩이 오래 결리기 때문에
사용자 경험도 안 좋아지고 트래픽도 많이 나오겠지요.

이러한 문제점을 해결해 줄 수 있는 방법이 바로 코드 비동기 로딩입니다. 이 또한 코드 스플리팅 방법 중 하나입니다.
코드 비동기 로딩을 통해 자바스크립트 함수, 객체, 혹은 컴포넌트를 처음에는 불러오지 않고 필요한 시점에 불러와서 사용할 수 있습니다.

# 자바스크립트 함수 비동기 로딩

다음과 같이 코드를 짜줍니다.

```js
//notify.js

export default function notify() {
  alert("안녕하세요!");
}
```

```js
import notify from "./notify";

function App() {
  const onClick = () => {
    notify();
  };
  return (
    <div className="App">
      <header className="App-header">
        <p onClick={onClick}>Hello React!</p>
      </header>
    </div>
  );
}

export default App;
```

![](https://velog.velcdn.com/images/dogmnil2007/post/6d61f01a-3e1b-4273-8d6d-85f78eaaf75d/image.png)

이렇게 코드를 작성하고 빌드하면 notify 코드가 프로젝트내 main 파일 안에 들어가게 됩니다.

하지만

```js
//app.js

function App() {
  const onClick = () => {
    import("./notify").then((result) => result.default);
  };
  return (
    <div className="App">
      <header className="App-header">
        <p onClick={onClick}>Hello React!</p>
      </header>
    </div>
  );
}

export default App;
```

위 코드와 같이 import를 상단에서 불러오지않고 함수 형태로 메서드 안에서 사용하면 파일을 따로 분리시켜 저장합니다. 그리고 실제 함수가 필요한 지점에 파일을 불러와서 함수를 사용할 수 있습니다.

import를 함수로 사용하면 Promise를 반환합니다. 이렇게 import를 함수로 사용하는 문법을 dynamic import라는 합니다.

현재는 웹팩에서 지원하고 있으므로 별도의 설정 없이 프로젝트에 바로 사용할 수 있습니다. 이 함수를 통해 모툴을 불러올 때 모듈에서 default로 내보낸 것은 result.default를 참조해야 사용할 수 있습니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/1eb2a54c-784a-478c-9e8a-4a610fe567a8/image.png)

이 상태에서 hello world를 클릭 후 개발자도구 network 탭을 열어보면 새로운 자바스크립트 파일이 불러져와있음을 확인할 수 있고, 이 파일 내용을 확인해보면

![](https://velog.velcdn.com/images/dogmnil2007/post/0c46ec24-d3e8-41aa-8ac3-aaa55edffd22/image.png)

notify에 관련된 코드만 들어있음을 확인할 수 있습니다.

# React.lazy와 Suspense를 통한 컴포넌트 코드 스플리팅

이번에는 리액트에 내장된 React.lazy와 Suspense기능으로 코드 스플리팅을 구현해봅시다.

일단 다음과 같이 코드를 짜줍니다.

```js
//app.js
import React, { useState, Suspense } from "react";

const SplitMe = React.lazy(() => import("./SplitMe"));

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p onClick={onClick}>Hello React!</p>
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      </header>
    </div>
  );
}
export default App;
```

그리고 개발자도구 network 탭에서 online을 클릭해 인터넷 속도를 느리게 한 후 hello world 문구를 클릭해줍니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/cb81da05-8973-4571-861a-9a0e095b1ff2/image.png)

fallback 속성인 loading.. 문구가 뜨는 것을 확인할 수 있습니다. 그리고 클릭하니 SplitMe관련 자바스크립트 파일로 불러와지는군요.

# loadable Components를 통한 코드 스플리팅

loadable Components는 코드 스플리팅을 지원하는 서드파티 라이브러리로 서버 사이드 렌더링을 지원한다는 특징이 있습니다. 또한 렌더링하기 전 필요할 때 스플리팅된 파일을 미리 불러올 수 있는 기능도 있습니다.

loadable Components 라이브러리를 설치해주고 다음과 같이 코드를 짜줍니다.

```js
import React, { useState } from "react";
import loadable from "@loadable/component";
const SplitMe = loadable(() => import("./SplitMe"), {
  fallback: <div>loading...</div>,
});

function App() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  const onMouseOver = () => {
    SplitMe.preload();
  };
  return (
    <div className="App">
      <header className="App-header">
        <p onClick={onClick} onMouseOver={onMouseOver}>
          Hello React!
        </p>
        {visible && <SplitMe />}
      </header>
    </div>
  );
}

export default App;
```

lazy와 사용법은 비슷하지만 suspense를 사용할 필요 없다는 점이 특징입니다.

```js
const onMouseOver = () => {
    SplitMe.preload();
```

위 코드를 넣어주면 마우스 커서를 hello world에 올리기만 해도 로딩이 시작됩니다. 그리고 문구를 클릭하면 렌더링이 됩니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/ce904df9-04c1-452b-ad4d-daa8e88eec1d/image.png)

마우스를 올리기만했는데 SplitMe관련 자바스크립트 파일을 불러오는 것을 확인할 수 있습니다.
이제 클릭해주면
![](https://velog.velcdn.com/images/dogmnil2007/post/af9208ff-1409-4e72-8ed6-2296b4466d2d/image.png)

정상적으로 렌더링되는 것을 확인할 수 있습니다.

### 3줄 정리

1. 코드 스플리팅이란 파일을 분리하는 작업으로 번들사이즈를 줄여주는 효과가 있다.
2. React.lazy와 Suspense 혹은 loadable Components를 활용할 수 있다.
3. loadable Components는 서버 사이드 렌더링에서도 적용가능하다. (React.lazy와 Suspense는 서버사이드렌더링에선 안된다.)
