---
date: "2024-01-24"
title: "[React Study - 리액트를 다루는 기술] 3장. 컴포넌트"
categories: ["ReactStudy", "React"]
summary: "React Component란? 리액트로 만들어진 앱을 이루는 최소한의 단위"
thumbnail: "./네이버컴포넌트.png"
---




# React Component란?
- 리액트로 만들어진 앱을 이루는 최소한의 단위
- 밑 사진 빨간 박스 하나하나가 모두 컴포넌트
![](https://velog.velcdn.com/images/dogmnil2007/post/99deeaa1-8a13-4c6b-a3c8-a38d594f9cf0/image.png)


<br>
<br>

## 리액트 컴포넌트 특징
1. 데이터가 주어졌을 때 이에 맞추어 UI를 생성.
2. 라이프 사이클 API를 이용해 컴포넌트가 화면에 Mount, Update, Unmount 될 때 주어진 작업 처리 가능 
3. 기존의 웹 프레임워크는 MVC방식으로 분리하여 관리하여 각 요소의 의존성이 높아 재활용이 어렵다는 단점이 있지만, 리액트 컴포넌트는 MVC의 V(View)를 독립적으로 구성하여 **재사용**을 할 수 있고 이를 통해 새로운 컴포넌트 생성 가능 
→ 타 프레임워크와 달리 뷰(View) 하나만 바뀌어도 나머지 Control, Model 영역에 영향을 주지 않습니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/5a41aaec-692b-4d72-847b-e6cfab50858b/image.png)

4. props 라는 속성을 이용해 같은 컴포넌트여도 다르게 렌더링 가능합니다.
5. 위에 언급했듯이 컴포넌트를 통해 UI를 재사용 가능한 개별적인 여러 조각으로 나누고, 각 조각을 재사용할 수 있습니다. 
→ 컴포넌트 사용의 가장 큰 목적
<br>
### 예시
밑 사진의 컴포넌트를 재사용해
![](https://velog.velcdn.com/images/dogmnil2007/post/baa6cf6f-18ec-4bf1-90fd-3dac931a2682/image.png)

다음과 같은 컴포넌트를 화면을 구상할 수 있습니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/f20a75de-134e-421d-9553-cafd9d9444f4/image.png)

<br>
<br>


# 컴포넌트 선언 방법
리액트에서 컴포넌트를 선언하는 방법은 클래스형 컴포넌트와 함수형 컴포넌트가 있습니다.

클래스형 컴포넌트 예시
```js
import react, {Component} from "react";
//Component로 부터 상속


class App extends Component() {
  render() {
    //render 함수가 반드시 있어야합니다. 
    //render 함수는 JSX 값을 반환해줍니다.
    const name = 'react';
    
  return (
    <div className="react">
    {name}
    </div>
  );
}
}


```

함수형 컴포넌트 예시

```js
import React from "react";
import './App.css';


export default function App() {
   const name = 'react';
  return (
      <div className="react">
   		 {name}
    </div>
)
}

```



함수형 컴포넌트는 이름 그대로 **함수 형태**, 클래스형 컴포넌트는 이름 그대로 **클래스 형태**를 하고 있다는 점이 직관적인 차이점이라 할 수 있습니다.

과거에는 클래스형 컴포넌트를 사용했다고 합니다.
## 클래스형 컴포넌트 특징
1. 리액트의 기능을 최대로 끌어 올릴 수 있습니다.
2. 함수형 컴포넌트는 라이프사이클 API 사용, 컴포넌트 내부의 state를 만들 수 없습니다.

하지만 현재 리액트 시장은 함수형 컴포넌트 사용을 선호하고 있습니다. 공식문서에서도 함수형 컴포넌트와 hook을 함께 사용하기를 권장하고 있습니다. 
<br>
## 함수형 컴포넌트 장점
1. 함수의 문법만 알면 사용할 수 있기 때문에 편리.
2. 클래스형 컴포넌트는 로직과 상태를 컴포넌트 내에서 구현하기 때문에 함수형 컴포넌트보다 가독성이 떨어집니다.
3. 2019년에 출시된 최신 리액트(v16.8)에서 hook이 도입되면서 내부적으로 state 관리, 라이프 사이클 api 사용 등 함수형 컴포넌트의 한계를 극복할 수 있는 기능들이 등장했기 때문. 
→ 클래스형 컴포넌트 위주에서 함수형 컴포넌트 위주로 넘어가게된 가장 큰 원인. 
4.메모리 자원을 덜 사용하기 때문에 프로젝트를 완성하여 빌드한 후 배포할 때도 함수형 컴포넌트를 사용하는 것이 결과물의 파일 크기가 더 작습니다. (사실 성능과 파일 크기 면에서 큰 차이는 없다고 합니다.)
5. 제공되는 Hook 함수뿐만 아니라 커스텀 훅을 생성하여 사용할 수 있습니다.


