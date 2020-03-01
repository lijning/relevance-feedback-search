# Structure & Design

## Intro

- React client 请求搜索结果, 标记搜索结果中相关的， 
- Flask server 获取相关和非相关summary， 返回新的query

## APIs

- `rocchio/api/search/<str:query>?engine=<>&key=<>` GET
    - 获取items 需要有title、summary、url
- `rocchio/api/feedback/<str:query>` POST
    - 发送 query list-of-relevant-summary list-of-irrelevant-summary

```json
{
    "query": "",
    "items": [{"summary":str, "relevant":True}]
}
```

## Flask

```py

from flask import request

@app.route('/data')
def data():
    # here we want to get the value of user (i.e. ?user=some-value)
    user = request.args.get('user')

```