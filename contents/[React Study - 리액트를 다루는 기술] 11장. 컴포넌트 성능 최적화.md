---
date: "2024-02-21"
title: "[React Study - 리액트를 다루는 기술] 11장. 컴포넌트 성능 최적화"
categories: ["ReactStudy", "React"]
summary: "오늘은 React.memo를 사용해 컴포넌트 성능 최적화 방법을 알아보겠습니다."
thumbnail: "./리액트메모.jpg"
---

오늘은 React.memo를 사용해 컴포넌트 성능 최적화 방법을 알아보겠습니다.

# React.memo

React.memo 함수를 사용하면 컴포넌트의 props가 바뀌지 않았다면, 리렌더링을 방지할 수 있다고 합니다.

즉, 메모화된 버전의 컴포넌트로 해당 컴포넌트의 props가 변경될 때만 리렌더링을 할 수 있습니다.
커다란 큐모의 컴포넌트나 복잡한 상황에서 불필요한 리렌더링을 막아 성능을 최적화할 수 있습니다

사용법은 매우 간단합니다. 컴포넌트를 만들고 감싸주기만 하면 됩니다.

```js
export function Movie({ title, releaseDate }) {
  return (
    <div>
      <div>Movie title: {title}</div>
      <div>Release date: {releaseDate}</div>
    </div>
  );
}

export const MemoizedMovie = React.memo(Movie);
//위처럼 React.memo 함수의 파라미터에 컴포넌트를 넣어주면 된다고 합니다.
```

이제 위 컴포넌트는 props값이 바뀌지 않으면 렌더링되지 않습니다.

참 편하고 좋군요. 하지만 문득 궁금해집니다. 도대체 어떤 원리로 불필요한 렌더링을 막아주고 최적화를 이룩하는지 말입니다.

## React.memo 동작원리

memo 함수의 동작원리를 알기 전 리액트 자체의 구동원리를 알 필요가 있습니다.

### 리액트 구동원리를 간략하게 설명하자면

React는 먼저 컴포넌트를 렌더링(rendering) 한 뒤, 이전 렌더된 결과와 비교하여 DOM 업데이트 여부를 결정합니다. 만약 렌더 결과가 이전과 다르다면, React는 DOM을 업데이트합니다. 즉 값이 변경되고 변경된 값이 화면에 렌더링된다는 뜻입니다.
반대로 렌더 결과가 이전과 같다면 변경된 값이 없으니 업데이트를 진행하지 않습니다.

이러한 UI 성능을 증가시키기 위해, React는 고차 컴퍼넌트(Higher Order Component, HOC)인 React.memo()를 제공합니다. 렌더링 결과를 메모이징(Memoizing)함으로써, 불필요한 리렌더링을 건너뛰게 해주는 역할을 합니다.

<details>

<summary>고차 컴포넌트</summary>

<div markdown="1">

고차 컴포넌트란

- 컴포넌트 로직을 재사용하기 위한 React의 고급 기술입니다.
- 고차 컴포넌트(HOC)는 React API의 일부가 아니며, React의 구성적 특성에서 나오는 패턴이라고 합니다.
- 즉 고차 컴포넌트는 컴포넌트를 가져와 새 컴포넌트를 반환하는 함수입니다.

</div>

</details>

<details>

<summary>메모이징(Memoizing)</summary>

<div markdown="1">

메모이징이란

- memoization은 기존에 수행한 연산의 결과 값을 어딘가에 저장해두고 동일한 입력이 들어오면 재활용하는 프로그래밍 기법을 말합니다.
- 말 그대로 메모한 내용을 재사용한다 이해해도 좋을 것 같습니다.
- memoization을 적절히 사용하면 중복 연산을 피할 수 있기 때문에 메모리를 조금 더 쓰더라도 애플리케이션의 성능 최적화가 가능합니다.

</div>

</details>

그리고 다음 렌더링이 일어날 때 props가 같다면, React는 메모이징(Memoizing)된 내용을 재사용한다.
즉 새로운 컴포넌트를 만들지않고 메모이징 되어있던 컴포넌트를 재사용합니다.

위에 언급했던 Movie 컴포넌트로 예를 들어보면

```js
export function Movie({ title, releaseDate }) {
  return (
    <div>
      <div>Movie title: {title}</div>
      <div>Release date: {releaseDate}</div>
    </div>
  );
}

export const MemoizedMovie = React.memo(Movie);
```

React.memo(Movie)는 새로 메모이징된 컴포넌트인 MemoizedMovie를 반환합니다.

MemoizedMovie의 렌더링 결과는 메모이징 되어있는 상태고 만약 title이나 releaseData 같은 props가 변경 되지 않는다면 다음 렌더링 때 메모이징된 컴퍼넌트인 MemoizedMovi를을 그대로 사용합니다.

