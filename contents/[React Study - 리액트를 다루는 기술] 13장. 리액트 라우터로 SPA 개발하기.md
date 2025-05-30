---
date: "2024-02-28"
title: "[React Study - 리액트를 다루는 기술] 13장. 리액트 라우터로 SPA 개발하기"
categories: ["ReactStudy", "React"]
summary: "다들 react router는 한번쯤 사용해보셨을텐데요. 전 주로 BrowserRouter를 사용해왔습니다."
thumbnail: "./리액트라우터.png"
---

다들 react router는 한번쯤 사용해보셨을텐데요. 전 주로 BrowserRouter를 사용해왔습니다.

react router v6.4 업데이트에서 다음과 같은 새로운 router가 추가되었습니다.

1. createBrowserRouter
2. createMemoryRouter
3. createHashRouter
4. createStaticRouter

그 중 `CreateBrowserRouter` 라는 새로운 라우팅 방식을 조사해봤습니다.

먼저 기존 방식 BrowserRouter 를 사용한 라우팅 방식입니다.

```js
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    {" "}
    // 최상단 root에서 BrowserRouter로 감싸기
    <App />
  </BrowserRouter>
);
```

```js
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        // outlet을 이용한 중첩라우팅
        <Route index element={<Main />} />
        <Route path="/pageA" element={<PageA />} />
        <Route path="/pageB" element={<PageB />} />
        <Route path="/pageC" element={<PageC />} />
      </Route>
    </Routes>
  );
};
```

# 1. CreateBrowserRouter 사용법

## 개요

- Router.js : 각 path에 맞는 element를 매칭하여 내보내는 역할.

- react-router-dom에서 createBrowserRouter를 import합니다.

- 각 페이지에서 보여줄 path와 element, 중첩라우팅을 위한 children을 적습니다.

- 배열안에 담긴 객체형태로 담아서 export합니다.
  (가장 상단의 페이지가 부모, children으로 들어오는 페이지가 자식페이지 입니다. 부모 -> 자식은 path가 이어진다고 생각하면 편합니다. )
  ex> 부모 /movie,
  자식 /movie/detail, /movie/video ....

## router.jsx

기존 방식과는 다르게 router라는 새로운 컴포넌트를 만들어서 route 링크 들만 따로 분리를 시켜서 관리하도록 했습니다.
기존 구성에서 중첩 되어있는 경로는 children을 이용해서 중첩을 사용할 수 있습니다.

```js
//router.jsx

import { createBrowserRouter } from "react-router-dom";

// App.js를 Root.js로 만들 수 있다.
// import Root from "./routes/root";

import App from "./App";
import NotFound from "./pages/NotFound";
import MainPage from "./pages/MainPage/MainPage";
import DetailPage from "./pages/DetailPage/DetailPage";
import SearchPage from "./pages/SearchPage/SearchPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        // index: true, 대신 path: "", 도 가능
        element: <MainPage />,
      },
      {
        path: ":movieId",
        element: <DetailPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
    ],
  },
]);
```

### 디테일 설명

1. src의 하위파일로 Router.js를 생성합니다.

2. createBrowserRouter를 import합니다.
   `import { createBrowserRouter } from "react-router-dom";`

3. 전체 컴포넌트의 root가 될 최상위 컴포넌트를 import합니다.
   `import App from "./App";`

4. 라우팅 하고 싶은 각각의 페이지들을 모두 import합니다.

(위 예시에서는 NotFound, MainPage, DetailPage, SearchPage)

5. router라는 이름의 변수를 선언하고 export합니다.

6. router는 createBrowserRouser()안에 라우팅할 각 페이지를 담습니다.

7. 최상위 역할을 할 컴포넌트를 가장 상단에 적고 하위 컴포넌트들을 children안에 적는다.
   (path에 따라서 매칭되는 element에 적힌 컴포넌트가 화면에 렌더링될 것입니다.)

8. children을 통해서 중첩라우팅을 할 수 있습니다.
   (부모로 부터 path가 이어집니다.)

> 🔔참고. 시작페이지를 지정할때는 index: true를 적어도 되고 path를 ""로 적어도 됩니다.

```js
  index: true,
element: <MainPage />,

         //혹은

path: "",
 element: <MainPage />,

```

## index.js

1. src의 하위폴더로 index.js를 생성합니다.
   (이미 존재하면 별도로 만들지 않아도 됩니다. )

2. React, ReactDOM을 각각 import합니다.

3. react-router-dom에서 RouteProvider를 import합니다.

4. router를 Router.js에서 import합니다.

5. ReactDOM.createRoot(...).render를 통해 router를 provider안에 넣습니다.

6. 즉 RouterProvider를 이용해서 구성요소들을 전달하고 활성화 합니다.

```js
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
```

### 3줄 요약

1. react-router v6.4 은 4가지 라우팅 방법이 있다.
2. 현재 BrowserRouter 보다 사용률이 높기에 적극활용을 권장한다.
3. 프로젝트 구조에 따라 적합한 라우팅 방법을 사용하면 된다.
