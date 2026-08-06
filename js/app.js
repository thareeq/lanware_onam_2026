
async function load(f){return (await fetch(f)).json();}
(async()=>{
const [teams,comp,ann,sch]=await Promise.all([
load('data/teams.json'),
load('data/competitions.json'),
load('data/announcements.json'),
load('data/schedule.json')
]);

const pts={};teams.teams.forEach(t=>pts[t]=0);
comp.competitions.forEach(c=>{
 if(c.winners.first) pts[c.winners.first]+=5;
 if(c.winners.second) pts[c.winners.second]+=3;
 if(c.winners.third) pts[c.winners.third]+=1;
});

const st=document.getElementById("standings");
if(st){
 st.innerHTML="";
 const max=Math.max(...Object.values(pts),1);
 Object.entries(pts).sort((a,b)=>b[1]-a[1]).forEach(([team,p],i)=>{
 st.innerHTML+=`<div class="team"><div class="row"><b>${["🥇","🥈","🥉"][i]} ${team}</b><b>${p} pts</b></div><div class="bar"><div class="fill" style="width:${p/max*100}%"></div></div></div>`;
 });
}

const ad=document.getElementById("announcements");
if(ad){ann.announcements.forEach(n=>ad.innerHTML+=`<div class="notice">${n}</div>`);}

const rs=document.getElementById("results");
if(rs){
 comp.competitions.filter(c=>c.winners.first||c.winners.second||c.winners.third).forEach(c=>{
 rs.innerHTML+=`<div class="card"><h2>${c.name}</h2><table><tr><th>Place</th><th>House</th></tr>
 <tr><td>🥇</td><td>${c.winners.first||"-"}</td></tr>
 <tr><td>🥈</td><td>${c.winners.second||"-"}</td></tr>
 <tr><td>🥉</td><td>${c.winners.third||"-"}</td></tr></table></div>`;
 });
}

const sc=document.getElementById("schedule");
if(sc){
 sc.innerHTML="";
 sch.days.forEach(day=>{
   let rows=day.events.map(e=>`<tr><td>${e.time}</td><td>${e.category}</td><td>${e.event}</td><td>${e.venue}</td><td><span class="badge ${e.status}">${e.status}</span></td></tr>`).join("");
   sc.innerHTML+=`<div class="card"><h2>📅 ${day.title} <small>${day.date}</small></h2><table><tr><th>Time</th><th>Category</th><th>Competition</th><th>Venue</th><th>Status</th></tr>${rows}</table></div>`;
 });
}
})().catch(err=>{
document.body.innerHTML="<h2 style='padding:20px'>Unable to load JSON. Use a local web server or GitHub/Netlify hosting instead of opening with file://</h2>";
console.error(err);
});
