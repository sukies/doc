## 前言
有个动画需求，有几个div，需要不同时，不同幅度移动，用了css3+less实现
## 重点
使用~\`\`，\`\`内可嵌入js代码，获得的内容可以做keyframes 名字，也可以当作数字参与less的其他计算，但是获得的内容不能当作class名字
## 编译前
```
.move (@random) {
    @name: ~`'an-div-move-@{random}'`;
    @keyframes @name {
        0% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(0, @random/1000+.3rem);
        }
        100% {
            transform: translate(0, 0);
        }
    }
    @s: ~`Math.random()`;
    animation: @name linear 8s infinite @s*5*1s;
}

.div-1 {
    .move( `~Math.round(Math.random()*1000)`);
}

.div-2 {
    .move(~`Math.round(Math.random()*1000)`);
}

.div-3 {
    .move(~`Math.round(Math.random()*1000)`);
}

```
## 编译后
```
.div-1 {
  animation: an-div-move--611 linear 8s infinite 4.82357906s;
}
@keyframes an-div-move--611 {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -0.311rem);
  }
  100% {
    transform: translate(0, 0);
  }
}
.div-2 {
  animation: an-div-move-493 linear 8s infinite 1.7538035s;
}
@keyframes an-div-move-493 {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 0.793rem);
  }
  100% {
    transform: translate(0, 0);
  }
}
.div-3 {
  animation: an-div-move-557 linear 8s infinite 4.65403445s;
}
@keyframes an-div-move-557 {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 0.857rem);
  }
  100% {
    transform: translate(0, 0);
  }
}

```
## 总结
在vue-cli中不能使用，直接less编译可以，可以用在webpack自己配置的项目中
但是不知道为什么可以这么写，没找到官方的说明