```js
// 컴포넌트 첫 렌더링입니다. React는 React.memo(Movie)함수를 호출한 뒤 MemoizedMovie 컴포넌트를 반환합니다.
<MemoizedMovie
  movieTitle="Heat"
  releaseDate="December 15, 1995"
/>

// 다시 렌더링 한 경우 입니다. props 값이 변한게 없으므로 React는 MemoizedMovie 컴포넌트를 그대로 사용하고 리렌더링을 하지않습니다.
<MemoizedMovie
  movieTitle="Heat"
  releaseDate="December 15, 1995"
/>
```

이제 이런 의문이 듭니다.

### 아니 이렇게 좋은 최적화 방법이 있으면 모든 컴포넌트에 다 써먹어도 되는거 아닌가요?

A. 네 아닙니다.

### 왜요?

최적화에는 비용이 따르기 때문입니다.

이 memo 메서드는 부모 컴포넌트가 변경이 발생할 때마다 해당 컴포넌트로 이동하여 기존 props 값과 새로운 props의 값을 비교하게 되는데 이 과정에서 리액트는 2가지 작업을 할 수 있어야합니다.

1. 먼저 기존의 props 값을 저장할 공간이 필요
2. props를 비교하는 작업

따라서, 이 효율은 어떤 컴포넌트를 최적화하느냐에 따라 달라지게 됩니다.
컴포넌트를 재렌더링하는 데에 필요한 성능 비용과 props를 비교하는 성능 비용을 비교해 더 효율적인 방법을 채택해야합니다.
props의 개수와 컴포넌트의 복잡도, 그리고 자식 컴포넌트의 수 등 다양한 변수에 따라 효율적인 컴포넌트 운영방법이 달라지므로 상황에 따라 적절히 사용하는 것이 중요합니다.

## 그렇다면 언제 쓰는 것이 좋을까?

예상 하셨겠지만 같은 props로 렌더링이 자주 일어날 것이라 예상되는 컴포넌트에 사용하면 좋습니다.

일반적으로 부모 컴퍼넌트에 의해 하위 컴퍼넌트가 같은 props로 리렌더링 되는 경우가 있습니다.

위에서 정의한 Movie를 다시 사용해서 예시를 들어봅시다.
여기 Movie의 부모 컴퍼넌트인 실시간으로 업데이트되는 영화 조회수를 나타내는 MovieViewsRealtime 컴퍼넌트가 있습니다.

```js
function MovieViewsRealtime({ title, releaseDate, views }) {
  return (
    <div>
      <Movie title={title} releaseDate={releaseDate} />
      Movie views: {views}
      // 위에 예시로 작성한 Movie 컴포넌트
    </div>
  );
}
```

이 어플리케이션은 1초마다 서버에서 데이터를 폴링(Polling)해서 MovieViewsRealtime 컴퍼넌트의 views를 업데이트합니다.

```js
// 첫 렌더링
<MovieViewsRealtime
  views={0}
  title="Forrest Gump"
  releaseDate="June 23, 1994"
/>

// 1초 후, views is 10
<MovieViewsRealtime
  views={10}
  title="Forrest Gump"
  releaseDate="June 23, 1994"
/>

// 2초 후  views is 25
<MovieViewsRealtime
  views={25}
  title="Forrest Gump"
  releaseDate="June 23, 1994"
/>
```

views가 새로운 숫자가 업데이트 될 때 마다 MoviewViewsRealtime 컴퍼넌트 또한 리렌더링 됩니다. 하지만 Movie 컴포넌트의 title이나 releaseData가 같음에도 불구하고 같이 리렌더링 됩니다.

이러한 경우가 Movie 컴퍼넌트에 메모이제이션을 적용할 적절한 케이스입니다.

```js
function MovieViewsRealtime({ title, releaseDate, views }) {
  return (
    <div>
      <MemoizedMovie title={title} releaseDate={releaseDate} />
      //메모이징된 MemoizedMovie 컴포넌트 사용 Movie views: {views}
    </div>
  );
}
```

MovieViewsRealtime에 메모이징된 컴퍼넌트인 MemoizedMovie를 대신 사용해 title 혹은 releaseDate props가 같다면, React는 MemoizedMovie를 리렌더링 하지 않을 것이고 MovieViewsRealtime 컴퍼넌트의 성능을 향상 시킬 수 있습니다.

### 3줄 요약

1. react.memo는 컴포넌트 최적화를 위한 고차컴포넌트의 일종이다.
2. 동일한 props를 전달받을 경우 react.memo 함수를 사용하면 좋다.
3. 컴포넌트마다 역할과 성능이 다르므로 무분별한 react.memo 함수 사용보다는 컴포넌트 구조에 맞춰 사용하는 것이 좋다.
