!function t(e,i,o){function n(s,h){if(!i[s]){if(!e[s]){var a="function"==typeof require&&require;if(!h&&a)return a(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=i[s]={exports:{}};e[s][0].call(l.exports,function(t){var i=e[s][1][t];return n(i||t)},l,l.exports,t,e,i,o)}return i[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)n(o[s]);return n}({1:[function(t,e,i){"use strict";function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function n(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e,i,o){var n=t.halfWidth,r=t.halfHeight;return t.x-n-o<e&&t.x+n+o>e&&t.y-r-o<i&&t.y+r+o>i}function h(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1.5;c(t,t.width*e,t.height*e)}function a(t){c(t,.75*t.width,.75*t.height)}function c(t,e,i){e>1e4||i>1e4||(t.width=e,t.height=i,t.halfWidth=e/2,t.halfHeight=i/2,t.screen.width=e,t.screen.height=i)}var l=function(){function t(t,e){for(var i=0;i<e.length;i++){var o=e[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,i,o){return i&&t(e.prototype,i),o&&t(e,o),e}}(),u=t("preact-cycle");window.addEventListener("load",function(){function t(){var i=(new Date).getTime(),o=(g-i)/1e3;l.clearRect(0,0,e.width,e.height);for(var n=0;n<y.length;n++)y[n].tick(o,y,c);for(var r=0;r<y.length;r++)y[r].draw(l,c);g=i,requestAnimationFrame(t)}(0,u.render)(p,{test:"test"},document.body);var e=document.getElementById("screen");e.addEventListener("wheel",function(t){t.deltaY>0?h(c):a(c)});var i=!1,o={x:0,y:0},n={x:0,y:0},r={location:{x:void 0,y:void 0},moved:!1};e.addEventListener("mousedown",function(t){i=!0,r.moved=!1,n.x=c.x,n.y=c.y,o.x=t.x,o.y=t.y,r.location.x=t.x,r.location.y=t.y}),e.addEventListener("mouseup",function(t){if(i=!1,r.moved=!1,r.location.x=t.x,r.location.y=t.y,!r.moved){console.log("new dispenser");var e=c.x-(t.x/t.target.clientWidth-.5)*c.width,o=c.y-(t.y/t.target.clientHeight-.5)*c.height;y.push(new d(5e3*Math.random(),e,o))}}),e.addEventListener("mousemove",function(t){r.moved=!0,r.location.x=t.x,r.location.y=t.y,i&&(c.x=n.x+o.x-t.x,c.y=n.y+o.y-t.y)});var s={x:void 0,y:void 0,start:{x:void 0,y:void 0},touched:!1};e.addEventListener("touchstart",function(t){s.touched=!0;for(var e=0,i=0,o=0;o<t.touches.length;o++){var n=t.touches[o];e+=n.pageX,i+=n.pageY}e/=t.touches.length,i/=t.touches.length,s.x=e,s.y=i,s.start.x=e,s.start.y=i,t.preventDefault()}),e.addEventListener("touchend",function(t){0===t.touches.length&&(s.touched=!1,v.controls.right=!1,v.controls.left=!1,v.controls.up=!1,v.controls.down=!1),t.preventDefault()}),e.addEventListener("touchmove",function(t){for(var e=0,i=0,o=0;o<t.touches.length;o++){var n=t.touches[o];e+=n.pageX,i+=n.pageY}e/=t.touches.length,i/=t.touches.length,s.x=e,s.y=i,v.controls.right=!1,v.controls.left=!1,v.controls.up=!1,v.controls.down=!1,e>s.start.x&&(v.controls.right=!0),e<s.start.x&&(v.controls.left=!0),i>s.start.y&&(v.controls.down=!0),i<s.start.y&&(v.controls.up=!0),t.preventDefault()}),document.addEventListener("keydown",function(t){var e=t.keyCode;return console.log(e),37===e||65===e?v.controls.left=!0:38===e||87===e?v.controls.up=!0:39===e||68===e?v.controls.right=!0:40===e||83===e?v.controls.down=!0:0===e&&(v.controls.launch=!0),!1}),document.addEventListener("keyup",function(t){var e=t.keyCode;return 37===e||65===e?v.controls.left=!1:38===e||87===e?v.controls.up=!1:39===e||68===e?v.controls.right=!1:40===e||83===e?v.controls.down=!1:0===e&&(v.controls.launch=!0),!1}),e.width=160,e.height=90;var c={x:0,y:0,width:e.width,height:e.height,halfWidth:e.width/2,halfHeight:e.height/2,screen:e},l=e.getContext("2d");l.imageSmoothingEnabled=!1,l.strokeStyle="#ffffff",l.fillStyle="#ffffff",l.lineWidth=1;var v=new f(1,0,-20),y=[v,new d(1e3,0,0)];y.player=v;var g=(new Date).getTime();t()});var v=function(){function t(e,i,o,n){r(this,t),this.size=e,this.position={x:i,y:o},this.color=n}return l(t,[{key:"draw",value:function(t,e){var i=this.position,o=i.x,n=i.y,r=this.radius,h=this.color;s(e,o,n,r)&&(t.fillStyle=h,t.beginPath(),t.arc(e.halfWidth+e.x-o,e.halfHeight+e.y-n,r,0,2*Math.PI),t.fill())}},{key:"size",set:function(t){this._size=t,this.radius=Math.sqrt(t)/4},get:function(){return this._size}}]),t}(),f=function(t){function e(t,i,n){r(this,e);var s=o(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n,"#33aa33"));return s.velocity={vx:0,vy:0},s.friction=.95,s.emissionRate=.025,s.controls={left:!1,right:!1,up:!1,down:!1},s}return n(e,v),l(e,[{key:"tick",value:function(t,e,i){this.controls.left&&(this.velocity.vx+=-1*Math.sqrt(this.radius)),this.controls.right&&(this.velocity.vx+=1*Math.sqrt(this.radius)),this.controls.up&&(this.velocity.vy+=-1*Math.sqrt(this.radius)),this.controls.down&&(this.velocity.vy+=1*Math.sqrt(this.radius)),this.controls.launch&&(this.controls.launch=!1),this.position.x+=this.velocity.vx*t,this.position.y+=this.velocity.vy*t,this.velocity.vx*=1- -this.friction*t,this.velocity.vy*=1- -this.friction*t;for(var o=e.length-1;o>=0;o--){var n=e[o];if(!(n===this||n instanceof d)){var r=n.position.x-this.position.x,s=n.position.y-this.position.y,h=Math.sqrt(r*r+s*s),a=this.radius+n.radius;if(h<a)e.splice(o,1),this.size+=n.size,this.velocity.vx+=n.velocity.vx*n.size/this.size,this.velocity.vy+=n.velocity.vy*n.size/this.size,this.maxViewScale=this.radius;else{var c=a/h;n.velocity.vx-=t*r*c,n.velocity.vy-=t*s*c}}}var l=this.position,u=l.x,v=l.y;this.color;if(Math.random()<this.emissionRate){var f=Math.sqrt(Math.max(.01*this.size,Math.random()*this.size));this.size-=f;var p=5*(Math.random()-.5),g=5*(Math.random()-.5);e.push(new y(f,u+(p<0?this.radius:-this.radius),v+(g<0?this.radius:-this.radius),this.velocity.vx+p,this.velocity.vy+g,"#00aa00")),this.velocity.vx+=-p*(f/(f+this.size)),this.velocity.vx+=-g*(f/(f+this.size))}i.x=this.position.x,i.y=this.position.y}}]),e}(),d=function(t){function e(t,i,n){var s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:Math.random()/10;r(this,e);var h=o(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n,"rgba(255, 255, 255, "+s+")"));return h.emissionRate=s,h}return n(e,v),l(e,[{key:"tick",value:function(t,e){var i=this.position,o=i.x,n=i.y;this.color;if(Math.random()<this.emissionRate){var r=Math.sqrt(Math.random()*this.radius);this.size-=r;var s=5*(Math.random()-.5)/this.emissionRate,h=5*(Math.random()-.5)/this.emissionRate;if(e.push(new y(r,o+(s<0?this.radius:-this.radius),n+(h<0?this.radius:-this.radius),s,h,"#ffff00")),this.size<=0)for(var a=0;a<e.length;a++)if(e[a]===this){e.splice(a,1);break}}}}]),e}(),y=function(t){function e(t,i,n,s,h,a){r(this,e);var c=o(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n,a));return c.velocity={vx:s,vy:h},c.removeCount=100*t,c}return n(e,v),l(e,[{key:"tick",value:function(t,e){if(this.position.x+=this.velocity.vx*t,this.position.y+=this.velocity.vy*t,this.velocity.vx+=(Math.random()-.5)*t,this.velocity.vy+=(Math.random()-.5)*t,--this.removeCount<=0)for(var i=0;i<e.length;i++)if(e[i]===this){e.splice(i,1),e.player.size+=this.size;break}}}]),e}(),p=function(t){t.test;return(0,u.h)("gui",null,"gui")}},{"preact-cycle":"preact-cycle"}]},{},[1]);