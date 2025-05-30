---
date: "2024-02-07"
title: "[React Study - 리액트를 다루는 기술] 7장. 컴포넌트의 라이프사이클 메서드"
categories: ["ReactStudy", "React"]
summary: "대표적인 리액트 스타터 툴인 CRA(Create React App)과 Vite에 대해서 알아보았습니다. "
thumbnail: "./cra와vite.png"
---

대표적인 리액트 스타터 툴인 CRA(Create React App)과 Vite에 대해서 알아보았습니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/621e53fd-8d35-4768-8924-eaf1a54cbdb2/image.png)

# Create React App(CRA)

- 리액트에서 추천하는 공식 보일러 플레이트.
- 단 하나의 종속성(CRA 자체)만으로 여러 라이브러리, webpack, eslint과 같은 필수적인 설정을 대신 세팅 해주기 때문에 간편하게 리액트 프로젝트 생성 가능
- CRA를 실행시키는 것만으로도 자동 최적화가 되기 때문에 신경 써야 할 코드양이 적고 개발자의 부담을 덜어줍니다.
- CRA에 포함된 다양한 패키지를 언제든지 사용자 정의 가능
- Autoprefixer를 지원. 즉, 일반적인 CSS 코드 생성을 하게 되면 -webkit-, -ms- 등 자동적용
- HMR(Hot Module Replacement)과 같은 유용한 기능 제공

<BR><BR>

## HMR 기능

- 특정 코드 변경 시, 브라우저 새로고침 없이 해당 부분만 리로드하는 것을 의미
- 개발모드에서만 사용
  코드가 변경 후 저장을 누르더라도, state 를 유지시켜주므로, 수정한 결과가 표시되기까지 거쳐야 하는 여러 과정들을 생략 가능 -> 개발 시 생산성 증대, 불필요한 대기시간 단축
- 예시  
  검색로직에서 필터조건을 하나 추가한 경우. 수정된 로직을 검증하려면 일반적으로 다음 과정들을 거쳐야 한다.
  **코드수정 → 저장 → 새로고침 → 검색어 입력 → 검색버튼 클릭 → API 호출 → 데이터표시**
  하지만 HMR 을 이용하면, 4 단계를 생략하고 바로 필터 적용여부를 확인할 수 있다.
  **코드수정 → 저장 → ~~새로고침 → 검색어 입력 → 검색버튼 클릭 → API 호출 →~~ 데이터표시**

![](https://velog.velcdn.com/images/dogmnil2007/post/c57933a0-d997-493b-bd8d-0cedb744b0ba/image.png)

<BR><BR>

## 커스터마이징

CRA를 통해 리액트 프로젝트를 생성하면 package.json에 기본 스크립트 명령어가 4개가 존재합니다.

```js
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
}
```

  <BR>
### eject 명령어
CRA로 프로젝트를 생성하면 설정파일이나 종속성 같은 것들을 CRA가 자체적으로 숨김처리하기 때문에 보이지 않는데. 이때 숨겨져 있는 모든 설정을 밖으로 추출해주는 명령어가 npm run eject 입니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/b6a910e8-b1d4-4280-811c-a1a4c69d9a36/image.png)

위 사진처럼 ‘한 번 실행시 되돌릴 수 없다’는 경고 문구와 함께 정말 실행할 것인지 확인하는 메세지를 확인할 수 있습니다.
<BR>

Y를 눌러 실행하면
![](https://velog.velcdn.com/images/dogmnil2007/post/738737ea-5e08-492c-bbb5-2efc25ef68e9/image.png)
config, scripts폴더가 생성되고, 그 안에 package.json에 모든 Dependencies, babel, jest 등이 전부 등장합니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/4430abfd-f2dc-41f7-ba41-574b9565b9bd/image.png)

eject 명령어 실행 전후를 비교해보면 여러가지 숨겨져있던 설정들과 패키지들이 보이는 걸 확인할 수 있습니다.

<BR><BR>

### eject를 사용하는 이유

CRA가 숨겨놓은 파일들을 원하는대로 프로젝트에 맞게 커스터마이징 하고싶을 때 사용합니다.

### eject의 단점

- CRA가 자동으로 해줬던 webpack, babel 등의 설정 및 라이브러리 간의 의존성을 사용자가 직접 유지보수해야 합니다
- 새로운 패키지 설치 시 다른 패키지와의 의존성을 체크 필요.
- 즉 위와 같은 번거로움이 발생하기 때문에 사용시 주의가 필요합니다.

<details>

<summary>진짜 돌이킬 수 없나?</summary>

<div markdown="1">
꼭 그런것은 아닌가봅니다.

https://lovemewithoutall.github.io/it/npm-run-eject-error/

</div>

</details>

<BR><BR>
<BR>

## CRA의 단점

