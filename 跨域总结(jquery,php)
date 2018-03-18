## 引子 ##
项目原因，前后端跨域了，第一次涉及到跨域的内容，踩了蛮多坑的，总结一下，避免下次再遇到~
## 一、图片发送请求##
因为图片是不会去判断是否跨域的，但是也只能发送get请求，并且获取不到返回值，可以用来监听页面访问数量或者广告点击数量
```
var img=new Image();
img.src='http://www.baidu.com';
img.onerror=function(){
 alert('error');
}
img.onload=function(){
 alert('success');
}
```

## 二、jsonp ##
jsonp只能用于get请求，设置dataType：'jsonp'
> 使用 JSONP 形式调用函数时，如 "myurl?callback=?" jQuery 将自动替换 ? 为正确的函数名，以执行回调函数。

```
$.ajax({
  url: "test.html",
  dataType：'jsonp',
  success: function(html){
      //
  }
});
```
其实实现就下面的效果，如果直接这样写,就是页面直接执行，请求成功后执行页面的call函数
```
<script type="text/javascript" src='http://www.aaa.com?callback=call'></script>
```
##三、CORS，服务器端设置

###1.服务器端设置允许请求的地址
```
 header( "Access-Control-Allow-Origin:*" );
```
###2.设置可请求的方式
```
 header( "Access-Control-Allow-Methods:POST,GET" );
```
###3.可以设置header头部内容允许添加的头部信息
```
header('Access-Control-Allow-Headers:value');
```

```
  $.ajax({
            type: "GET",
            url: '#',
            header:{//添加头部信息
                value:'123456'
            },
            crossDomain: true,
            success: function (data) {});
```

###4.发送cookie
需要注意的是，如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名

```
    response.setHeader("Access-Control-Allow-Credentials","true");
```

```
  $.ajax({
            type: "GET",
            url: '#',
            crossDomain: true,
            xhrFields: {withCredentials: true},//发送cookie
            success: function (data) {});
```
##结束
参考：[跨域资源共享 CORS 详解][1]


  [1]: http://www.ruanyifeng.com/blog/2016/04/cors.html
