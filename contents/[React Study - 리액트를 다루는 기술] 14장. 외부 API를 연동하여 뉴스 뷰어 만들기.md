---
date: "2024-02-28"
title: "[React Study - 리액트를 다루는 기술] 14장. 외부 API를 연동하여 뉴스 뷰어 만들기"
categories: ["ReactStudy", "React"]
summary: "api 연동 과정을 학습하다 문득 api연동을 도와주는 도구 Fetch와 Axios의 특징 및 차이점이 궁금해져 조사해봤습니다."
thumbnail: "./axios.png"
---

api 연동 과정을 학습하다 문득 api연동을 도와주는 도구 Fetch와 Axios의 특징 및 차이점이 궁금해져 조사해봤습니다.

# 1. Fetch

JavaScript의 내장 라이브러리로 promise 기반으로 만들어졌습니다.

````js
// fetch
const url = 'http://example.com/movies.json'
const options = {
	method: 'POST',
	mode: 'same-origin',
	credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/json';
	},
	body: JSON.stringify({
		name: 'myname',
		age: 20
	})
}
fetch(url,options)
	.then(response => response.json())
	.then((data)=> console.log(data));
    ```

# 2. Axios
`axios(url[, config])`

네트워크 요청을 위해 fetch라는 메서드를 제공하는 인터페이스로, Node.js와 브라우저를 위한 HTTP 통신 라이브러리입니다.

비동기로 HTTP 통신을 가능하게 해주며 return을 promise 객체로 해주기때문에 response 데이터를 다루기 쉽습니다. (HTTP 요청과 응답을 JSON 형태로 자동 변경 -> fetch와 달리 별도의 json형태 변경 처리가 필요없습니다. )


GET 요청
```js

axios(url[, config])
// GET 요청 (별도 표시가 없으면 get요청)
axios('/user/12345');
````

POST

```js
// POST 요청
axios({
  method: "post",
  url: "/user/12345",
  data: {
    firstName: "Fred",
    lastName: "Flintstone",
  },
});
```

## Fetch vs. Axios

| Fetch                                                   | Axios                                         |
| ------------------------------------------------------- | --------------------------------------------- |
| 모던 브라우저에 빌트인이라 설치 필요 없음               | 라이브러리로 설치 필요                        |
| body 속성을 사용                                        | data 속성을 사용                              |
| body는 문자열화 되어있다                                | data는 object를 포함한다                      |
| 응답객체가 ok 속성을 포함하면 성공이다                  | status 200이고 statusText가 'OK'이면 성공이다 |
| .json() 메서드를 사용해야 한다                          | 자동으로 JSON 데이터 형식으로 변환된다        |
| 해당 기능 X                                             | 요청을 취소할 수 있고 타임아웃을 걸 수 있다   |
| 기본적으로 제공 X                                       | HTTP 요청을 가로챌 수 있음                    |
| 지원 X                                                  | Download 진행에 대해 기본적인 지원을 한다     |
| Chrome42+, Firefox39+, Edge14+, Safari10.1+ 이상에 지원 | 좀 더 많은 브라우저에 지원됨                  |

> XSRF(CSRF) : Cross-Site Request Forgery.
> 쿠키만으로 인증하는 서비스의 취약점을 이용해, 사용자가 모르게 해당 서비스에 특정 명령을 요청하는 공격

### 결론

따라서 간단하게 사용할 때는 fetch를 쓰고, 이외의 확장성을 염두해봤을 때는 axios를 쓰면 좋습니다.

### 3줄 요약

1. api 연동에 자주쓰이는 도구는 fetch함수, axios가 있다.
2. 사실 axios도 fetch라는 메서드를 제공하는 라이브러리의 일종이다.
3. 간단하게 사용할 때는 fetch, 확장성을 염두해봤을 때는 axios
