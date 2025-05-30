---
date: "2024-03-20"
title: "[React Study - 리액트를 다루는 기술] 20장. 서버 사이드 렌더링"
categories: ["ReactStudy", "React"]
summary: "이번 포스팅은 remix에 대해서 알아보겠습니다."
thumbnail: "./image-58.png"
---

이번 포스팅은 remix에 대해서 알아보겠습니다. 서버사이드 렌더링을 쉽게 할 수 있는 프레임워크라는군요. 새로운 도구를 배우는 것은 항상 설레는 마음과 오늘도 세상이 날 억까하는구나 격노의 심정이 공존하는 경험인 것 같습니다.

remix 프로젝트를 만들기전에 서버 사이드 렌더링에 대해서 알아봅시다.

서버 사이드 렌더링은 UI를 서버에서 렌더링하는 것을 의미합니다. UI 렌더링을 브라우저에서 모두 처리하는 클라이언트 사이드 렌더링와 반대되는 개념으로 이해하셔도 괜찮을 것 같습니다.

CRA로 만든 리액트 프로젝트의 개발 서버를 실행한 다음, 크롬 개발자 도구의 Network탭을 열고 http://localhost:3000/ 페이지의 요청에 대한 응답을 보시면 다음과 같이 root 엘리먼트가 비어 있는 것을 확인할 수 있습니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/12cdf723-7da6-4ec4-abeb-df4a28a990e6/image.png)

즉, 이 페이지는 처음에 빈 페이지라는 뜻이죠. Preview 탭을 누르면 자바스크립트 없이 HTML 결과물을 확인할 수 있는데, “You need to enable JavaScript to run this app.” 라는 문구만 나타납니다. 리액트 프로젝트는 서버 사이드 렌더링을 하지 않으면 이렇게 자바스크립트가 실행되어야 비로소 개발자가 의도한 UI가 사용자에게 보여집니다.

반면, 서버 사이드 렌더링을 하게 된다면 서버 측에서 리액트 컴포넌트의 초기 렌더링을 해주며, 렌더링 결과를 HTML 응답에 넣어서 자바스크립트를 실행하기 전에도 사용자에게 UI를 보여줄 수 있습니다.

# 서버 사이드 렌더링 사용 이유

그렇다면 서버 사이드 렌더링을 왜 사용할까요?

## 1. 사용자 경험 개선

앞서 언급했듯이 클라이언트 사이드 렌더링만 하게 된다면 자바스크립트를 불러오고 실행이 될 때 까지 사용자는 비어있는 화면을 보게 됩니다. 서버 사이드 렌더링을 한다면 자바스크립트를 실행하기 이전에도 페이지의 UI를 볼 수 있기 때문에 사용자의 대기 시간이 줄어들게 됩니다. 쉽게 말하면 페이지의 내용을 사용자에게 더 일찍 보여줄 수 있다는 의미지요.

물론, 자바스크립트를 불러와서 실행할 때 까지 웹 서비스의 인터랙션 기능 (예를 들어서 버튼을 클릭하는 것)은 정상적으로 작동하진 않지만 대부분의 경우엔 사용자 인터랙션이 시작되기 전에 자바스크립트 로딩이 끝나기 때문에 걱정 할 필요가 없습니다.

## 2. 검색 엔진 최적화

서버 사이드 렌더링을 하면 구글, 네이버, 다음 등의 검색 엔진이 우리가 만든 웹 애플리케이션의 페이지를 제대로 읽어갈 수 있습니다. 구글 검색 엔진 크롤링 봇의 경우엔 페이지를 수집하면서 자바스크립트를 실행해주기 때문에 서버 사이드 렌더링을 꼭 하지 않아도 페이지를 제대로 긁어갈 수 있다고 합니다. 그럼에도 불구하고, 서버 사이드 렌더링을 해주는게 검색 엔진 최적화에 더욱 좋습니다. 그 이유는 구글 크롤링 봇이 페이지의 모든 데이터가 로딩될 때 까지 기다리지 않을 가능성이 있기 때문에 의도한 데이터가 제대로 수집되지 않을 수 있기 때문입니다. 추가적으로, 서버 사이드 렌더링을 하여 사용자에게 페이지를 더욱 일찍 보여준다면, 사용자의 페이지 이탈률을 개선시킬 수 있는 가능성이 있는데요, 페이지 이탈률은 구글 검색 결과 랭킹에 영향을 주기 때문에, 만약 여러분이 만든 페이지가 검색 결과에 잘 나타나길 바란다면 서버 사이드 렌더링을 하는 것이 좋습니다.

## 정적 페이지 및 캐싱

자주 변하지 않는 정적 페이지를 서버 사이드 렌더링을 할 경우 Redis 같은 캐시 시스템을 직접 구축해서 사용하거나, Cloudfront 또는 Cloudflare 같은 CDN에 서버 사이드 렌더링 결과물을 캐싱해서 사용한다면 응답 시간을 아주 효과적으로 단축시킬 수 있습니다.

