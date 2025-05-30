---
date: "2024-01-31"
title: "[React Study - 리액트를 다루는 기술] 6장. 컴포넌트 반복"
categories: ["ReactStudy", "React"]
summary: "자바스크립트 forEach과 map 메서드를 딥다이브 해보았습니다."
thumbnail: "./map함수예시.png"
---



자바스크립트 forEach과 map 메서드를 딥다이브 해보았습니다.

리액트 내용은 아니지만 리액트는 자바스크립크 기반으로 동작하니 조사해도 되지 않을까 싶어 한번 알아보았습니다. 




# forEach과 map 차이점 

## 1. 반환값
map() 메서드는 새로운 값을 반환합니다. 이 새로운 값은 map() 메서드에 의해 생성된 새로운 배열에 저장됩니다.

map함수 사용 예시
![](https://velog.velcdn.com/images/dogmnil2007/post/578e9ce9-0e17-4b21-84af-e02de5cc0357/image.png)

map() 메서드가 반환한 값이 numsMap 이라는 새로운 배열에 저장됩니다. 

<br><br>

forEach() 메서드는 새로운 값을 반환하지 않습니다. 즉 배열 순회 후 뱉어내는 데이터가 없습니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/d188e787-2166-493b-8067-9f952e17b7ea/image.png)

`undefined`가 나온 이유는 const로 numsMap 이라는 변수를 선언했지만 그 어떠한 값도 할당되지 않았기 때문입니다. 



<br><br>

## 2. 기존 배열 변경 위험성 존재
forEach() 함수는 기존 배열 변경이 가능합니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/6f94f2e5-a23f-4238-80fc-bf717ae8cb67/image.png)
기존배열 data `[10, 15, 20, 25, 30]`이
`[5, 10, 15, 20, 25]` 로 바뀌었습니다.

<br><br>


 map() 함수는 기존 배열을 변경하지 않습니다. 새로운 배열을 생성합니다.