<details>

<summary>커스텀 훅</summary>

<div markdown="1">

  # Custom Hook?
  - useState와 useEffect들과 같은 특정 상태관리나 라이프사이클 로직들을 추상화하여 묶어서 재사용이 가능하도록 제작이 가능한 함수

## 커스텀 훅 사용 이유
  - 반복되는 로직을 하나로 묶어 재사용하기 위함
  
## 간략한 사용법
  ```js
  //custom hook 정의
  const useToggle = (initialState = false) => {
    const [state, setState] = useState(initialState);
    const toggle = useCallback(() => setState(state => !state), []);
    
    return [state, toggle]
}
  

// 사용예시
import { useCallback, useState } from 'react';

function App() {
    const [isTextChanged, setIsTextChanged] = useToggle();
    
    return (
        <button onClick={setIsTextChanged}>{isTextChanged ? 'Toggled' : 'Click to Toggle'}</button>
    );
}
  ```
  
  위처럼 useToggle을 호출하면 현재 토글상태과, 이 토글상태를 변경할 수 있는 함수가 리턴이 됩니다.
훅을 호출하면 useToggle함수의 return값이 [state, toggle] 이므로 분해구조 문법을 통해 리턴값을 특정 변수(state)와 바인딩하여 사용할 수 있습니다.

커스텀 훅의 강점은 불필요하게 반복되는 로직을 하나의 함수로 묶어서 추상화함으로써 재활용이 가능하도록 만든다는 점에서 효율적 측면이 있습니다.
  

  
 
</div>

</details>



<br>
<br>
하지만 클래스형 컴포넌트도 개념은 익혀놔야합니다. 어떠한 기업은 클래스형 컴포넌트를 사용할 수 있고(Legacy) 그 기업에 근무를 하게 될 수도 있기 때문입니다. 그 기업 프로젝트의 유지보수를 위해서는 클래스형 컴포넌트에 대한 개념은 알고 있어야 당황하지 않겠죠.



<br>
<br>

# children props 고찰 및 특징
3장 내용 중 children props가 나오길래 잘 모르고 사용한 것 같아서 딥다이브 하기로 했습니다. 

`First.js`, `Second.js` 를 모두 포함하는 컴포넌트 `(House.js)`가 필요한 상황이라고 가정하겠습니다. 아래처럼 `First`,`second` 컴포넌트를 감싸는 `<House/>` 컴포넌트가 있습니다.


```js
// House.js
import React from 'react';

function House() {
  const style = {
    border: '4px solid green',
    padding: '16px',
  };
  return <div style={style}></div>;
}

export default House;
```


```js
//Second.js
import React from 'react';

function Second(props) {
  return <div> 둘 째 {props.name} 입니다</div>;
}

export default Second;
```


```js
// First.js
import React from 'react';

function First() {
  return <div>첫 째입니다</div>;
}

export default First;
```

```js
// App.js
import React from 'react';
import First from './First';
import Second from './Second';
import House from './House';

function App() {
  return (
    <House>
      <First />
      <Second name="동2" color="blue" />
    </House>
  );
}

export default App;
```
렌더링 결과


