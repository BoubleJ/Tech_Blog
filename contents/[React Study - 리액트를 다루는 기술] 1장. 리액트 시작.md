---
date: "2024-01-17"
title: "[React Study - 리액트를 다루는 기술] 1장. 리액트 시작"
categories: ["ReactStudy", "React"]
summary: "자바스크립트 프레임워크 - Vue.js, electron, React Native, Angular 등"
thumbnail: "./mvc패턴.png"
---

### 자바스크립트 프레임워크

- Vue.js, electron, React Native, Angular 등
- 위 프레임워크들은 MVC(Model-View-Controller) 아키텍처, MVVC(Model-View-View-Controller) 아키텍처로 애플리케이션 구조화
  ![](https://velog.velcdn.com/images/dogmnil2007/post/6a8d73c5-8976-4af9-80a2-2eec5138c391/image.png)

<BR>

**하지만**

# 리액트는?

오로지 V(View)만 신경쓰는 **자바스크립트 라이브러리**

  <BR>
  <BR>

# 리액트 특징

- 데이터가 변할 때마다 변화를 주는것이 아닌, 기존 뷰(View)를 날려버리고 처음부터 새로 렌더링하는 방식 채택(Virtual DOM 사용)
- 재사용이 가능한 컴포넌트(Compoenent)라는 선언체 사용
- Vue.js, Angular 과 같은 프레임워크와 다르게 **라이브러리**기 때문에 데이터모델링, 라우팅과 같은 부가기능 미보유
  -> Axiox, React-Router, Redux 와 같은 라이브러리(or 프레임워크) 활용을 통해 보완

<BR>
<BR>

# React 작업 환경 설정

## node.js

- 크롬 V8 자바스크립트 엔진으로 빌드한 자바스크립트 런타임(Javascript Runtime)
- 웹 브라우저 환경이 아닌 곳에서도 자바스크립트 사용 가능
- 프로젝트 개발에 필요한 도구들(Babel, webpack 등)이 node.js를 사용하기 때문에 설치 필요
- node.js를 설치하면 npm(Node Package Manage)도 설치된다.
- 참고로 node.js를 설치할 때 LTS 버전, Current 버전을 고를 수 있는데 LTS는 'Long Term Support'의 줄임말로 'Node.js 커뮤니티에 의해 장기간 지원받을 수 있는 버전이라는 뜻이다. 보편적으로 LTS 버전을 사용한다.

<details>

<summary>자바스크립트 런타임이란?</summary>

<div markdown="1">

**런타임**
프로그래밍 언어가 구동되는 환경을 의미

### 즉 자바스크립트가 구동되는 환경을 자바스크립트 런타임이라 한다.

대표적으로 Browser(크롬, 사파리 등), node.js, react native, electron 등이 있다.

런타임 환경 및 브라우저마다 자바스크립트 엔진이 다른데 node.js, Chrome 브라우저의 경우 구글에서 만든 V8 엔진을 사용.

</div>

</details>
 
  
  
  
     <BR><BR>

## NPM & Yarn

- npm과 yarn은 자바스크립트 런타임 환경인 노드(Node.js)의 패키지 관리자
- npm 혹은 yarn을 통해 수 많은 패키지의 설치 및 버전관리가 가능

### NPM & Yarn 차이점

|               |                                npm                                 |                                     yarn                                     |
| :-----------: | :----------------------------------------------------------------: | :--------------------------------------------------------------------------: |
| 설치 프로세스 |                     한번에 하나 씩 순차적 처리                     |                            여러 패키지 동시 설치                             |
|     속도      |                            (상대적)느림                            |                                 (상대적)빠름                                 |
|     보안      | 패키지 내 포함된 다른 패키지 코드도 실행하기 때문에 (상대적)덜안전 | yarn.lock 또는 package.json파일에 있는 파일만을 설치하기 때문에 (상대적)안전 |
|    명령어     |              ex. 패키지 설치 : npm install [패키지명]              |                    ex. 패키지 설치 : yarn add [패키지명]                     |

<BR><BR>

## create-reat-app (CRA)

- 리액트 프로젝트 생성시 필요한 웹팩, 바벨의 설치 및 설치과정을 생략하고 간편하게 작업환경을 구축해 주는 도구
- 추후 커스터마이징 가능

### 사용법

NPM 사용시

```
npm init react-app <프로젝트 이름>
```

yarn 사용시

```
yarn init react-app <프로젝트 이름>
```

  <details>

<summary>참고. npx란?</summary>

<div markdown="1">

참고로 본인은

```
npx create-react-app <프로젝트 이름>
```

이라는 명령어를 사용하는데
npx(node.js package eXecute)는 자바스크립트 패키지 관리 모듈로 node.js package를 실행할 때 사용하는 모듈이다.

명령줄에서 직접 로컬로 설치된 명령줄 도구를 실행할 수 있도록 npm에서 제공하는 명령어/툴이다.

Node.js 도구를 전역에 설치하지 않고도 실행할 수 있게 해준다.

즉 패키지를 설치하고 실행 → 이후 삭제

일회용 프로그램을 설치할 때 유용하다.

</div>

</details>
  


   <BR>
 <BR>
 <BR>
   <BR>
  <details>

<summary>Reference</summary>

<div markdown="1">

https://www.codeit.kr/tutorials/15/LTS%EC%9D%98-%EC%9D%98%EB%AF%B8

https://joshua1988.github.io/vue-camp/package-manager/npm-vs-yarn.html#yarn

</div>

</details>