- CRA는 자바스크립트 코드로 구성된 툴 Webpack을 사용합니다. 자바스크립트는 인터프리터 언어이기 때문에 속도가 느립니다. 프로젝트 규모가 커질수록 눈에 띄게 속도가 느려지죠.
- 높은 추상화에 따른 설정 flow를 이해하기 힘듭니다. 한마디로 하나부터 열까지 다 해주니 설정 과정을 모르고 넘어가는 경우가 태반입니다.
- SSR, CSR을 위해 별도의 작업이 필요합니다.
- 위에 언급한대로 패키지(Webpack등)의 코어 부분을 건드려야 할 때 결국 eject를 해야합니다.

<BR><BR>
<BR><BR>

# 그래서 탄생한 Vite

- 프론트엔드 개발을 위한 툴(react, vue, svelte 등 다양한 개발에 적용가능)
- Esbuild 빌드 툴 기반
- Dev Server에서 Native ES Module을 사용하여 소스를 제공
- compile-to-native 언어로 작성된 자바스크립트 툴
- Vite가 설정한 최소한의 config로도 사용 가능

<br>

## Esbuild

- Go 언어(저급언어)를 이용한 툴
- 번들링 속도 향상 -> 무려 100배나 빠르다고 합니다.
  ![](https://velog.velcdn.com/images/dogmnil2007/post/09b55163-fab1-4841-b79e-3fd8b6642132/image.png)

## Dev Server

- 개발 환경에서 HMR과 같은 기능을 제공하는 개발용 서버 기능
- Native ESM을 사용하여 소스를 제공
  ### Native ESM
  - 빠른 HMR을 지원
  - ES 모듈로 개발한 것은 따로 빌드하지 않아도, 자바스크립트 코드를 모두 번들할 필요없이, 서버에서 인터프리트하여 웹페이지를 보여줍니다.
  - 즉, ES 모듈을 사용하여 브라우저가 필요로 하는 어플리케이션 코드의 일부분만 변환하고 제공합니다.
    <br>
    <br>


### webpack(기존방식)과의 비교

Webpack과 같은 기존의 번들 기반 방식에서는 모든 소스코드가 빌드되어서 한번에 번들링된 형태로 서비스를 제공했다면, Native ESM 기반 방식의 Vite에서는 번들링이 필요가 없고 브라우저에서 필요한 모듈의 소스코드를 import할때 이것을 전달만 하면 되는 방식입니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/82fc119e-8047-487d-b837-2d22664f3d01/image.png)

위 그림을 보면 bundle(webpack)의 경우 모든 소스코드를 번들링하지만

![](https://velog.velcdn.com/images/dogmnil2007/post/ac3fede5-dd62-4557-a0e7-008c668b42f5/image.png)
ES 모듈은 필요한 모듈의 소스코드를 import 해오는 방식을 채택합니다.
즉 브라우저의 요청이 있을 시에만 소스코드를 변환하고 제공합니다.
또한, 더 빠른 리로딩과 캐싱을 위해 HTTP 상태 코드를 활용한다.

<br><br>

Vite는 네이티브 ESM을 기반으로 HMR을 구현하므로 다른 번들링 툴보다 우위에 있다고 할 수 있습니다. 모듈이 수정되면, Vite는 수정된 모듈과 관련된 부분만을 교체할 뿐이고, 브라우저에서 해당 모듈을 요청하면 교체된 모듈을 전달할 뿐입니다. 이는 어플리케이션의 크기와 관계 없이 HMR을 언제든 빠르게 이뤄지도록 하죠.

Native ESM 기반이 가능한 이유는 현재 대부분의 브라우저에서 ESM을 지원하기 때문입니다. ESM이 나오기 전에는 자바스크립트 언어레벨에서 지원하는 모듈시스템이 없었기 때문에 번들링이 필요했던 것이고, 지금은 자바스크립트 언어레벨에서 모듈시스템이 들어가 있고 거의 모든 브라우저에서 지원하기 때문에 Vite에서는 ESM을 기반으로 만들 수 있게 된 것입니다.

<br><br>
<br>

3줄 요약
CRA은 중단되었습니다. Vite를 써야합니다.
Vite는 번들링을 생략하여 개발 서버를 빠르게 구동시킵니다.
Vite는 HMR을 위해 native ESM을 사용해 변경사항이 빠르게 반영됩니다.

 <br>
 <br>
    
<details>

<summary>출처</summary>

<div markdown="1">

https://velog.io/@jaewoneee/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%B3%B4%EC%9D%BC%EB%9F%AC%ED%94%8C%EB%A0%88%EC%9D%B4%ED%8A%B8-Create-React-App-vs-Vite

https://velog.io/@haeinah/%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%B4%88%EA%B8%B0-%EC%84%A4%EC%A0%95-vite-vs-cracreate-react-app

https://vitejs.dev/guide/why.html#slow-server-start

https://analogcode.tistory.com/39

</div>

</details>
