var onscribe={};(function(){var e=false;var r=window.DEBUG||(window.location.hostname=="localhost"?true:false);if(r){var t="//localhost/";var n="//localhost/"}else{var t="//onscri.be/";var n="//cdn.onscri.be/"}var a=document.createElement("link");a.type="text/css";a.rel="stylesheet";a.href=n+"assets/css/client.css";document.getElementsByTagName("head")[0].appendChild(a);var o=["complete","interactive"];if(o.indexOf(document.readyState)>-1){s()}else{window.onload=s}function s(){var r=document.querySelectorAll(".onscribe");if(!r.length)return;e=c();r=Array.prototype.slice.call(r);r.forEach(function(e){l(e)})}function l(r){var t=r.getAttribute("data-product");if(typeof t=="undefined")return;var n={};var a=e?e.email:false;n.product=t;n.email=a;if(a){u(function(e){if(e){return}else{f(t,function(e){if(!e)return;n.providers=e.providers;d(r,n)})}})}else{f(t,function(e){if(!e)return;n.providers=e.providers;d(r,n)})}}function c(){var e=false;var r=false;var t=false;var n=false;r=w("onscribe_user");if(!r)t=window["onscribe_user"]||false;if(!r&&!t&&window.localStorage)n=window.localStorage.getItem("onscribe_user");e=r||t||n||false;if(!e||typeof e=="undefined")return;if(t&&typeof e=="object"){t=onscribe.register(t)}else{e=atob(e);try{e=JSON.parse(e)}catch(a){e=false}}if(!n){var i=r||t;window.localStorage.setItem("onscribe_user",i)}return e}function u(r){if(!e||!r)return false;if(!e.email||!e.code)return r(false);var n="email="+e.email+"&client=js";m(t+"order/verify/"+e.code+"?"+n,function(e){var t=e.order?true:false;r(t)})}function f(e,r){m(t+"api/product/info/"+e,function(e){r(e)})}function d(e,r){var t=[];for(var n in r.providers){var a=r.providers[n].type||r.providers[n];if(typeof a=="undefined")continue;t.push({provider:a,product:r.product,email:r.email||false})}for(var i in t){var o=p(t[i],e);e.appendChild(o)}}function p(e,r){var n=document.createElement("a");n.href=t+"use/"+e.provider+"/"+e.product+(e.email?"?email="+e.email:"");n.className="btn";var a="";var i="";switch(e.provider){case"paypal":a="btn-pp";i=",";break;case"google":a="btn-gw";i="/";break;case"facebook":a="btn-fb";i="!";break}n.className=n.className+" "+a;var o=document.createElement("i");o.setAttribute("aria-hidden","true");o.setAttribute("data-providers",i);n.appendChild(o);var s=new RegExp("long-text").test(" "+r.className+" ");var l=new RegExp("short-text").test(" "+r.className+" ");if(s||l){var c=document.createElement("span");var u=s?"Pay with":"Pay Now";var f=r.getAttribute("data-prompt");var d=f===null?u:f;if(s)d+=" "+g(e.provider);c.innerHTML=d;n.appendChild(c)}return n}window.onscribe.register=function(e){if(typeof e!="object")return false;var r=btoa(JSON.stringify(e));window.localStorage.setItem("onscribe_user",r);window.onscribe_user=r;return r};function v(e){var r=null;var t=[];var n=false;this.add=function(a){if(n){a.apply(e,r)}else{t.push(a)}},this.resolve=function(){if(!n){r=arguments;n=true;var a;while(a=t.shift()){a.apply(e,arguments)}t=null}}}function m(e,t){var n=new XMLHttpRequest;var a=this;n.open("GET",e,true);n.send(null);n.onerror=function(){console.log("there was an error with your request")};n.onload=function(e){try{var n=JSON.parse(e.target.responseText);t.call(a,n)}catch(e){if(r)console.log(e);t.call(a,false)}}}var h={get:function(e){var r,t,n,a=document.cookie.split(";");for(r=0;r<a.length;r++){t=a[r].substr(0,a[r].indexOf("="));n=a[r].substr(a[r].indexOf("=")+1);t=t.replace(/^\s+|\s+$/g,"");if(t==e){return unescape(n)}}},set:function(e,r,t){var n=new Date((new Date).getTime()+parseInt(t));var a=escape(r)+(t==null?"":"; expires="+n.toUTCString());document.cookie=e+"="+a},check:function(e){var r=this.get(e);if(r!=null&&r!=""){return true}else{return false}}};function w(e){var r=window.location.search.substring(1);var t=r.split("&");for(i=0;i<t.length;i++){var n=t[i].split("=");if(n[0]==e){return decodeURIComponent(n[1])}}return false}function g(e){return(e+"").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g,function(e){return e.toUpperCase()})}}).call(this);