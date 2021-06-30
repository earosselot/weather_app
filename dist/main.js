(()=>{"use strict";class e{constructor(e,t,n,a,i,o,r){this.city=e,this.weather=t,this.description=n,this.icon=a,this.temp=i,this.feelsLike=o,this.country=r}}let t=new class{async createWeather(t){let n=await this.fetchAPI(t);return new e(n.name,n.weather[0].main,n.weather[0].description,n.weather[0].icon,n.main.temp,n.main.feels_like,n.sys.country)}async fetchAPI(e,t="metric"){let n="652e61acc78edad67e8910709ea3d274";if(e.cityName)try{let a=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.cityName}&appid=${n}&units=${t}`,{mode:"cors"});return await a.json()}catch(e){console.log("error: "),console.log(e)}else if(e.lat)try{let a=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${e.lat}&lon=${e.long}&appid=${n}&units=${t}`,{mode:"cors"}),i=await a.json();return console.log(i),i}catch(e){console.log("error: "),console.log(e)}}};navigator.geolocation&&navigator.geolocation.getCurrentPosition((function(e){let n={};n.lat=e.coords.latitude,n.long=e.coords.longitude,t.createWeather(n).then((e=>{i(e)}))}),(function(){t.createWeather({cityName:"Montevideo"}).then((e=>{i(e)}))}));const n=document.getElementById("search-button"),a=document.getElementById("search-input");function i(e){const t=document.getElementById("temperature-text"),n=document.getElementById("weather-text"),a=document.getElementById("temp-card-image"),i=document.getElementById("city-name"),o=document.getElementById("feels-like");t.innerText="",t.innerText=Math.round(e.temp)+"°C",n.innerText="",n.innerText=e.weather,a.setAttribute("src",`design/SVG/${e.icon}.svg`),i.innerText="",i.innerText=`${e.city} (${e.country})`,o.innerText="",o.innerText=`Feels like ${e.feelsLike}°C`}a.addEventListener("keyup",(e=>{"Enter"===e.code&&(e.preventDefault(),n.click())})),n.addEventListener("click",(()=>{let e={};e.cityName=a.value,t.createWeather(e).then((e=>{i(e)}))}))})();
//# sourceMappingURL=main.js.map