  // 获取requestAnimationFrame方法
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


// 创建Universe类
function Universe(el = 'universe') {

  // 星星密度
  var starDensity = .216;

  // 星星速度系数
  var speedCoeff = .05;

  // 宽度
  var width;

  // 高度
  var height;

  // 星星数量
  var starCount;

  // 圆半径
  var circleRadius;

  // 圆中心
  var circleCenter;

  // 首次运行标志
  var first = true;

  // 巨星颜色 
  var giantColor = '180,184,240';

  // 普通星颜色
  var starColor = '226,225,142';

  // 彗星颜色
  var cometColor = '226,225,224';

  // 获取canvas元素
  var canva = document.getElementById(el);

  // 存储所有星星
  var stars = [];

  // 上下文
  var universe;


  // 窗口大小改变处理
  windowResizeHandler();

  // 绑定窗口改变事件
  window.addEventListener('resize', windowResizeHandler, false);


  // 创建星空
  createUniverse();

  // 绘制星空
  function createUniverse() {

    // 获取上下文
    universe = canva.getContext('2d');

    // 初始化所有星星
    for (var i = 0; i < starCount; i++) {
      stars[i] = new Star();
      stars[i].reset();
    }

    // 开始绘制
    draw();
  }

  // 每帧绘制
  function draw() {

    // 清除画布
    universe.clearRect(0, 0, width, height);

    // 星星数量
    var starsLength = stars.length;

    // 绘制每颗星星  
    for (var i = 0; i < starsLength; i++) {

      // 当前星星
      var star = stars[i];

      // 移动星星
      star.move();

      // 渐现星星 
      star.fadeIn();

      // 渐隐星星
      star.fadeOut();

      // 绘制星星
      star.draw();
    }

    // 请求再次绘制
    window.requestAnimationFrame(draw);
  }

  // Star类
  function Star() {

    // 重置星星状态
    this.reset = function () {

      // 是否为巨星
      this.giant = getProbability(3);

      // 是否为彗星 
      this.comet = this.giant || first ? false : getProbability(10);

      // x坐标
      this.x = getRandInterval(0, width - 10);

      // y坐标
      this.y = getRandInterval(0, height);

      // 半径
      this.r = getRandInterval(1.1, 2.6);

      // x方向速度 
      this.dx = -getRandInterval(speedCoeff, 6 * speedCoeff) - (this.comet + 1 - 1) * speedCoeff * getRandInterval(50, 120) - speedCoeff * 2;


      // y方向速度
      this.dy = getRandInterval(speedCoeff, 6 * speedCoeff) + (this.comet + 1 - 1) * speedCoeff * getRandInterval(50, 120);


      // 是否渐隐
      this.fadingOut = null;

      // 是否渐现
      this.fadingIn = true;

      // 不透明度
      this.opacity = 0;

      // 透明度阈值
      this.opacityTresh = getRandInterval(.2, 1 - (this.comet + 1 - 1) * .4);

      // 不透明度变化量
      this.do = getRandInterval(0.0005, 0.002) + (this.comet + 1 - 1) * .001;
    };

    // 渐现
    this.fadeIn = function () {
      if (this.fadingIn) {
        this.fadingIn = this.opacity > this.opacityTresh ? false : true;
        this.opacity += this.do;
      }
    };

    // 渐隐
    this.fadeOut = function () {
      if (this.fadingOut) {
        this.fadingOut = this.opacity < 0 ? false : true;
        this.opacity -= this.do / 2;

        // if (this.x > width || this.y < 0) {
        if (this.x < 0 || this.y > height) {
          this.fadingOut = false;
          this.reset();
        }
      }
    };

    // 绘制
    this.draw = function () {
      universe.beginPath();

      if (this.giant) {
        universe.fillStyle = 'rgba(' + giantColor + ',' + this.opacity + ')';
        universe.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
      } else if (this.comet) {
        universe.fillStyle = 'rgba(' + cometColor + ',' + this.opacity + ')';
        universe.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);

        //绘制彗星尾巴
        for (var i = 0; i < 30; i++) {
          universe.fillStyle = 'rgba(' + cometColor + ',' + (this.opacity - (this.opacity / 20) * i) + ')';
          universe.rect(this.x - this.dx / 4 * i, this.y - this.dy / 4 * i - 2, 2, 2);
          universe.fill();
        }
      } else {
        universe.fillStyle = 'rgba(' + starColor + ',' + this.opacity + ')';
        universe.rect(this.x, this.y, this.r, this.r);
      }

      universe.closePath();
      universe.fill();
    };

    // 移动
    this.move = function () {
      this.x += this.dx;
      this.y += this.dy;
      if (this.fadingOut === false) {
        this.reset();
      }
      // if (this.x > width - (width / 4) || this.y < 0) {
      if (this.x < width / 4 || this.y > height - (height / 4)) {
        this.fadingOut = true;
      }
    };

    // 首次运行后设置first为false
    (function () {
      setTimeout(function () {
        first = false;
      }, 50)
    })()
  }

  // 获取概率
  function getProbability(percents) {
    return ((Math.floor(Math.random() * 1000) + 1) < percents * 10);
  }

  // 获取随机区间值
  function getRandInterval(min, max) {
    return (Math.random() * (max - min) + min);
  }

  // 窗口改变处理
  function windowResizeHandler() {
    width = window.innerWidth;
    height = window.innerHeight;
    starCount = width * starDensity;
    circleRadius = (width > height ? height / 2 : width / 2);
    circleCenter = {
      x: width / 2,
      y: height / 2
    }

    canva.setAttribute('width', width);
    canva.setAttribute('height', height);
  }

}

/**
 * 旋转的星空
 * @param {*} el 元素
 * @param {*} width 画布宽
 * @param {*} height 画布高
 */
function Rotating_stars(el='rotating_stars',width=window.innerWidth,height=window.innerHeight) {
  //宇宙特效
  var canvas = document.getElementById(el),
    ctx = canvas.getContext('2d'),
    w = canvas.width = width,
    h = canvas.height = height,

    hue = 217,
    stars = [],
    count = 0,
    maxStars = 1300;//星星数量

  var canvas2 = document.createElement('canvas'),
      ctx2 = canvas2.getContext('2d');
    canvas2.width = 100;
    canvas2.height = 100;
  var half = canvas2.width / 2,
    gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#CCC');
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

  // End cache

  function random(min, max) {
    if (arguments.length < 2) {
      max = min;
      min = 0;
    }

    if (min > max) {
      var hold = max;
      max = min;
      min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function maxOrbit(x, y) {
    var max = Math.max(x, y),
      diameter = Math.round(Math.sqrt(max * max + max * max));
    return diameter / 2;
    //星星移动范围，值越大范围越小，
  }

  var Star = function () {

    this.orbitRadius = random(maxOrbit(w, h));
    this.radius = random(60, this.orbitRadius) / 8;
    //星星大小
    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 50000;
    //星星移动速度
    this.alpha = random(2, 10) / 10;

    count++;
    stars[count] = this;
  }

  Star.prototype.draw = function () {
    var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
      y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
      twinkle = random(10);

    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
  }

  for (var i = 0; i < maxStars; i++) {
    new Star();
  }

  function animation() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.5; //尾巴
    ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
    ctx.fillRect(0, 0, w, h)

    ctx.globalCompositeOperation = 'lighter';
    for (var i = 1, l = stars.length; i < l; i++) {
      stars[i].draw();
    };

    window.requestAnimationFrame(animation);
  }

  animation();
}