# 서버 사이드 렌더링 단점

장점만 존재하는 프로그램은 세상에 존재하지 않습니다. 그렇다면 서버 사이드 렌더링의 단점을 알아봅시다.

## 서버 리소스 부하 관리 필요

서버 사이드 렌더링은 원래 브라우저가 해야 할 초기 렌더링을 서버가 대신 수행해주는 것이기 때문에 서버 리소스 부하 관리가 필요합니다. 갑자기 수많은 사용자가 동시에 웹 페이지에 접속하면 서버에 과부하가 발생할 수 있기 때문에 이에 대한 대비가 되어야 합니다. 이는 서버 자동 스케일링, 로드 밸런싱, 캐싱, 그리고 서버리스 기술 등을 통해 해결할 수 있는 문제입니다.

## 리액트 자체 서버 사이드 렌더링 시 복잡한 설정 및 관리

리액트에서 자체적으로 서버 사이드 렌더링 기능을 제공하긴 하지만, 실제로 이를 도입하려면 상당히 복잡합니다. 특히, 코드 스플리팅, 데이터 불러오기, 정적 파일 관리, 빌드 환경 설정 및 배포 여러가지 문제들이 얽혀서 프로젝트의 복잡도가 굉장히 높아지고, 입문자가 접근하기엔 상당히 어렵습니다.

다행히도, 복잡한 작업을 이를 간단하게 만들어주는 프레임워크들이 존재합니다. 기존에는 Next.js 라는 프레임워크가 서버 사이드 렌더링을 쉽게 해주는 유일한 프레임워크였고, 2021년에 Remix라는 프레임워크가 오픈소스로 공개되어 많은 관심을 받고 있습니다. 이 글에서는 Remix를 사용하여 서버 사이드 렌더링을 하는 방법을 알아보겠습니다. 장점들을 후술하며 Remix를 알아보도록 하겠습니다.

# remix 설치

이제 본격적으로 remix 프로젝트틀 설치해봅시다. 프론트엔드 프레임워크는 업데이트가 잦기 때문에 공식문서를 통해 설치 및 환경설정하는 것이 정신건강에 이롭습니다.

[remix 공식문서](https://remix.run/docs/en/main/start/quickstart)

```shell
npx create-remix@latest
```

위 명령어를 입력하면 설치 됩니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/70954fe8-2a4e-47f6-927d-48e137735939/image.png)

설치후 npm run dev 해줍시다.