![](https://velog.velcdn.com/images/dogmnil2007/post/3aa802ef-2e77-4285-8d1e-41f391042e1c/image.png)


새로운 배열 copydata가 생성되었고 기존 배열 data는 그대로 존재합니다. 두 배열의 요소는 같지만 두 배열은 서로 다른 배열입니다. 
즉 map 함수는 기존배열을 건드리지 않습니다.

<br><br>

## 이게 왜 위험한건데? 



<br>
여기서 얕은 복사 & 깊은 복사의 개념을 알 필요가 있습니다.


### 얕은 복사 & 깊은 복사

자바스크립트의 자료형은 크게 2가지로 나눌 수 있습니다.

1. 원시 데이터 (primitive type)
string, number, boolean 등등 타입 


2. 참조 데이터 (reference type)
 객체(object)
 
 <br>
 
** 원시데이터 복사 과정**

![](https://velog.velcdn.com/images/dogmnil2007/post/8e61fded-d8e6-4a36-8085-aaeacc75abbd/image.png)
위 결과와 같이 원시 데이터의 경우 number2에 number1 이라는 변수를 할당한 후 number2 변수의 값을 변경해도 number1 변수에 영향을 주지않습니다. 


![](https://velog.velcdn.com/images/dogmnil2007/post/5d4e780e-865f-4cab-99b5-2d0d7022f293/image.png)



![](https://velog.velcdn.com/images/dogmnil2007/post/c8536e33-362e-470b-98ef-1b3e87b2a650/image.png)
 위 그림가 같은 메커니즘을 **깊은 복사**라 합니다. 값 자체를 메모리에 복사하는 구조입니다. 
즉 number1, number2 변수는 서로 다른 메모리 주소를 공유했기 때문에 값을 변경해도 영향을 미치지 않습니다. 

이렇게 새로운 메모리 공간을 확보해 완전히 복사하는 것을 **깊은 복사**라고 합니다. 


<br><br>

**참조형 데이터 복사 과정**


![](https://velog.velcdn.com/images/dogmnil2007/post/7fb4ceb6-c069-431d-8ee5-3d96aa993187/image.png)



![](https://velog.velcdn.com/images/dogmnil2007/post/c9dbec04-ecf8-45db-807a-16539ab61e1d/image.png)

원시 데이터처럼 값 자체가 복사된 것이 아닌 메모리주소를 복사한 것이기 때문에 shirts 객체 프로퍼티까지 변경됩니다. 

![](https://velog.velcdn.com/images/dogmnil2007/post/eaf0ce6c-efee-424c-9af0-6befa83c82d3/image.png)
위 결과와 같이 tShirts 객체를 변경하면 shirts 객체도 같이 변경되는 것을 확인할 수 있습니다.

이러한 메커니즘을 **얕은 복사**라고 합니다. 
참조 타입 데이터가 저장한 **메모리 주소 값**을 복사하는 것을 의미합니다. 

<br><br>

### 왜 굳이 복잡하게 만들었을까?

참조형 데이터는 값이 복잡하고 메모리에 할당될 용량을 예측하기 어렵기 때문에 원시 데이터처럼 값 전체를 복사하기 힘듭니다. 

즉 자바스크립트의 효율성을 위해 얕은 복사, 깊은 복사 방식을 채택했다 볼 수 있습니다. 

<br><br>

다시 본론으로 돌아가서

`let data = [10, 15, 20, 25, 30]` 배열의 각 요소값이 -5된 배열을 만들고자 할 경우

forEach 함수 사용

```js
let data = [10, 15, 20, 25, 30];
let data2 = data

//모든 원소의 값에서 -5 감소
data.forEach( (val, idx) => {
  data[idx] = val - 5;
// data2[idx] = val - 5; 를 해도 똑같은 결과 출력
});


//얕은 복사 수행
console.log(data);
//[5, 10, 15, 20, 25]

console.log(data2)
//[5, 10, 15, 20, 25]
```
얕은 복사로 인해 객체 프로퍼티 값이 변할 경우 두 객체 모두 영향을 받습니다. 


map함수 사용시


```js
let data = [10, 15, 20, 25, 30];


//모든 원소의 값에서 -5 감소
const data2 = data.map( (val, idx) => {
  return val - 5
 
});


//깊은 복사 수행
console.log(data);
//[10, 15, 20, 25, 30]

console.log(data2)
//[5, 10, 15, 20, 25]
```
새로운 data2 객체가 생성되었고 data2의 data2는 서로 영향을 주지 않는 독립적 객체임을 확인할 수 있습니다. 
<br>
## 그래서 왜 위험하냐고..

객체의 불변성을 깨뜨리기 때문입니다. 프로그래밍을 하면서 객체를 사용하는 여러 가지 이유 중 하나는 재사용성입니다. 재사용하고자 하는 객체의 값이 지속적으로 변한다면 예상치 못한 이슈를 불러올 수 있습니다. 
때문에 기존객체 변경하기보단 새로운 객체에 데이터를 할당하는 것이 좋습니다. 



<br><br>

## 그럼 forEach 메서드는 언제 쓰는거지??
반환도 안하고.. 배열 요소 변경 위험성도 있고... 굳이 쓸 필요 없는 메서드 아닐까?


1. 단순 배열 요소 출력 및 가공 작업 (평균, 사칙연산 등)
```js
const numbers = [1, 2, 3, 4, 5];

// forEach() 메소드 사용 예제
numbers.forEach((num) => {
  console.log(num * 2);
});

//2
//4
//6
//8
//10
```
새로운 배열을 생성하지 않고 배열의 각 요소에 접근하여 원하는 작업을 수행할 수 있습니다. 즉 불필요한 메모리 사용을 줄일 수 있겠죠


2. 특정 조건을 만족하는 배열 요소 찾기
```js
const numbers = [10, 25, 30, 45];

let foundNumber = null;

numbers.forEach(function(number) {
    if (number > 30) {
        foundNumber = number;
    }
});

console.log(foundNumber); // 출력: 45
```



3. 중간에 빠져 나가기
만약 특정 조건에서 더 이상의 반복이 필요하지 않다면, return 문을 사용하여 루프를 중단할 수 있습니다.

```js
let numbers = [1, 2, 3, 4, 5];
let sum = 0;

numbers.forEach(function(num) {
  if (num > 3) {
    return; // num이 3보다 크면 루프 중단
  }
  sum += num;
});

console.log(sum); // 출력: 6 (1 + 2 + 3)
```