![](https://velog.velcdn.com/images/dogmnil2007/post/4bdeb996-ed63-4905-857e-17cc81642854/image.png)


House 컴포넌트는 정상적으로 초록색 박스가 그려지는데, 내부의 컴포넌트인 First, Second는 작동하지 않는 것을 볼 수 있습니다.


컴포넌트 태그(House) 사이의 컴포넌트(First, Second)의 값을 조회하고 싶을 때 `props.children`을 사용해야 합니다.

```js
// House.js
import React from 'react';

function House({ children }) {
  const style = {
    border: '4px solid green',
    padding: '16px',
  };
  return <div style={style}>{children}</div>;
}

export default House;
```

![](https://velog.velcdn.com/images/dogmnil2007/post/73ff0e57-16c7-4295-8036-c2f84b33433d/image.png)

정상적으로 렌더링 되는 것을 확인할 수 있습니다.

즉 컴포넌트 사이에 컴포넌트가 있을 경우 children을 사용합니다. 


## children props를 활용한 렌더링 최적화

```js
import React,{useState} from 'react';

const ChildComponent = () =>{
	console.log("ChildComponent is rendering!");
	return <div>Hello World!</div>
}

const ParentComponent = () =>{
	console.log("ParentComponent is rendering!");
    const [toggle, setToggle] = useState(false);
	return <>
    	<ChildComponent/>
        <button onClick={()=>{setToggle(!toggle)}}>
        	re-render
        </button>
    </>
}

const Container =() =>{
	return <div>
    	<ParentComponent/>
    </div>
}
```

Container > ParentComponent > ChildComponent 구조로 프로젝트가 구성되있습니다. 
이 상황에서 만약 re-render 버튼을 눌러 ParentComponent의 리렌더링을 유발한다면 당연히 ParentComponent가 리렌더 되는 순간 ChildComponent도 함께 리렌더 될 것입니다. 실제로 콘솔을 살펴보면 두 컴포넌트가 모두 렌더링 되고 있음을 확인할 수 있습니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/cccbccc5-7497-40ae-b4f9-1f553f036c5b/image.png)

아시다시피 이 현상은 아주 비효율적입니다. ParentComponent의 toggle state 변경은 ChildComponent와는 무관함에도 무의미하게 ChildComponent가 리렌더링 되는 것이기 때문이다. 즉 ChildComponent는 리렌더링될 필요가 없음에도 불구하고 리렌더링되는 것입니다.

이러한 문제를 해결하기 위해  `React.memo`를 사용하기도 하지만 children props를 사용해도 해결할 수 있습니다.  

```js
import React,{useState} from 'react';

const ChildComponent = () =>{
	console.log("ChildComponent is rendering!");
	return <div>Hello World!</div>
}

const ParentComponent = ({children}) =>{
	console.log("ParentComponent is rendering!");
    const [toggle, setToggle] = useState(false);
	return <div>
 		{children}
        <button onClick={()=>{setToggle(!toggle)}}>
        	re-render
        </button>
    </div>
}

const Container =() =>{
	return <div>
    	<ParentComponent>
        	<ChildComponent/>
        </ParentComponent>
    </div>
}
```
![](https://velog.velcdn.com/images/dogmnil2007/post/d4416b2f-3660-4f4a-9536-3d6290d389ac/image.png)

ParentComponent 내부에 직접 ChildComponent를 배치하는 대신 children prop을 통해 간접적으로 ChildComponent를 return하고 있음을 확인할 수 있습니다.
이 상태에서 아까와 동일하게 re-render 버튼을 눌러 ParentComponent의 리렌더를 유발하게 하게 되면 콘솔에는 "ParentComponent is rendering!"이라는 문구만 찍히게 된다. 즉 ChildComponent가 렌더링 되지 않음으로써 최적화한 것입니다.

즉 children prop을 사용하면 React.memo 등의 도구를 사용하지 않고도 구조적으로 렌더링 최적화를 달성할 수 있습니다.


## React.memo를 무효화하는 children props

children props의 특징은 한가지 더 있습니다.
바로 React.memo를 무효화한다는 것입니다.


```js
import React,{useState} from 'react';

const ParentComponent = ({children}) =>{
	console.log("ParentComponent is rendering!")
	return <div>
    	{children}
    </div>
}

const ParentMemo = React.memo(ParentComponent)
//React.memo에 의해 

const Container = () =>{
	console.log("Container is rendering!")
	const [toggle,setToggle] = useState(false)
	return (
    	<>
    		<ParentMemo>
    			<div>Hello World!</div>
	    	</ParentMemo>
    	    <button onClick={()=>{setToggle(!toggle)}}>
            	re-redner!
            </button>
        </>
    )
}

export default Container
```
위 코드의 컴포넌트 Container > ParentMemo > React.memo로 감싼ParentComponent 구조입니다.

re-render 버튼을 일반적으로 React.memo에 의해 ParentMemo는 렌더링되지 않고 콘솔에는 "Container is rednering!" 문구만 찍힐 것이라 예상됩니다. 
React.memo는 컴포넌트의 prop이 변경되지 않는 한 다시 렌더링되지 않도록 제어하는 역할을 하기 때문이죠. 
그리고 ParentMemo의 prop이라고는 children으로 존재하는 div 태그 밖에 없기 때문에 div 태그는 toggle state와는 무관합니다.
당연히 re-render 버튼을 누르기 전과 후에 달라질 것이 없습니다. 
즉 Container 컴포넌트만 리렌더링되는 것이죠



하지만 결과는 예상과 달랐습니다.


![](https://velog.velcdn.com/images/dogmnil2007/post/b7ba66a7-7c91-4146-94ca-8ea2d5a762bc/image.png)

"ParentComponent is rendering!"이 콘솔에 찍힌걸로 봐서 ParentMemo 컴포넌트가 재렌더링되었음을 확인할 수 있습니다.
즉 children을 prop으로 갖는 컴포넌트에는 React.memo가 적용되지 않고  항상 렌더링 된다는 것을 확인할 수 있습니다.

<br>

생각보다 children이 다양한 기능을 한다는 것을 알았습니다.
## 그렇다면 왜 이런 결과가 나온 것일까요??

그 이유는

### children prop은 매 렌더링마다 값이 달라지므로 React.memo가 동작하지 않기 때문입니다. 

어째서 children prop는 매 렌더링마다 값이 달라지는 것일까요?? 

리액트의 기초부터 알아본 결과 답이 나왔습니다. 

react에서 사용하는 JSX상의 표현이 가지고 있는 의미부터 알아봅시다
```JS
<Child/>
```

위 코드를 다르게 표현하면 다음과 같습니다.
```JS
React.createElement(Child,null,null)
// 첫 번째 argument는 타입이며, 
// 두번째, 세번째 argument는 각각 porps와 children입니다.
```
사실 JSX의 각 태그는 html을 닮았을 뿐 전부 react element를 반환하는 javascript 코드입니다. 
즉, 위 2개의 코드는 완전히 같은 표현이라고 볼 수 있습니다.


React.creatElement는 주어진 arguments를 기반으로 react element를 새롭게 생성해 반환합니다. 
이렇게 생성된 react element들은 화면에 어떻게 나타내어질지 정보를 담고 있는 object형태(객체)로 존재한다. 
그 후 function component의 return문에 배치되어지면(class component의 경우 render 함수에 인자로 주어졌을 경우) 그때서야 react가 react element의 정보를 해석하여 화면에 렌더링해줍니다. 
여기서 가장 중요한 부분은 react element들은 단지 화면을 어떻게 그려야하는지 정보를 담고 있는 object(객체)일 뿐이라는 것입니다.
그리고 중요한 점은 react element는 immutable하다는 점이다. 즉 '상수' 입니다. 
따라서 element의 내용이 변경된다는 것은 React.createElement를 통해 변경된 정보를 담아 **새로운 object를 반환**한다는 것을 의미합니다.
즉 값이 변하는 것이 아닌 새로운 값이 생성되고 그 값이 대체된다는 것입니다. (re-render = re-create)

결국 매 렌더링마다 children prop는 새로운 값을 생성하므로 React.memo는 props의 값이 달라진다(새로운값으로 대체) 인식하기 때문에 동작하지않고 컴포넌트는 재렌더링되는 것입니다. 






<br>
<br>




<details>

<summary>웹팩 코드 검색 확장자</summary>

<div markdown="1">

  ```js
import React from "react";
import Header from './Header'
  //웹팩 코드 검색 확장자가 있기 때문에 
  //파일을 import 할 때 파일 확장자를 적지않아도 됩니다. 

export default function App() {
  return (
    <div>
     <Header name="변재정"/>
     <p>안녕하세요 에픽입니다.</p>

    </div>
  );
}

```


    

 "웹팩 코드 검색 확장자(webpack module resolution)" 기능 덕분에 import시 js, jsx 등 파일 확장자를 생략해도 자동으로 찾을 수 있습니다. 
확장자가 파일 이름에 없는 경우 웹팩의 확장자 옵션(extentions)에 정의된 확장자 목록을 통해 확장자 이름을 포함한 파일이 있는지 확인하여 자동으로 import 한다.

</div>

</details>










<details>

<summary>출처</summary>

<div markdown="1">

https://velog.io/@donggu/%EB%AC%B8%EA%B3%BC%EC%83%9D%EC%9D%B4-%EC%84%A4%EB%AA%85%ED%95%98%EB%8A%94-React-propsproperties-children
  
  https://velog.io/@donggu/%EB%AC%B8%EA%B3%BC%EC%83%9D%EC%9D%B4-%EC%84%A4%EB%AA%85%ED%95%98%EB%8A%94-React-propsproperties-children
  
  https://velog.io/@2ast/React-children-prop%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EC%B0%B0feat.-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%B5%9C%EC%A0%81%ED%99%94#%EC%8B%A4%EB%A7%88%EB%A6%AC%EB%A5%BC-%EB%B0%9C%EA%B2%AC%ED%96%88%EB%8B%A4

</div>

</details>

