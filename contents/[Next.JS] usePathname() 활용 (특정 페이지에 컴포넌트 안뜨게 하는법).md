---
date: "2023-02-05"
title: "[Next.JS] usePathname() 활용 (특정 페이지에 컴포넌트 안뜨게 하는법)"
categories: ["Next.JS"]
summary: "Next.js는 ssr 이라는 것을 인지."
thumbnail: "./NEXT.png"
---

```jsx
import { usePathname } from "next/navigation";

//비렌더링하고싶은 layout컴포넌트 내부
const pathname = usePathname();
if (pathname === "/user") return null;
//pathname === '원하는 특정페이지 주소'
```

위 컴포넌트는 `usePathname` 를 사용하기 때문에 클라이언트 컴포넌트여야 한다.