![](https://velog.velcdn.com/images/dogmnil2007/post/160bbcd3-5f3f-4bcc-8363-8eb6c19d5a91/image.png)

정상적으로 페이지가 렌더링 되었습니다.

# remix 특징

## 디렉터리 기반 라우팅

우리가 리액트 라우터를 사용할 때 라우트를 구성할 때에는, 컴포넌트 선언 방식으로 설정을 했었던 반면, Remix의 경우에는 컴포넌트의 디렉터리에 기반하여 라우트가 설정이 됩니다.

app/routes/index.jsx 파일을 열어보시면 Index 라는 컴포넌트가 있습니다. 이 컴포넌트가 바로 우리가 만든 프로젝트의 홈 페이지입니다.

routes 디렉토리 내에 새로운 컴포넌트를 만들어봅시다.

```jsx
//app/routes/about.jsx
export default function About() {
  return <div>오! 리믹스! 하이~</div>;
}
```

![](https://velog.velcdn.com/images/dogmnil2007/post/c2aa284d-a2c5-43c5-938d-388670d71fa1/image.png)

브라우저에 http://localhost:5173/about 주소를 입력하면 방금 만든 컴포넌트가 정상적으로 렌더링되는 것을 확인할 수 있습니다.

라우트를 위한 파일을 만들때는 이렇게 컴포넌트임에도 불구하고 소문자로 작성하는 점 참고해 주세요.

### Link 라우팅

이번엔 Link 컴포넌트를 이용해 라우팅 기능을 적용시켜보겠습니다.

```jsx
//app/routes/index.jsx
import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="/about">about</Link>
        </li>
      </ul>
    </div>
  );
}
```

![](https://velog.velcdn.com/images/dogmnil2007/post/1e45fc72-277c-4895-98d2-69a3f2a7d91f/image.png)

정상적으로 동작합니다

참고로 리액트 라우터와 다르게 react-router-dom 이 아닌 @remix-run/react 에서 Link 를 불러온다는 점을 인지하시길 바랍니다. 하지만 Remix에서 react-router-dom을 의존하고 있기 때문에, 해당 라이브러리가 이미 설치가 되어 있으며 react-router-dom 에서 Link를 불러와도 정상적으로 작동하기는 합니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/253ddb9a-0683-4e39-8c29-4da4c6234a33/image.png)

<br>
<br>

코드를 작성 후, 브라우저에서 개발자 도구의 Network 탭을 열고 새로고침 해보세요.

![](https://velog.velcdn.com/images/dogmnil2007/post/ebb0e42f-ca42-4f3a-963e-d24e0867d25d/image.png)

![](https://velog.velcdn.com/images/dogmnil2007/post/5c5c1a0d-5ee7-4e01-84de-1d8ef63c464a/image.png)

맨 위의 http://localhost:3000/ 에 대한 요청에 대한 응답의 Preview를 보면, 위 스크린샷과 같이 비어있는 페이지가 아니라 컴포넌트의 내용이 보여집니다. Response 쪽의 코드를 보아도, body 가 채워져 있는 것을 볼 수 있죠 (코드가 minify 되어있기 때문에 읽기 어려울 수 있는데 좌측 하단의 {} 아이콘을 누르면 코드가 정리됩니다).

그 다음, 우리가 방금 만들었던 about 링크를 눌러보세요.

![](https://velog.velcdn.com/images/dogmnil2007/post/02b313c7-3947-4870-882c-021b02bf00e1/image.png)

Link 컴포넌트를 사용하여 About 라우트로 이동을 할 때에는 서버 사이드 렌더링을 다시 하는 것이 아니라, 코드 스플리팅된 About 컴포넌트를 불러오고, 클라이언트 사이드 렌더링을 하고 있는것을 확인 할 수 있습니다.

리믹스를 사용하면 리액트에서 제공하는 lazy 함수를 사용하지 않고도 자동으로 라우트 단위의 코드 스플리팅이 적용됩니다.

### URL 파라미터

Remix를 사용할 때에는 라우트 파일 또는 디렉터리 이름에 $id 와 같은 방식으로 파라미터 설정을 합니다.

```jsx
//app/routes/articles/$id.jsx

import { useParams } from "@remix-run/react";

export default function Article() {
  const params = useParams();
  return <div>게시글 ID: {params.id}</div>;
}
```

URL 파라미터를 조회할 땐, 리액트 라우터를 사용할 떄 처럼 useParams Hook을 사용합니다. 위와 같이 컴포넌트를 작성 후 브라우저의 주소창에 http://localhost:5173/articles/1 을 입력하고 결과를 확인해보면

![](https://velog.velcdn.com/images/dogmnil2007/post/ea4a1b02-b906-492e-9054-8d73c8531ace/image.png)

정상적으로 렌더링되는 것을 확인할 수 있습니다.

### Outlet

Remix에서도 Outlet 기능을 사용할 수 있는데, 디렉터리 기반으로 작동합니다.

```jsx
//app/routes/articles.jsx

import { Link, Outlet } from "@remix-run/react";

export default function Articles() {
  return (
    <div>
      <Outlet />
      <hr />
      <ul>
        <li>
          <Link to="/articles/1">게시글 1</Link>
        </li>
        <li>
          <Link to="/articles/1">게시글 2</Link>
        </li>
        <li>
          <Link to="/articles/1">게시글 3</Link>
        </li>
      </ul>
    </div>
  );
}
```

이렇게 라우트 컴포넌트에서 Outlet 컴포넌트를 렌더링하면, 해당 경로의 하위 라우트들이 Outlet 컴포넌트가 사용한 자리에 나타나게 됩니다. 다음과 같이 말이죠.

주의하실 점은, Articles 라우트가 위치한 곳이 app/routes/articles/index.jsx 가 아니라 해당 디렉터리의 상위 디렉터리에 같은 이름을 가진 파일인 articles.jsx를 생성했다는 것 입니다. 만약 articles/index.jsx 파일을 만들게 된다면 Outlet이 정상적으로 작동하지 않고 Articles와 Article 라우트가 독립적으로 작동하게 됩니다.

또 다른 예시를 들어보겠습니다. 만약 다음과 같은 Outlet이 적용된 라우트를 구성한다고 가정해봅시다.

/movies/1
/movies/1/reviews
/movies/1/actors
/movies/1/related

위 라우트들이 모두 같은 레이아웃을 가지고 있다고 가정하고, /moives/1 경로에 들어왔을땐 영화의 상세 정보를 보여준다고 가정을 해보겠습니다.

이러한 상황엔 다음과 같이 라우트 파일을 만들어주어야 합니다.

app
└── movies
├── $id
│ ├── actors.jsx
│ ├── index.jsx
│ ├── related.jsx
│ └── reviews.jsx
└── $id.jsx

그리고, app/movies/$id.jsx 에서 공통된 레이아웃과 함께 Outlet 컴포넌트를 사용헤야 정상적으로 작동합니다.

### 3줄요약

1. 서버 사이드 렌더링은 서버 측에서 리액트 컴포넌트의 초기 렌더링을 해주며, 렌더링 결과를 HTML 응답에 넣어서 자바스크립트를 실행하기 전에도 사용자에게 UI를 보여주는 렌더링기법이다.
2. 서버 사이드 렌더링은 사용자 경험 증진, 검색 엔진 최적화 등의 장점이 있다.
3. remix는 서버 사이드 렌더링이 가능한 프론트엔드 프레임워크의 한 종류이다.
