
async function j(f){const r=await fetch(f);return await r.json();}
(async()=>{
try{
const [teams,c,s,a]=await Promise.all([j('data/teams.json'),j('data/competitions.json'),j('data/schedule.json'),j('data/announcements.json')]);
const pts={};teams.teams.forEach(t=>pts[t]=0);
c.competitions.forEach(x=>{let w=x.winners;if(w.first)pts[w.first]+=5;if(w.second)pts[w.second]+=3;if(w.third)pts[w.third]+=1;});
let st=document.getElementById('standings');
if(st){st.innerHTML='';Object.entries(pts).sort((x,y)=>y[1]-x[1]).forEach(([t,p],i)=>{let w=Math.max(10,p/Math.max(...Object.values(pts))*100);st.innerHTML+=`<div class="team"><div style="width:75%"><b>${['🥇','🥈','🥉'][i]||''} ${t}</b><div class="bar"><div class="fill" style="width:${w}%"></div></div></div><b>${p}</b></div>`;});}
let an=document.getElementById('announcements');if(an){a.announcements.forEach(n=>an.innerHTML+=`<div class="notice">${n}</div>`);}
let rs=document.getElementById('results');if(rs){c.competitions.filter(x=>x.winners.first||x.winners.second||x.winners.third).forEach(x=>rs.innerHTML+=`<div class='card'><h3>${x.name}</h3><table><tr><th>Place</th><th>Winner</th></tr><tr><td>🥇</td><td>${x.winners.first}</td></tr><tr><td>🥈</td><td>${x.winners.second}</td></tr><tr><td>🥉</td><td>${x.winners.third}</td></tr></table></div>`);}
let sc=document.getElementById('schedule');if(sc){sc.innerHTML="<table><tr><th>Time</th><th>Competition</th><th>Venue</th></tr>"+s.schedule.map(x=>`<tr><td>${x.time}</td><td>${x.event}</td><td>${x.venue}</td></tr>`).join("")+"</table>";}
}catch(e){document.body.insertAdjacentHTML('afterbegin',"<div style='background:#ffdddd;padding:10px'>If you opened the HTML directly with file://, fetch() is blocked. Run with a local server or host on GitHub/Netlify.</div>");console.error(e);}
})();
