/* UI-only enhancements. No network requests, GPS, or external submissions. */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const trip = { name:'Gurugram Cyber City', dist:'24.6 km', time:'42 min', score:82, hazards:4, roadworks:1, mode:'safe' };
const originalSwitch = switchView;
switchView = function(name){ originalSwitch(name); $$('nav button').forEach(b=>b.removeAttribute('aria-current')); const id={home:'home',search:'search',preview:'preview','active-nav':'nav'}[name]; if(id) $('#tab-'+id)?.setAttribute('aria-current','page'); if(name==='search') {$('#destination-input').value=''; filterDestinations();} };
let toastTimeout;
showToast = function(message){ let t=$('.global-toast'); if(!t){t=document.createElement('div');t.className='global-toast';t.setAttribute('role','status');$('body>div').append(t);}t.textContent=message;t.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.hidden=true,3500); };
const destinations = [
 ['Gurugram Cyber City','24.6 km','42 min',82,4,1],
 ['IGI Airport Terminal 3','14.8 km','26 min',91,1,0],
 ['Noida Sector 62','21.5 km','38 min',76,5,2],
 ['Connaught Place, New Delhi','0 km','0 min',null,0,0]
];
selectQuickDestination = name => {const d=destinations.find(d=>d[0]===name); if(d&&d[1]==='0 km'){switchView('search');showToast('Home is your current sample location. Choose a destination.');return;}if(d)selectDestination(...d);else switchView('search');};
selectDestination = function(name,dist,time,score,hazards,roadworks){Object.assign(trip,{name,dist,time,score,hazards,roadworks,mode:'safe'});goToRoutePreview('safe');};
const panel=$('#view-preview>div:last-child');
panel.innerHTML=`<div class="flex justify-between items-center"><span class="text-xs text-brand-navy font-semibold" id="route-mode"></span><button class="save-route" onclick="saveCurrentRoute()">☆ Save route</button></div><h2 class="text-lg font-bold" id="route-destination"></h2><p class="text-xs text-slate-500">From Connaught Place · Illustrative route</p><div class="flex items-baseline gap-3"><strong class="text-3xl" id="route-time"></strong><span class="text-sm text-slate-500" id="route-distance"></span></div><div class="bg-slate-50 rounded-xl p-3 flex justify-between text-xs"><span id="route-alert-count"></span><span id="route-score"></span></div><p class="text-xs text-slate-500">Sample comparison only. Road conditions can change.</p><div class="grid grid-cols-2 gap-2"><button class="rounded-xl bg-slate-100 text-xs font-semibold" onclick="switchView('search')">Change destination</button><button class="rounded-xl bg-brand-navy text-white text-xs font-semibold" onclick="launchActiveNavigation()">Start demo drive →</button></div>`;
goToRoutePreview = function(mode){trip.mode=mode; const fast=mode==='fast';$('#route-mode').textContent=fast?'Faster route · More alerts':'Recommended · Fewer alerts';$('#route-destination').textContent=trip.name;$('#route-time').textContent=fast?'39 min':trip.time;$('#route-distance').textContent=fast?'22.8 km':trip.dist;$('#route-alert-count').textContent=(fast?8:trip.hazards)+' reported hazards';$('#route-score').textContent='Sample score '+(fast?68:trip.score)+'/100';switchView('preview');};
startNavigationFlow = () => goToRoutePreview('safe');
selectPresetRoute = () => selectDestination(...destinations[0]);
$('#tab-preview').onclick=()=>goToRoutePreview(trip.mode);
$('#tab-nav').onclick=()=>launchActiveNavigation();
const originalLaunch=launchActiveNavigation;
launchActiveNavigation=function(){if(trip.name!=='Gurugram Cyber City'||trip.mode==='fast'){selectDestination(...destinations[0]);showToast('Driving demo uses the sample NH 48 route.');}originalLaunch();};
const searchRows=$$('#view-search [onclick^="selectDestination"]');
const empty=document.createElement('p');empty.className='empty-state';empty.hidden=true;empty.textContent='No matching sample destinations. Try Gurugram, Airport or Noida.';searchRows[0].parentElement.append(empty);
const options=$('#view-search>div:nth-child(2)>div:nth-child(2)');
function filterDestinations(){const q=$('#destination-input').value.toLowerCase().trim();let count=0;searchRows.forEach(row=>{const yes=row.textContent.toLowerCase().includes(q);row.style.display=yes?'':'none';count+=yes;});empty.hidden=!!count;options.style.display=q?'none':'';}
$('#destination-input').value='';$('#destination-input').setAttribute('aria-label','Search sample destinations');$('#destination-input').addEventListener('input',filterDestinations);
clearSearchInput=()=>{$('#destination-input').value='';filterDestinations();$('#destination-input').focus();};
let saved=[];try{saved=JSON.parse(localStorage.getItem('margrakshak-saved')||'[]');if(!Array.isArray(saved))saved=[];}catch{}
function saveCurrentRoute(){if(!saved.includes(trip.name))saved.push(trip.name);try{localStorage.setItem('margrakshak-saved',JSON.stringify(saved));}catch{}showToast('Route saved on this device.');}
const savedModal=document.createElement('div');savedModal.id='modal-saved';savedModal.className='hidden absolute inset-0 bg-black/40 flex flex-col justify-end';savedModal.innerHTML='<div class="bg-white p-5"><div class="flex justify-between items-center"><h3>Saved places</h3><button aria-label="Close saved places" onclick="document.getElementById(\'modal-saved\').classList.add(\'hidden\')">✕</button></div><div id="saved-list"></div><p class="text-xs text-slate-500 mt-3">Saved only in this browser.</p></div>';$('main').append(savedModal);
openSavedRoutesModal=function(){const list=$('#saved-list');list.replaceChildren();if(!saved.length)list.innerHTML='<p class="empty-state">Your next drive, one tap away.<br>Open a route and tap “Save route” to add it here.</p>';saved.forEach(name=>{const row=document.createElement('div');row.className='flex items-center border-b py-2';const b=document.createElement('button');b.className='text-sm flex-1 text-left';b.textContent=name;b.onclick=()=>{savedModal.classList.add('hidden');selectQuickDestination(name);};const remove=document.createElement('button');remove.textContent='Remove';remove.className='text-xs text-slate-500';remove.onclick=()=>{saved=saved.filter(n=>n!==name);try{localStorage.setItem('margrakshak-saved',JSON.stringify(saved));}catch{}openSavedRoutesModal();};row.append(b,remove);list.append(row);});savedModal.classList.remove('hidden');};
let zoom=1;triggerMapZoom=function(dir){zoom=Math.max(.8,Math.min(1.7,zoom+(dir==='in'?.15:-.15)));$$('.map-grid>svg').forEach(s=>s.style.transform=`scale(${zoom})`);};
recenterVehicle=function(){zoom=1;$$('.map-grid>svg').forEach(s=>s.style.transform='scale(1)');showToast('Sample map recentered.');};
let reportType='Speed Breaker', reportSeverity='High';const oldType=selectReportType,oldSeverity=selectSeverityLevel;
selectReportType=function(btn,type){oldType(btn,type);reportType=type;$$('.report-type-btn').forEach(b=>b.setAttribute('aria-pressed',b===btn));};
selectSeverityLevel=function(btn,level){oldSeverity(btn,level);reportSeverity=level;$$('.sev-btn').forEach(b=>b.setAttribute('aria-pressed',b===btn));};
submitHazardReport=function(){closeReportHazardModal();showToast(`${reportType} · ${reportSeverity} severity. Saved in demo only; no report sent.`);};
reportHazardFeedback=function(type){closeHazardBottomSheet();showToast(`Demo feedback: ${type}. Nothing was submitted.`);};
$$('[id^="modal-"]').forEach(m=>{m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label',m.querySelector('h3')?.textContent||'Road details');m.addEventListener('click',e=>{if(e.target===m)m.classList.add('hidden');});});
let focusBeforeDialog;
const observer=new MutationObserver(records=>{for(const r of records){const m=r.target;if(!m.classList.contains('hidden')){focusBeforeDialog=document.activeElement;m.querySelector('button,input')?.focus();}else if(focusBeforeDialog?.isConnected)focusBeforeDialog.focus();}});
$$('[id^="modal-"]').forEach(m=>observer.observe(m,{attributes:true,attributeFilter:['class']}));
document.addEventListener('keydown',e=>{const m=$$('[id^="modal-"]').find(m=>!m.classList.contains('hidden'));if(!m)return;if(e.key==='Escape')m.classList.add('hidden');if(e.key==='Tab'){const a=[...m.querySelectorAll('button,input,[tabindex="0"]')].filter(x=>x.offsetParent);const first=a[0],last=a.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
$$('div[onclick]').forEach(el=>{el.setAttribute('role','button');el.tabIndex=0;el.addEventListener('keydown',e=>{if(e.target===el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();el.click();}});});
$$('button').forEach(b=>{if(!b.textContent.trim()&&!b.hasAttribute('aria-label'))b.setAttribute('aria-label',b.title||(/close|false/.test(b.getAttribute('onclick')||'')?'Close panel':'Open control'));});
// Filters preview local layers, never claim to load traffic or location data.
$$('#modal-map-layers input').forEach((input,i)=>input.addEventListener('change',()=>{const maps=$$('.map-grid');maps.forEach(m=>{if(i===0)m.style.filter=input.checked?'':'saturate(.35)';else m.querySelectorAll('[onclick^="openHazardBottomSheet"]').forEach((p,n)=>{if(n%4===i-1)p.style.visibility=input.checked?'':'hidden';});});}));
$('#modal-report-hazard input[type=text]').setAttribute('aria-label','Optional hazard description');
switchView('home');
// Keep the illustrative map consistent with the selected destination.
const previewMap=$('#view-preview .map-grid');
const labels=[...previewMap.children].filter(e=>e.tagName==='DIV'&&!e.hasAttribute('onclick'));
const destinationPin=[...previewMap.querySelectorAll('span')].find(e=>e.textContent==='Gurugram');
const originalPreview=goToRoutePreview;
goToRoutePreview=function(mode){originalPreview(mode);const base=trip.name==='Gurugram Cyber City';const short=/Airport/.test(trip.name)?'Airport T3':/Noida/.test(trip.name)?'Noida Sec 62':'Cyber City';if(destinationPin)destinationPin.textContent=short;labels.forEach(e=>{if(e.textContent.includes('Safe Corridor')||e.dataset.routeLabel){e.dataset.routeLabel='true';e.textContent=base?(mode==='fast'?'Mehrauli–Gurgaon Rd':'NH 48 corridor'):'Illustrative route';}if(e.textContent.includes('Shankar Chowk')||e.dataset.junctionLabel){e.dataset.junctionLabel='true';e.textContent=base?'Shankar Chowk':'Sample road network';}});$$('#view-preview [onclick^="openHazardBottomSheet"]').forEach(e=>e.style.display=base?'':'none');$('#route-alert-count').textContent=(mode==='fast'?8:trip.hazards)+' reported '+((mode==='fast'?8:trip.hazards)===1?'hazard':'hazards');};
// Keep layers controls honest about the content visible in this prototype.
$$('#modal-map-layers label').forEach((label,i)=>{if(i>2){label.style.display='none';label.querySelector('input').checked=false;}});
$('#modal-map-layers label span').textContent='Map color';
$$('#modal-map-layers label span')[1].textContent='Speed breaker and pothole markers';
$$('#modal-map-layers label span')[2].textContent='Roadwork and diversion markers';
$$('#modal-map-layers input').slice(0,3).forEach((old,i)=>{const input=old.cloneNode(true);old.replaceWith(input);input.addEventListener('change',()=>{if(i===0){$$('.map-grid').forEach(m=>m.style.filter=input.checked?'':'grayscale(1)');return;}$$('.map-grid [onclick^="openHazardBottomSheet"]').forEach(e=>{const roadwork=/Construction|Diversion/.test(e.getAttribute('onclick'));if((i===2)===roadwork)e.style.visibility=input.checked?'':'hidden';});});});
const chooseDestination=selectDestination;
selectDestination=function(name,...details){if(/Airport/.test(name))name='IGI Airport Terminal 3';chooseDestination(name,...details);};
// Scale the entire schematic so pins stay attached to the road when zooming.
const mapScenes=[];
$$('.map-grid').forEach(map=>{if(!map.closest('#view-preview'))return;const scene=document.createElement('div');scene.className='map-scene';[...map.children].filter(e=>e.tagName==='svg'||e.hasAttribute('onclick')||e.className?.includes?.('font-mono')||e.className?.includes?.('font-bold')||e.className?.includes?.('flex-col items-center')).forEach(e=>scene.append(e));map.append(scene);mapScenes.push(scene);});
triggerMapZoom=function(dir){zoom=Math.max(.8,Math.min(1.6,zoom+(dir==='in'?.15:-.15)));mapScenes.forEach(s=>s.style.transform=`scale(${zoom})`);};
recenterVehicle=function(){zoom=1;mapScenes.forEach(s=>s.style.transform='scale(1)');showToast('Sample map recentered.');};
