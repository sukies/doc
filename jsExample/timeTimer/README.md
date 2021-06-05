# 时间获取&&倒计时
<p>
  起因：客户提了一个很奇葩的需求。
  商品是按时销售的，而且销售时间段按星期来，比方说，需要在星期日21点 ~ 星期二18点，星期五21点 ~ 星期六18点这两个时间段可销售，其他时间不能销售，并且显示开售时间的倒计时
</p>
<a href="index.html">查看具体代码</a>
<h2>有关时间的方法</h2>
<pre>
Js获取当前日期时间及其它操作

var myDate = new Date();
myDate.getYear();        //获取当前年份(2位)
myDate.getFullYear();    //获取完整的年份(4位,1970-????)
myDate.getMonth();       //获取当前月份(0-11,0代表1月)
myDate.getDate();        //获取当前日(1-31)
myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
myDate.getHours();       //获取当前小时数(0-23)
myDate.getMinutes();     //获取当前分钟数(0-59)
myDate.getSeconds();     //获取当前秒数(0-59)
myDate.getMilliseconds();    //获取当前毫秒数(0-999)
myDate.toLocaleDateString();     //获取当前日期
var mytime=myDate.toLocaleTimeString();     //获取当前时间
myDate.toLocaleString( );        //获取日期与时间

 

日期时间脚本库方法列表

Date.prototype.isLeapYear 判断闰年
Date.prototype.Format 日期格式化
Date.prototype.DateAdd 日期计算
Date.prototype.DateDiff 比较日期差
Date.prototype.toString 日期转字符串
Date.prototype.toArray 日期分割为数组
Date.prototype.DatePart 取日期的部分信息
Date.prototype.MaxDayOfDate 取日期所在月的最大天数
Date.prototype.WeekNumOfYear 判断日期所在年的第几周
StringToDate 字符串转日期型
IsValidDate 验证日期有效性
CheckDateTime 完整日期时间检查
daysBetween 日期天数差</pre>
