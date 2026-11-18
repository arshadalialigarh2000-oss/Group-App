window.onerror=function(m,u,l){var b=document.getElementById('boot');if(b){b.innerHTML='⚠ App chali nahi — error: '+m+' (line '+l+').';b.style.animation='none';b.style.opacity=1}};
const KEY='vendor_ledger_apk_v2', LIMIT=30, SHOP_LIMIT=50, CHIPS=['Ameeni','Ashu','Zakir','Shariq','Bilal','PK','Stefri'];
const D_RATES=[{id:'r1',name:'Prodder tab',rate:150},{id:'r2',name:'Lactogest respule',rate:15},{id:'r3',name:'winpac dx syp',rate:24},{id:'r4',name:'Cresane syp',rate:45},{id:'r5',name:'Cydone syp',rate:35},{id:'r6',name:'winpac ls junior sy',rate:24}];
const D_VENDORS=[
{id:'v1',name:'Dr. Adil Razanagarh',phone:'',entries:[
{id:'e1',date:'2026-08-14',type:'opening',particular:'Previous Balance',openingAmount:4950},
{id:'e2',date:'2026-08-29',type:'item',particular:'Prodder tab',qty:10,rate:150},
{id:'e3',date:'2026-08-29',type:'item',particular:'Lactogest respule',qty:60,rate:15},
{id:'e4',date:'2026-09-11',type:'item',particular:'Lactogest respule',qty:20,rate:15},
{id:'e5',date:'2026-09-11',type:'item',particular:'prodder tab',qty:15,rate:150},
{id:'e6',date:'2026-09-11',type:'received',particular:'Received Amt.',mode:'cash',received:2400},
{id:'e7',date:'2026-09-11',type:'received',particular:'Received Amt',mode:'online',received:2500},
{id:'e8',date:'2026-10-09',type:'item',particular:'prodder tab',qty:15,rate:150},
{id:'e9',date:'2026-10-09',type:'received',particular:'Received Amt',mode:'cash',received:2250},
{id:'e10',date:'2026-10-21',type:'item',particular:'Prodder tab',qty:10,rate:150},
{id:'e11',date:'2026-10-21',type:'item',particular:'Lactogest respule',qty:20,rate:15},
{id:'e12',date:'2026-10-21',type:'item',particular:'winpac dx syp',qty:13,rate:24},
{id:'e13',date:'2026-10-21',type:'item',particular:'Cresane syp',qty:5,rate:45},
{id:'e14',date:'2026-10-21',type:'item',particular:'Cydone syp',qty:5,rate:35},
{id:'e15',date:'2026-10-21',type:'received',particular:'Received Amt',mode:'cash',received:2000},
{id:'e16',date:'2026-11-10',type:'item',particular:'Cresane syp',qty:5,rate:45},
{id:'e17',date:'2026-11-10',type:'item',particular:'winpac ls junior sy',qty:20,rate:24},
{id:'e18',date:'2026-11-10',type:'item',particular:'winpac dx syp',qty:30,rate:28},
{id:'e19',date:'2026-11-10',type:'item',particular:'Prodder tab',qty:9,rate:150},
{id:'e20',date:'2026-11-10',type:'item',particular:'Lactogest respule',qty:10,rate:15}]},
{id:'v2',name:'Dr. Faizan Medical Hall',phone:'',entries:[
{id:'v2_1',date:'2026-10-01',type:'opening',particular:'Previous Balance',openingAmount:3200},
{id:'v2_2',date:'2026-11-05',type:'item',particular:'Prodder tab',qty:12,rate:150},
{id:'v2_3',date:'2026-11-05',type:'item',particular:'Cresane syp',qty:10,rate:45},
{id:'v2_4',date:'2026-11-05',type:'received',particular:'Received Amt',mode:'online',received:2000}]}];
const clone=o=>JSON.parse(JSON.stringify(o));
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const $=id=>document.getElementById(id);
const inr=n=>'₹'+Number(n).toLocaleString('en-IN');
const fn=n=>Number(n).toLocaleString('en-IN');
const rd2=n=>Math.round(Number(n)*100)/100;
const kv=n=>String(n||'').trim().toLowerCase().replace(/\s+/g,' ');
const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];

let state=load(), activeV=null, cashKey=null, unlocked=new Set(), entryUnlocked=false, pendDel=null, pendReset=false, pendShare=null, shopV=null, udId=null, shId=null, renIdx=null, arKey=null, plOpen=false, clAll=false, dsCols=[{n:'',t:'text'}], impMode=null, uidN=0;

function load(){let s=null,raw=null;try{raw=localStorage.getItem(KEY);if(raw)s=JSON.parse(raw)}catch(e){window.__noSave=!!raw}
 if(raw&&s){try{localStorage.setItem(KEY+'_prev',raw)}catch(e){}}
 if(!s)s={vendors:clone(D_VENDORS),rates:clone(D_RATES)};
 if(!s.accounts)s.accounts={};
 ['shop','personal'].forEach(k=>{if(!Array.isArray(s.accounts[k]))s.accounts[k]=[]});
 if(!s.rf)s.rf={add:3,mp:20};
 return normShop(s)}
function save(){if(window.__noSave)return;try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function esc(v){return v==null?'':String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
function fmtDate(i){if(!i||!i.includes('-'))return i||'';const[y,m,d]=i.split('-');return d+'-'+m+'-'+y}
function fmtShort(i){if(!i||!i.includes('-'))return i||'';const[y,m,d]=i.split('-');return d+'-'+m+'-'+y.slice(2)}
let tt=null;function toast(m){const e=$('toast');e.textContent=m;e.classList.remove('hidden');clearTimeout(tt);tt=setTimeout(()=>e.classList.add('hidden'),2600)}
function openModal(id){
 if(id==='m-vendor') $('vn-date').value=today();
 if(id==='m-rf'){ $('rf-add').value=state.rf.add; $('rf-mp').value=state.rf.mp; }
 pendReset=false;
 $(id).classList.remove('hidden');
}
function closeModal(id){$(id).classList.add('hidden')}
function show(id){document.querySelectorAll('.pg').forEach(p=>p.classList.toggle('hidden',p.id!==id));setTimeout(()=>{const n=$(id).querySelector('.nav');if(n)document.documentElement.style.setProperty('--nav-h',n.offsetHeight+'px');setBanH()},0);window.scrollTo(0,0)}
function uid(p){return p+Date.now()+'_'+(++uidN)}

function normShop(s){if(!Array.isArray(s.custom))s.custom=[];if(!s.names||typeof s.names!=='object')s.names={};if(!s.accounts)s.accounts={};s.custom.forEach(c=>{if(!Array.isArray(s.accounts[c.id]))s.accounts[c.id]=[]});
 if(!s.shop||!Array.isArray(s.shop.entries))s.shop={chips:CHIPS.slice(),entries:[]};if(!Array.isArray(s.shop.chips))s.shop.chips=CHIPS.slice();if(!s.shop.open||typeof s.shop.open!=='object')s.shop.open={};if(typeof s.shop.openOthers!=='number')s.shop.openOthers=0;if(!s.rf)s.rf={add:3,mp:20};return s}

/* ---------- LEDGER CALC ---------- */
function buildLedger(v){
 const sorted=v.entries.map((e,i)=>({...e,_o:i})).sort((a,b)=>a.date===b.date?a._o-b._o:a.date.localeCompare(b.date));
 const by=new Map();sorted.forEach(e=>{if(!by.has(e.date))by.set(e.date,[]);by.get(e.date).push(e)});
 let run=0,last='';const rows=[];let gi=0;
 by.forEach((items,date)=>{last=date;let add=0,rec=0;
  const g=items.map((r,i)=>{let tot=null,rv=null;
   if(r.type==='opening')run+=Number(r.openingAmount||0);
   else if(r.type==='item'){tot=Math.round(Number(r.qty||0)*Number(r.rate||0)*100)/100;add+=tot}
   else if(r.type==='received'){rv=Number(r.received||0);rec+=rv}
   return{...r,date,gi,isFirst:i===0,isLast:i===items.length-1,totalVal:tot,recVal:rv,finalVal:null}});
  run=Math.round((run+add-rec)*100)/100;g[g.length-1].finalVal=run;rows.push(...g);gi++});
 return{rows,finalBalance:run,lastDate:last?fmtDate(last):'No entries'}}

/* ---------- HOME ---------- */
const CATS={shop:['🏪','Shop'],udhaar:['💸','Udhaar'],personal:['👤','Personal'],bank:['🏦','Bank'],ghar:['🏠','Ghar'],other:['📒','Other']};
const DEF_NAMES={shop:'Shop Vendors Account',personal:'Personal Account',vendors:'Doctors Account'};
const accName=k=>{const c=state.custom.find(a=>a.id===k);return c?c.name:((state.names&&state.names[k])||DEF_NAMES[k]||'Account')};
const penBtn=k=>`<button type="button" class="pen" onpointerdown="penDown(event,'${k}')" onpointerup="penUp()" onpointercancel="penUp()" onpointerleave="penUp()" onclick="penTap(event)" oncontextmenu="return false">✎</button>`;
let penT=null,penDone=false;
function penDown(e,k){e.stopPropagation();penDone=false;clearTimeout(penT);e.currentTarget.classList.add('hold');penT=setTimeout(()=>{penDone=true;penUp();if(navigator.vibrate)navigator.vibrate(30);openAccRen(k)},800)}
function penUp(){clearTimeout(penT);document.querySelectorAll('.pen.hold').forEach(b=>b.classList.remove('hold'))}
function penTap(e){e.stopPropagation();if(!penDone)toast('Naam badalne ke liye ✎ ko 1 second dabaye rakhein');penDone=false}
function openAccRen(k){arKey=k;$('ar-name').value=accName(k);const c0=state.custom.find(a=>a.id===k);$('ar-catbox').classList.toggle('hidden',!c0);if(c0){$('ar-cat').value=c0.cat||'other';$('ar-fmt').value=fmtOf(k)}openModal('m-accren');setTimeout(()=>{$('ar-name').focus();$('ar-name').select()},50)}
function saveAccRen(e){e.preventDefault();const n=$('ar-name').value.trim();if(!n)return;const c=state.custom.find(a=>a.id===arKey);if(c){const nf=$('ar-fmt').value;if(nf==='sheet'&&!(c.cols&&c.cols.length))return toast('Apne columns sirf naya account banate waqt ban sakte hain');c.name=n;c.cat=$('ar-cat').value;c.fmt=nf}else state.names[arKey]=n;save();closeModal('m-accren');renderHome();toast('Naam badal gaya: '+n)}
function shopTotal(){const c=shopCalc();let t=Number(state.shop.openOthers||0);Object.keys(c.bal).forEach(k=>{t+=c.bal[k]});return Math.round(t*100)/100}
function renderCustom(){$('h-custom').innerHTML=state.custom.map(a=>{const c=CATS[a.cat]||CATS.other;
 return `<div class="big" onclick="openCash('${a.id}')"><div class="left">${penBtn(a.id)}<div class="ic">${c[0]}</div><div><h3>${esc(a.name)}</h3><small>${c[1]} account</small></div></div><div class="amt mono"><small>${accInfo(a.id).l}</small><span>${accInfo(a.id).v}</span></div></div>`}).join('')}
function createAcc(e){e.preventDefault();const name=$('ac-name').value.trim();if(!name)return;
 const id='a_'+Date.now();let fmt=$('ac-fmt').value;const cat=$('ac-cat').value;if(fmt==='cash'&&cat==='udhaar')fmt='udhaar';
 let cols=null;if(fmt==='sheet'){cols=dsCols.filter(c=>c.n.trim()).map(c=>({n:c.n.trim(),t:c.t}));if(!cols.length)return toast('Kam se kam ek column ka naam likhein')}
 state.custom.push(cols?{id,name,cat,fmt,cols}:{id,name,cat,fmt});state.accounts[id]=[];
 save();closeModal('m-acc');$('ac-name').value='';$('ac-fmt').value='cash';dsCols=[{n:'',t:'text'}];fmtChange();renderHome();toast(name+' account ban gaya!')}
function cashBal(k){return (state.accounts[k]||[]).reduce((s,e)=>s+(e.type==='in'?1:-1)*Number(e.amount||0),0)}
function renderHome(){
 renderCustom();
 ['shop','personal','vendors'].forEach(k=>{$('h-n-'+k).textContent=accName(k)});
 $('h-shop').textContent=inr(shopTotal());
 $('h-personal').textContent=accInfo('personal').v;
 let t=0;state.vendors.forEach(v=>{if(!isClinic(v))t+=buildLedger(v).finalBalance});
 $('h-vendors').textContent=inr(t);$('h-vcount').textContent=state.vendors.length+' doctors';
}

/* ---------- VENDORS ---------- */
function openVendors(){$('v-title').textContent=accName('vendors');show('pg-vendors');renderVendors();renderRates();refreshItems()}
function vTab(t){$('vw-v').classList.toggle('hidden',t!=='v');$('vw-r').classList.toggle('hidden',t==='v');$('tb-v').classList.toggle('on',t==='v');$('tb-r').classList.toggle('on',t!=='v')}
function renderVendors(){
 const q=($('vsearch').value||'').toLowerCase().trim();let tot=0;
 state.vendors.forEach(v=>{if(!isClinic(v))tot+=buildLedger(v).finalBalance});
 $('v-total').textContent=inr(tot);$('vcount').textContent=state.vendors.length;
 const list=state.vendors.filter(v=>v.name.toLowerCase().includes(q));
 $('vlist').innerHTML=list.length?list.map(v=>{const cl=isClinic(v),s=cl?{lastDate:fmtDate(clinicPeriod(v).to),finalBalance:Math.round(clinicCalc(v).total)}:buildLedger(v);const ini=v.name.replace(/^Dr\.\s*/i,'').charAt(0).toUpperCase()||'V';
  return `<div class="vc" onclick="openLedger('${v.id}')"><div class="left"><div class="av">${esc(ini)}</div><div style="min-width:0"><div class="vn">${esc(v.name)}</div><div class="vm">Last: ${s.lastDate} • ${cl?(v.moves||[]).length:v.entries.length} rows ${v.phone?' • '+esc(v.phone):''}</div></div></div><div class="vr"><small>${cl?'Dena hai':'Final Balance'}</small><b class="mono">${inr(s.finalBalance)}</b></div></div>`}).join('')
 :'<div style="text-align:center;padding:28px;background:#fff;border-radius:16px;border:1px dashed #cbd5e1;color:#64748b;font-size:13px">Koi doctor nahi mila.</div>'}
function renderRates(){
 $('rlist').innerHTML=state.rates.map(r=>{const u=unlocked.has(r.id);
  return `<div class="rr"><b style="font-size:14px">${u?'🔓':'🔒'} ${esc(r.name)}</b><div style="display:flex;align-items:center"><div class="rb ${u?'un':''}">₹<input id="ri-${r.id}" class="mono" type="number" step="0.01" value="${r.rate}" ${u?'':'readonly'}/></div><button class="ml ${u?'un':''}" onclick="toggleRate('${r.id}')">${u?'Save':'Edit'}</button><button class="ml" style="background:none;color:#94a3b8" onclick="delRate('${r.id}')">✕</button></div></div>`}).join('')}
function toggleRate(id){
 if(unlocked.has(id)){const n=parseFloat($('ri-'+id).value);const r=state.rates.find(x=>x.id===id);if(r&&!isNaN(n)&&n>=0){r.rate=n;save()}unlocked.delete(id);renderRates();refreshItems();toast('Rate locked!')}
 else{unlocked.add(id);renderRates();const i=$('ri-'+id);i.focus();i.select()}}
function addRate(e){e.preventDefault();const name=$('nr-name').value.trim(),rate=parseFloat($('nr-val').value);if(!name||isNaN(rate))return;
 const ex=state.rates.find(r=>r.name.toLowerCase()===name.toLowerCase());
 if(ex){ex.rate=rate;toast(ex.name+' rate updated')}else{state.rates.push({id:'r_'+Date.now(),name,rate});toast(name+' fixed at ₹'+rate)}
 $('nr-name').value='';$('nr-val').value='';save();renderRates();refreshItems()}
function delRate(id){state.rates=state.rates.filter(r=>r.id!==id);unlocked.delete(id);save();renderRates();refreshItems()}
function refreshItems(){$('items').innerHTML=state.rates.map(r=>`<option value="${esc(r.name)}">₹${r.rate}</option>`).join('')}
function createVendor(e){e.preventDefault();const name=$('vn-name').value.trim();if(!name)return;
 const v={id:'v_'+Date.now(),name,phone:$('vn-phone').value.replace(/\D/g,''),entries:[{id:'e_'+Date.now(),date:$('vn-date').value||today(),type:'opening',particular:'Previous Balance',openingAmount:parseFloat($('vn-bal').value)||0}]};
 if($('vn-fmt').value==='clinic'){v.fmt='clinic';v.products=[];v.moves=[]}state.vendors.unshift(v);save();closeModal('m-vendor');$('vn-fmt').value='';$('vn-name').value='';$('vn-phone').value='';$('vn-bal').value='0';
 renderVendors();openLedger(v.id);toast(name+' ledger created!')}

/* ---------- CASHBOOK ---------- */
function openCash(k){if(isUd(k))return openUd(k);if(isSheet(k))return openSheet(k);cashKey=k;$('c-date').value=today();show('pg-cash');renderCash()}
function renderCash(){
 const nm=accName(cashKey);
 $('c-name').textContent=nm;
 if(!state.accounts[cashKey])state.accounts[cashKey]=[];
 const list=state.accounts[cashKey].map((e,i)=>({...e,_o:i})).sort((a,b)=>a.date===b.date?a._o-b._o:a.date.localeCompare(b.date));
 let run=0,html='',i=0;
 list.forEach((e,idx)=>{run+=(e.type==='in'?1:-1)*Number(e.amount);run=Math.round(run*100)/100;i++;
  const dt=idx===0||list[idx-1].date!==e.date?fmtDate(e.date):'';
  html+=`<tr class="${i%2?'b1':'b0'}"><td class="cd">${dt}</td><td class="cp">${esc(e.particular)}</td><td class="cn mono">${e.type==='in'?e.amount:''}</td><td class="cn mono">${e.type==='out'?e.amount:''}</td><td class="cf mono">${run}</td><td class="ca no-print"><button class="ra" onclick="delCash('${e.id}')">${pendDel===e.id?'OK?':'✕'}</button></td></tr>`});
 for(let k=0;k<3;k++)html+=`<tr class="sep ${(i+k)%2?'b1':'b0'}"><td></td><td></td><td></td><td></td><td></td><td class="no-print"></td></tr>`;
 $('c-body').innerHTML=html;$('c-bal').textContent=run;$('c-title').innerHTML=esc(nm)+',<br/>final balance';setBanH()}
function addCash(e){e.preventDefault();const amt=parseFloat($('c-amt').value);if(isNaN(amt)||amt<=0)return toast('Sahi amount bharein');
 state.accounts[cashKey].push({id:'c_'+Date.now(),date:$('c-date').value,type:$('c-type').value,particular:$('c-part').value.trim(),amount:amt});
 $('c-part').value='';$('c-amt').value='';save();renderCash();toast('Entry saved!')}
function delCash(id){if(pendDel!==id){pendDel=id;renderCash();return toast('Delete ke liye dubara "OK?" dabayein')}
 state.accounts[cashKey]=state.accounts[cashKey].filter(x=>x.id!==id);pendDel=null;save();renderCash();toast('Entry deleted')}

/* ---------- VENDOR LEDGER PAGES ---------- */
function ledgerPage(n,full){
 return `<div class="nav no-print"><div class="l"><button class="nb" onclick="${full?'backToL3()':'backToVendors()'}">${full?'← Last 30':'← Doctors'}</button><div style="min-width:0"><small>${full?'Page 4 • Full Ledger':'Page 3 • Last '+LIMIT+' Rows'}</small><div class="t" id="p${n}-nm"></div></div></div>
 <div style="display:flex;gap:6px"><button class="nb" onclick="openImport('doc')">📥</button><button class="nb wa" onclick="shareWA()">📷 Image</button><button class="nb pdf" onclick="printPDF()">PDF</button></div></div>
 <div class="ws"><div class="ban"><div class="a"><h2 id="p${n}-tt"></h2></div><div class="b mono" id="p${n}-bal"></div></div>
 <div class="tb no-print"><span id="p${n}-info"></span><button class="nb" style="background:#e2e8f0;color:#1e293b;padding:4px 8px" onclick="dlCSV()">Export CSV</button></div>
 <div class="sc"><table><thead><tr><th>Date</th><th class="tl">Particular</th><th>Qty</th><th>Rate</th><th>Total</th><th>Received<br/>Amount</th><th>Final<br/>Amount</th><th class="ca no-print">Edit</th></tr></thead><tbody id="p${n}-body"></tbody></table></div>
 ${full?'':`<button class="more no-print" id="p3-more" onclick="openFull()"></button>
 <div class="ep no-print"><h3>+ Add Billing / Payment Entry</h3>
 <form onsubmit="addEntry(event)" class="eg">
  <div class="fg"><label class="fl">Date</label><input id="en-date" class="di" type="date" required/></div>
  <div class="fg"><label class="fl">Entry Type</label><select id="en-type" class="di" onchange="entryType()"><option value="item">Item Bill (Sale)</option><option value="received">Received Amount</option></select></div>
  <div id="bx-item" class="sub"><div class="fg"><label class="fl">Particular</label><input id="en-item" class="di" list="items" oninput="itemInput()" placeholder="Select or type item"/></div>
   <div class="fg"><label class="fl">Qty</label><input id="en-qty" class="di mono" type="number" min="1" step="1"/></div>
   <div class="fg"><label class="fl"><span>Rate</span><button type="button" id="en-lock" onclick="toggleLock()" style="background:none;color:#fde047;font-size:10px;font-weight:800">LOCKED</button></label><input id="en-rate" class="di mono" type="number" step="0.01" readonly/></div></div>
  <div id="bx-rec" class="hidden sub" style="grid-template-columns:1fr 1fr"><div class="fg"><label class="fl">Payment Mode</label><select id="en-mode" class="di"><option value="cash">cash</option><option value="online">online</option></select></div>
   <div class="fg"><label class="fl">Received Amount ₹</label><input id="en-rec" class="di mono" type="number" min="1" step="0.01"/></div></div>
  <button class="go">+ Save Entry to Ledger</button></form></div>`}</div>`}
$('pg-l3').innerHTML=ledgerPage(3,false);$('pg-l4').innerHTML=ledgerPage(4,true);

function openLedger(id){activeV=id;pendDel=null;const v0=state.vendors.find(x=>x.id===id);if(v0&&isClinic(v0)){show('pg-cl');renderClinic();return}$('en-date').value=today();show('pg-l3');renderLedger()}
function openFull(){show('pg-l4');renderLedger()}
function backToL3(){show('pg-l3');renderLedger()}
function backToVendors(){activeV=null;show('pg-vendors');renderVendors()}

function rowsHTML(rows,limit){
 const vis=limit?rows.slice(-limit):rows;let html='',v=0,prevG=null;
 vis.forEach((r,idx)=>{
  if(idx>0&&r.gi!==prevG){v++;html+=`<tr class="sep ${v%2?'b1':'b0'}"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td class="no-print"></td></tr>`}
  prevG=r.gi;v++;
  const showDate=idx===0||r.isFirst;
  let p='',q='',rt='',t='',rc='';
  if(r.type==='opening')p='Previous Balance';
  else if(r.type==='item'){p=esc(r.particular);q=r.qty;rt=r.rate;t=r.totalVal}
  else{p=esc(r.particular||'Received Amt');q=esc(r.mode||'cash');rc=r.recVal}
  html+=`<tr class="${v%2?'b1':'b0'}"><td class="cd">${showDate?fmtDate(r.date):''}</td><td class="cp">${p}</td><td class="cn mono">${q}</td><td class="cn mono">${rt}</td><td class="cn mono">${t}</td><td class="cn mono">${rc}</td><td class="cf mono">${r.isLast?r.finalVal:''}</td><td class="ca no-print"><button class="ra" onclick="openEdit('${r.id}')">✎</button><button class="ra" onclick="delRow('${r.id}')">${pendDel===r.id?'OK?':'✕'}</button></td></tr>`});
 for(let k=0;k<3;k++){v++;html+=`<tr class="sep ${v%2?'b1':'b0'}"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td class="no-print"></td></tr>`}
 return html}
function renderLedger(){
 const vendor=state.vendors.find(x=>x.id===activeV);if(!vendor)return;
 const L=buildLedger(vendor),total=L.rows.length,old=Math.max(0,total-LIMIT);
 [[3,LIMIT],[4,0]].forEach(([n,lim])=>{
  $('p'+n+'-nm').textContent=vendor.name;
  $('p'+n+'-tt').innerHTML=esc(vendor.name)+',<br/>ledger final balance';
  $('p'+n+'-bal').textContent=L.finalBalance;
  $('p'+n+'-body').innerHTML=rowsHTML(L.rows,lim);
  $('p'+n+'-info').textContent=n===3?(old?`Latest ${LIMIT} rows (kul ${total})`:`Kul ${total} rows`):`Poora data: ${total} rows`});
 const b=$('p3-more');b.classList.toggle('hidden',old===0);b.textContent=`📂 Full Data dekhein (${old} purani rows aur)`;setBanH()}

function entryType(){const i=$('en-type').value==='item';$('bx-item').classList.toggle('hidden',!i);$('bx-rec').classList.toggle('hidden',i)}
function itemInput(){const val=$('en-item').value.trim().toLowerCase(),ri=$('en-rate'),lb=$('en-lock');const m=state.rates.find(r=>r.name.toLowerCase()===val);
 if(m){ri.value=m.rate;entryUnlocked=false;ri.readOnly=true;lb.textContent='LOCKED';lb.style.color='#fde047'}
 else if(!entryUnlocked){ri.readOnly=false;lb.textContent='CUSTOM';lb.style.color='#34d399'}}
function toggleLock(){const ri=$('en-rate'),lb=$('en-lock');entryUnlocked=!entryUnlocked;
 if(entryUnlocked){ri.readOnly=false;lb.textContent='UNLOCKED';lb.style.color='#34d399';ri.focus()}else{ri.readOnly=true;lb.textContent='LOCKED';lb.style.color='#fde047';itemInput()}}
function addEntry(e){e.preventDefault();const v=state.vendors.find(x=>x.id===activeV);if(!v)return;const date=$('en-date').value;if(!date)return;
 if($('en-type').value==='item'){const p=$('en-item').value.trim(),q=parseFloat($('en-qty').value),r=parseFloat($('en-rate').value);
  if(!p||isNaN(q)||q<=0||isNaN(r)||r<0)return toast('Sahi Item, Qty aur Rate bharein');
  v.entries.push({id:'e_'+Date.now(),date,type:'item',particular:p,qty:q,rate:r});$('en-item').value='';$('en-qty').value='';$('en-rate').value=''}
 else{const a=parseFloat($('en-rec').value);if(isNaN(a)||a<=0)return toast('Sahi Received Amount bharein');
  v.entries.push({id:'e_'+Date.now(),date,type:'received',particular:'Received Amt',mode:$('en-mode').value,received:a});$('en-rec').value=''}
 save();renderLedger();toast('Entry saved & Final Amount updated!')}
function delRow(id){if(pendDel!==id){pendDel=id;renderLedger();return toast('Delete ke liye dubara "OK?" dabayein')}
 const v=state.vendors.find(x=>x.id===activeV);v.entries=v.entries.filter(e=>e.id!==id);pendDel=null;save();renderLedger();toast('Row deleted')}
function openEdit(id){const v=state.vendors.find(x=>x.id===activeV),r=v&&v.entries.find(e=>e.id===id);if(!r)return;
 $('ed-id').value=r.id;$('ed-type').value=r.type;$('ed-date').value=r.date;
 ['ed-o','ed-i','ed-r'].forEach(k=>$(k).classList.add('hidden'));
 if(r.type==='opening'){$('ed-o').classList.remove('hidden');$('ed-open').value=r.openingAmount||0}
 else if(r.type==='item'){$('ed-i').classList.remove('hidden');$('ed-part').value=r.particular||'';$('ed-qty').value=r.qty||1;$('ed-rate').value=r.rate||0}
 else{$('ed-r').classList.remove('hidden');$('ed-mode').value=r.mode||'cash';$('ed-rec').value=r.received||0}
 openModal('m-edit')}
function saveEdit(e){e.preventDefault();const v=state.vendors.find(x=>x.id===activeV),r=v&&v.entries.find(x=>x.id===$('ed-id').value);if(!r)return;
 r.date=$('ed-date').value;const t=$('ed-type').value;
 if(t==='opening')r.openingAmount=parseFloat($('ed-open').value)||0;
 else if(t==='item'){r.particular=$('ed-part').value.trim();r.qty=parseFloat($('ed-qty').value)||0;r.rate=parseFloat($('ed-rate').value)||0}
 else{r.mode=$('ed-mode').value;r.received=parseFloat($('ed-rec').value)||0}
 save();closeModal('m-edit');renderLedger();toast('Row updated!')}

/* ---------- SHARE / PRINT / CSV (simplified) ---------- */
function curRoot(){return $('pg-l4').classList.contains('hidden')?$('pg-l3'):$('pg-l4')}
async function shareWA(){toast('Image feature simplified — use PDF / Print for now')}
function printPDF(){const v=state.vendors.find(x=>x.id===activeV);if(v&&curRoot().id==='pg-l3'){$('p3-body').innerHTML=rowsHTML(buildLedger(v).rows,0);window.onafterprint=()=>{window.onafterprint=null;renderLedger()}}
 toast('Opening Print / Save as PDF...');setTimeout(()=>window.print(),250)}
function dlCSV(){const v=state.vendors.find(x=>x.id===activeV);if(!v)return;const L=buildLedger(v);
 const out=[['"'+v.name+' - Ledger Final Balance"','','','','','',L.finalBalance],['Date','Particular','Qty','Rate','Total','Received Amount','Final Amount']];
 L.rows.forEach((r)=>{out.push([r.isFirst?fmtDate(r.date):'','"'+(r.type==='opening'?'Previous Balance':(r.particular||''))+'"',r.type==='item'?r.qty:(r.type==='received'?r.mode:''),r.type==='item'?r.rate:'',r.type==='item'?r.totalVal:'',r.type==='received'?r.recVal:'',r.isLast?r.finalVal:'']);
  if(r.isLast)out.push(['','','','','','',''])});
 const blob=new Blob([out.map(r=>r.join(',')).join('\n')],{type:'text/csv;charset=utf-8;'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=v.name.replace(/[^a-z0-9]/gi,'_')+'_Ledger.csv';a.click();toast('CSV downloaded!')}

/* ---------- SHOP ---------- */
function shopCalc(){
 const E=state.shop.entries.map((e,i)=>({...e,_o:i})).sort((a,b)=>a.date===b.date?a._o-b._o:a.date.localeCompare(b.date));
 const bal={};state.shop.chips.forEach(c=>{bal[kv(c)]=Number(state.shop.open[kv(c)]||0)});E.forEach(e=>{const k=kv(e.vendor);bal[k]=Math.round(((bal[k]||0)+Number(e.bill||0)-Number(e.paid||0))*100)/100;e.rem=bal[k];e.k=k});
 return{E,bal}}
function matchQ(e,q){q=(q||'').trim().toLowerCase();if(!q)return true;
 return q.split(/[,\s]+/).filter(Boolean).some(t=>{
  if(/^\d+(\.\d+)?$/.test(t)){const n=Number(t);if([e.bill,e.paid,e.rem].some(v=>Number(v)===n))return true;return n>=1&&n<=31&&Number(e.date.slice(8,10))===n}
  if(/^\d+([-\/.]\d+)+$/.test(t)){const pt=t.split(/[-\/.]/).map(Number),[y,m,d]=e.date.split('-').map(Number);
   if(pt.length===3){let yy=pt[2];if(yy<100)yy+=2000;return pt[0]===d&&pt[1]===m&&yy===y}
   if(pt.length===2)return pt[1]>=100?(pt[0]===m&&pt[1]===y):(pt[0]===d&&pt[1]===m);return false}
  return kv(e.vendor).includes(t)})}
function shopRow(e,i){return `<tr class="${i%2?'':'o'}"><td class="sv">${esc(e.vendor)}</td><td class="sb">${e.bill}</td><td class="sp">${e.paid}</td><td class="sr ${e.rem<0?'neg':''}">${e.rem}</td><td class="sd">${fmtDate(e.date)} <button class="ra" onclick="openShopEdit('${e.id}')">✎</button><button class="ra" onclick="delShop('${e.id}')">${pendDel===e.id?'OK?':'✕'}</button></td></tr>`}
function vTotals(vl,prev){
 const ym=today().slice(0,7),y=Number(ym.slice(0,4)),m=Number(ym.slice(5)),mm=ym.slice(5),last=String(new Date(y,m,0).getDate()).padStart(2,'0');
 let mb=0,mp=0,ab=0,ap=0;vl.forEach(e=>{const b=Number(e.bill||0),p=Number(e.paid||0);ab+=b;ap+=p;if(e.date.startsWith(ym)){mb+=b;mp+=p}});
 const r=n=>Math.round(n*100)/100,mn=r(mb-mp),an=r(Number(prev||0)+ab-ap);
 const f=vl.length?fmtDate(vl[0].date):'-',l=vl.length?fmtDate(vl[vl.length-1].date):'-';
 return `<tr class="tr1"><td class="sv">Month Total<br><small>${MN[m-1]} ${y}</small></td><td>${r(mb)}</td><td>${r(mp)}</td><td class="${mn<0?'neg':''}">${mn}</td><td class="sd">01-${mm}-${y}<br>se ${last}-${mm}-${y}</td></tr><tr class="tr2"><td class="sv">Kul Total<br><small>Previous sahit</small></td><td>${r(ab)}</td><td>${r(ap)}</td><td class="${an<0?'neg':''}">${an}</td><td class="sd">${f}<br>se ${l}</td></tr>`}
function openRow(i,label){const v=i<0?(state.shop.openOthers||0):(state.shop.open[kv(state.shop.chips[i])]||0);
 return `<tr class="${(i<0?state.shop.chips.length:i)%2?'':'o'}"><td class="sv">${esc(label)}</td><td class="sb">—</td><td class="sp">—</td><td class="sr"><input class="oi mono" type="number" step="any" value="${v}" onchange="setOpen(${i},this.value)"/></td><td class="sd">Previous</td></tr>`}
function openRowsHTML(){return state.shop.chips.map((c,i)=>openRow(i,c)).join('')+openRow(-1,'Others')}
function setOpen(i,val){const n=parseFloat(val)||0;if(i<0)state.shop.openOthers=n;else state.shop.open[kv(state.shop.chips[i])]=n;save();renderShopAll();toast('Previous amount saved')}
function openShop(){show('pg-shop');renderShopAll();scrollShopEnd()}
function scrollShopEnd(){const t=document.querySelector('#pg-shop .st');if(t)setTimeout(()=>{t.scrollTop=t.scrollHeight},30)}
function renameChip(i){renIdx=i;$('ren-name').value=state.shop.chips[i];openModal('m-ren');setTimeout(()=>{$('ren-name').focus();$('ren-name').select()},50)}
function saveRename(e){e.preventDefault();const n=$('ren-name').value.trim(),old=state.shop.chips[renIdx];if(!n)return;
 if(kv(n)!==kv(old)&&state.shop.chips.some(c=>kv(c)===kv(n)))return toast('Ye naam pehle se chip me hai');
 {const ok=kv(old),nk=kv(n);if(ok!==nk){state.shop.open[nk]=(state.shop.open[nk]||0)+(state.shop.open[ok]||0);delete state.shop.open[ok]}}state.shop.chips[renIdx]=n;state.shop.entries.forEach(x=>{if(kv(x.vendor)===kv(old)||kv(x.vendor)===kv(n))x.vendor=n});
 save();closeModal('m-ren');renderShopAll();toast('Naam badal gaya: '+n)}
function toggleSearch(){const r=$('s-srow');r.classList.toggle('hidden');if(!r.classList.contains('hidden'))$('s-q').focus();else{$('s-q').value='';renderShopAll()}}
function openShopV(k){shopV=k;show('pg-shopv');renderShopAll()}
function openShopFull(){show('pg-shopfull');renderShopAll()}
function renderShopAll(){
 const{E,bal}=shopCalc(),chipKeys=state.shop.chips.map(kv);
 $('s-vlist').innerHTML=[...new Set([...state.shop.chips,...E.map(e=>e.vendor)])].map(n=>`<option value="${esc(n)}">`).join('');
 let html=state.shop.chips.map((c,i)=>{const b=bal[kv(c)]||0;return `<div class="chip" onclick="openShopV(${i})"><span><button class="ci" onclick="event.stopPropagation();renameChip(${i})">👤</button>${esc(c)}</span><em class="${b<0?'neg':''}">${fn(b)}</em></div>`}).join('');
 let oth=Number(state.shop.openOthers||0);Object.keys(bal).forEach(k=>{if(!chipKeys.includes(k))oth+=bal[k]});oth=Math.round(oth*100)/100;
 html+=`<div class="chip" onclick="openShopV(-1)"><span><span class="ci">👥</span>Others</span><em class="${oth<0?'neg':''}">${fn(oth)}</em></div>`;
 $('s-chips').innerHTML=html;
 const ym=today().slice(0,7);let mb=0,mp=0;E.forEach(e=>{if(e.date.startsWith(ym)){mb+=Number(e.bill||0);mp+=Number(e.paid||0)}});
 const un=Math.round((mb-mp)*100)/100,mn=MN[Number(ym.slice(5))-1]+' '+ym.slice(0,4);
 $('s-sum').innerHTML=`<div class="sumr"><div class="l">Total Month Bills</div><div class="v mono">${fn(mb)}</div></div><div class="sumr"><div class="l">Total Month Paid</div><div class="v mono">${fn(mp)}</div></div><div class="sumr"><div class="l">This Month Unpaid</div><div class="v mono ${un>0?'neg':''}">${fn(un)}</div></div>`;
 const q=$('s-q').value.trim();let list=E.filter(e=>matchQ(e,q)),shown=q?list:list.slice(-SHOP_LIMIT);
 $('s-body').innerHTML=(q?'':openRowsHTML())+(shown.map(shopRow).join('')||(q?'<tr><td colspan="5" style="padding:18px;color:#64748b">Koi entry nahi mili</td></tr>':''));
 $('s-info').textContent=q?`${list.length} entries mili`:`${mn} • Latest ${shown.length} entries (kul ${E.length})`;
 const more=$('s-more');more.textContent=`📂 Full Entries dekhein (kul ${E.length})`;more.classList.toggle('hidden',!!q||E.length<=SHOP_LIMIT);
 if(shopV!==null){const isO=shopV<0,ck=isO?null:kv(state.shop.chips[shopV]),vl=E.filter(e=>isO?!chipKeys.includes(e.k):e.k===ck);
  const nm=isO?'Others':state.shop.chips[shopV],tb=isO?oth:(bal[ck]||0);
  $('sv-name').textContent=nm;$('sv-bal').textContent=fn(tb);$('sv-bal').className='v mono '+(tb<0?'neg':'');
  $('sv-info').textContent=`${vl.length} entries • purani pehle, latest sabse neeche`;
  $('sv-body').innerHTML=openRow(shopV,nm)+vl.map(shopRow).join('')+vTotals(vl,isO?(state.shop.openOthers||0):(state.shop.open[ck]||0))}
 const fq=$('sf-q').value.trim(),fl=E.filter(e=>matchQ(e,fq));let fh='',cm='',idx=0;
 fl.forEach(e=>{const m=e.date.slice(0,7);if(m!==cm){cm=m;let b=0,p=0;fl.forEach(x=>{if(x.date.startsWith(m)){b+=Number(x.bill||0);p+=Number(x.paid||0)}});
  fh+=`<tr class="mh"><td colspan="5">${MN[Number(m.slice(5))-1]} ${m.slice(0,4)} — Bills ${fn(b)} • Paid ${fn(p)} • Unpaid ${fn(Math.round((b-p)*100)/100)}</td></tr>`;idx=0}
  fh+=shopRow(e,idx++)});
 $('sf-body').innerHTML=(fq?'':openRowsHTML())+(fh||(fq?'<tr><td colspan="5" style="padding:18px;color:#64748b">Koi entry nahi mili</td></tr>':''));
 $('sf-info').textContent=`${fl.length} entries (kul ${E.length})`}
function addShop(e){e.preventDefault();let name=$('s-v').value.trim();if(!name)return toast('Vendor ka naam bharein');
 const bill=parseFloat($('s-bill').value)||0,paid=parseFloat($('s-paid').value)||0;if(!bill&&!paid)return toast('Bill ya Paid amount bharein');
 const ch=state.shop.chips.find(c=>kv(c)===kv(name));
 if(ch)name=ch;else{const ex=state.shop.entries.find(x=>kv(x.vendor)===kv(name));if(ex)name=ex.vendor}
 const date=$('s-date').value||today();
 state.shop.entries.push({id:'s_'+Date.now(),vendor:name,bill,paid,date});
 $('s-v').value='';$('s-bill').value='';$('s-paid').value='';$('s-date').value='';$('s-date').type='text';
 save();renderShopAll();scrollShopEnd();toast('Entry saved • '+fmtDate(date))}
function delShop(id){if(pendDel!==id){pendDel=id;renderShopAll();return toast('Delete ke liye dubara "OK?" dabayein')}
 state.shop.entries=state.shop.entries.filter(x=>x.id!==id);pendDel=null;save();renderShopAll();toast('Entry deleted')}
function openShopEdit(id){const e=state.shop.entries.find(x=>x.id===id);if(!e)return;
 $('se-id').value=e.id;$('se-v').value=e.vendor;$('se-bill').value=e.bill||'';$('se-paid').value=e.paid||'';$('se-date').value=e.date||today();
 openModal('m-shopedit')}
function saveShopEdit(ev){ev.preventDefault();const e=state.shop.entries.find(x=>x.id===$('se-id').value);if(!e)return;
 e.vendor=$('se-v').value.trim()||e.vendor;e.bill=parseFloat($('se-bill').value)||0;e.paid=parseFloat($('se-paid').value)||0;e.date=$('se-date').value||today();
 save();closeModal('m-shopedit');renderShopAll();toast('Entry updated!')}
function openChipModal(){renderChips();openModal('m-chip')}
function renderChips(){$('chip-list').innerHTML=state.shop.chips.map((c,i)=>`<div class="rr"><b>${esc(c)}</b><button class="ml" style="background:none;color:#94a3b8" onclick="delChip(${i})">✕</button></div>`).join('')}
function addChip(e){e.preventDefault();const n=$('chip-name').value.trim();if(!n)return;if(!state.shop.chips.some(c=>kv(c)===kv(n)))state.shop.chips.push(n);$('chip-name').value='';save();renderChips();renderShopAll()}
function delChip(i){const k=kv(state.shop.chips[i]);state.shop.openOthers=(state.shop.openOthers||0)+(state.shop.open[k]||0);delete state.shop.open[k];shopV=null;state.shop.chips.splice(i,1);save();renderChips();renderShopAll()}

/* ---------- UDHAAR ---------- */
function udCalc(id){const run={};const rows=(state.accounts[id]||[]).filter(e=>e.name!==undefined).map(e=>{const k=kv(e.name);run[k]=Math.round(((run[k]||0)+Number(e.amount||0)-Number(e.paid||0))*100)/100;return{...e,k,net:run[k]}});return{rows,run}}
function udTotal(id){let t=0;Object.values(udCalc(id).run).forEach(v=>t+=v);return Math.round(t*100)/100}
function openUd(k){udId=k;cashKey=k;$('ud-q').value='';show('pg-ud');renderUd();udScrollEnd()}
function udScrollEnd(){const t=$('ud-st');if(t)setTimeout(()=>{t.scrollTop=t.scrollHeight},30)}
function udInput(){renderUd()}
function udRow(e,i){return `<tr class="${i%2?'':'o'}"><td class="sv">${esc(e.name)}</td><td class="ua">${e.amount||''}</td><td class="sv ud">${esc(e.desc)}</td><td class="up">${e.paid||''}</td><td class="sr ${e.net<0?'neg':''}">${e.net}</td><td class="sd">${fmtShort(e.at)}</td><td class="sd"><button class="ra" onclick="delUd('${e.id}')">${pendDel===e.id?'OK?':'✕'}</button></td></tr>`}
function renderUd(){
 const a=state.custom.find(x=>x.id===udId);if(!a)return;
 const{rows,run}=udCalc(udId);const udNm={};rows.forEach(r=>{if(!udNm[r.k])udNm[r.k]=r.name});
 let tot=0;Object.values(run).forEach(v=>tot+=v);tot=Math.round(tot*100)/100;
 $('ud-title').textContent=a.name;$('ud-tot').textContent='₹'+fn(tot);
 $('ud-nl').innerHTML=Object.values(udNm).map(n=>`<option value="${esc(n)}">`).join('');
 const q=kv($('ud-q').value);let list=rows,tr='',info=`Kul ${rows.length} entries • ${Object.keys(udNm).length} naam`;
 if(q){const mk=Object.keys(udNm).filter(k=>k.includes(q));list=rows.filter(r=>mk.includes(r.k));
  if(mk.length===1){const k=mk[0];let sa=0,sp=0;list.forEach(r=>{sa+=Number(r.amount||0);sp+=Number(r.paid||0)});
   info=`${udNm[k]} • ${list.length} entries • Baaki ₹${fn(run[k])}`;
   tr=`<tr class="tr2"><td class="sv">Kul</td><td>${rd2(sa)}</td><td></td><td>${rd2(sp)}</td><td class="${run[k]<0?'neg':''}">${run[k]}</td><td></td><td></td></tr>`}
  else info=`${mk.length} naam • ${list.length} entries`}
 $('ud-info').textContent=info;
 $('ud-body').innerHTML=(list.map(udRow).join('')||`<tr><td colspan="7" style="padding:18px;color:#64748b">${q?'Is naam ki koi entry nahi mili':'Abhi koi entry nahi.'}</td></tr>`)+tr}
function addUd(e){e.preventDefault();let name=$('ud-n').value.trim();if(!name)return toast('Naam bharein');
 const amount=parseFloat($('ud-a').value)||0,paid=parseFloat($('ud-p').value)||0;if(!amount&&!paid)return toast('Amount ya Paid bharein');
 const ex=(state.accounts[udId]||[]).find(x=>x.name!==undefined&&kv(x.name)===kv(name));if(ex)name=ex.name;
 state.accounts[udId].push({id:uid('u_'),name,amount,desc:$('ud-d').value.trim(),paid,at:today()});
 ['ud-n','ud-d','ud-a','ud-p'].forEach(i=>$(i).value='');
 save();renderUd();udScrollEnd();toast('Entry saved')}
function delUd(id){if(pendDel!==id){pendDel=id;renderUd();return toast('Delete ke liye dubara "OK?" dabayein')}
 state.accounts[udId]=state.accounts[udId].filter(x=>x.id!==id);pendDel=null;save();renderUd();toast('Entry deleted')}

/* ---------- SHEET + RATE SHEET ---------- */
const PERS_COLS=[{n:'Name',t:'text'},{n:'Amount Given',t:'num'},{n:'Description',t:'text'},{n:'Amount Received',t:'num'}];
const RATE_COLS=[{n:'Products',t:'text'},{n:'Net rate',t:'num'},{n:'Price',t:'num'},{n:'MRP',t:'num'},{n:'Rate',t:'num'},{n:'GST %',t:'num'},{n:'Qty.',t:'num'}];
const RATE_FORM=`<input id="sh-f0" class="ai" type="text" list="sh-nl" placeholder="Product" autocomplete="off" style="grid-column:span 3"/>
<input id="sh-f4" class="ai" type="number" step="0.01" placeholder="Qty" style="grid-column:span 1"/>
<input id="sh-f1" class="ai" type="number" step="0.01" placeholder="Rate ₹"/>
<input id="sh-f2" class="ai" type="number" step="0.01" placeholder="GST %"/>
<input id="sh-f3" class="ai" type="number" step="0.01" placeholder="MRP ₹"/>
<button class="adb" style="padding:8px">Add</button>`;

const cAcc=k=>state.custom.find(x=>x.id===k);
const fmtOf=k=>{if(k==='personal')return'personal';const a=cAcc(k);if(!a)return'';if(a.fmt==='rate'||((a.fmt==='sheet'||!a.fmt)&&/sunwin|rate/i.test(a.name||'')))return'rate';return a.fmt||((a.cat==='udhaar'||/udhaar|udhar|उधार/i.test(a.name))?'udhaar':'cash')};
const isUd=k=>fmtOf(k)==='udhaar';
const isSheet=k=>{const f=fmtOf(k);return f==='personal'||f==='sheet'||f==='rate'};
const colsOf=k=>{const f=fmtOf(k);return f==='personal'?PERS_COLS:f==='rate'?RATE_COLS:((cAcc(k)||{}).cols||[])};
const shRows=k=>{const r=(state.accounts[k]||[]).filter(e=>Array.isArray(e.v));return r};

function calcNetPrice(rate,gst,extra,mp){
 const g=gst==null||gst===''?5:Number(gst);
 const net=rd2(Number(rate||0)*(1+g/100));
 const price=rd2((net+Number(extra||0))*(1+Number(mp||0)/100));
 return{net,price,gst:g}}
function plItems(k){return shRows(k)}
function renderPl(){$('sh-pl').classList.add('hidden')}
function plToggle(){}

function accInfo(k){const f=fmtOf(k);
 if(f==='udhaar')return{l:'Total Baaki',v:inr(udTotal(k))};
 if(f==='rate')return{l:'Items',v:String(plItems(k).length)};
 if(f==='personal'||f==='sheet'){const cs=colsOf(k),R=shRows(k),ni=cs.map((c,i)=>c.t==='num'?i:-1).filter(i=>i>=0),sum=i=>R.reduce((s,e)=>s+Number(e.v[i]||0),0);
  if(f==='personal')return{l:'Total Baaki',v:inr(rd2(sum(1)-sum(3)))};
  if(ni.length)return{l:cs[ni[0]].n,v:inr(rd2(sum(ni[0])))};
  return{l:'Entries',v:String(R.length)}}
 return{l:'Balance',v:inr(Math.round(cashBal(k)*100)/100)}}

function fmtChange(){const v=$('ac-fmt').value==='sheet';$('ac-ds').classList.toggle('hidden',!v);if(v)renderDs()}
function renderDs(){$('ds-list').innerHTML=dsCols.map((c,i)=>`<div style="display:flex;gap:6px;margin-bottom:6px"><input class="li" style="flex:1" placeholder="Column ${i+1} ka naam" value="${esc(c.n)}" oninput="dsCols[${i}].n=this.value"/><select class="li" style="width:96px" onchange="dsCols[${i}].t=this.value"><option value="text"${c.t==='text'?' selected':''}>Text</option><option value="num"${c.t==='num'?' selected':''}>Number</option></select><button type="button" class="ml" style="background:none;color:#94a3b8" onclick="dsDel(${i})">✕</button></div>`).join('')}
function dsAdd(){dsCols.push({n:'',t:'text'});renderDs()}
function dsDel(i){if(dsCols.length>1){dsCols.splice(i,1);renderDs()}}
function shScrollEnd(){const t=$('sh-st');if(t)setTimeout(()=>{t.scrollTop=t.scrollHeight},30)}

function openSheet(k){shId=k;cashKey=k;$('sh-q').value='';plOpen=false;const cs=colsOf(k);
 if(fmtOf(k)==='rate'){
  $('sh-form').innerHTML=RATE_FORM;
  $('sh-form').style.gridTemplateColumns='repeat(4,1fr)';
 }else{
  $('sh-form').innerHTML=cs.map((c,i)=>`<input id="sh-f${i}" class="ai" ${c.t==='num'?'type="number" step="0.01"':'type="text"'} placeholder="${esc(c.n)}${c.t==='num'?' ₹':''}" autocomplete="off" style="grid-column:span 3" ${i===0&&c.t!=='num'?' list="sh-nl"':''}/>`).join('')+'<button class="adb" style="grid-column:span 6;padding:8px">Add</button>';
  $('sh-form').style.gridTemplateColumns='repeat(6,1fr)';
 }
 show('pg-sh');renderSheet();shScrollEnd()}

function renderSheet(){const k=shId,cs=colsOf(k);if(!cs.length)return;
 $('sh-title').textContent=accName(k);$('sh-tot').textContent=accInfo(k).v;
 const all=shRows(k),q=kv($('sh-q').value);
 const rows=q?all.filter(e=>cs.some((c,i)=>c.t!=='num'&&kv(String(e.v[i]||'')).includes(q))||fmtShort(e.at).includes(q)):all;
 const tbl=$('sh-st').querySelector('table'),isR=fmtOf(k)==='rate';$('pg-sh').classList.toggle('rate',isR);
 if(isR){
  const W=Math.max(320,$('sh-st').clientWidth-4);
  const px=[.34,.22,.22,.22,.18,.14,.14,.22,.20].map(x=>Math.round(x*W));
  $('sh-cg').innerHTML=px.map(w=>`<col style="width:${w}px">`).join('');
  tbl.style.width=px.reduce((a,b)=>a+b,0)+'px';
  $('sh-th').innerHTML='<tr><th>Products</th><th class="hn">Net rate</th><th class="hn">Price</th><th class="hn">MRP</th><th class="hn">Rate</th><th class="hn">GST %</th><th class="hn">Qty</th><th>Date</th><th></th></tr>';
 }else{
  tbl.style.width='';
  const wt=cs.map(c=>c.t==='num'?1.5:3).concat([1.7,0.8]),sm=wt.reduce((a,b)=>a+b,0);
  $('sh-cg').innerHTML=wt.map(w=>`<col style="width:${(w/sm*100).toFixed(1)}%">`).join('');
  $('sh-th').innerHTML='<tr>'+cs.map(c=>`<th class="${c.t==='num'?'hn':''}">${esc(c.n)}</th>`).join('')+'<th>Date</th><th></th></tr>';
 }
 $('sh-nl').innerHTML=[...new Set(all.map(e=>e.v[0]).filter(Boolean))].map(n=>`<option value="${esc(n)}">`).join('');
 $('sh-info').textContent=q?`${rows.length} entries mili (kul ${all.length})`:`Kul ${all.length} entries`;

 if(isR){
  $('sh-body').innerHTML=(rows.map((e,i)=>{
   const rate=Number(e.v[4]||0),gst=e.v[5]==null||e.v[5]===''?5:Number(e.v[5]);
   const {net,price}=calcNetPrice(rate,gst,state.rf.add,state.rf.mp);
   return `<tr class="${i%2?'':'o'}"><td class="sv">${esc(e.v[0])}</td><td>${net}</td><td>${price}</td><td>${e.v[3]||''}</td><td>${rate||''}</td><td>${gst}</td><td>${e.v[6]||''}</td><td class="sd">${fmtShort(e.at)}</td><td class="sd"><button class="ra" onclick="openRedit('${e.id}')">✎</button> <button class="ra" onclick="delSheet('${e.id}')">${pendDel===e.id?'OK?':'✕'}</button></td></tr>`
  }).join('')||`<tr><td colspan="9" style="padding:18px;color:#64748b">Abhi koi entry nahi.</td></tr>`);
 }else{
  const sums=cs.map((c,i)=>c.t==='num'?rd2(rows.reduce((s,e)=>s+Number(e.v[i]||0),0)):'');
  $('sh-body').innerHTML=(rows.map((e,i)=>`<tr class="${i%2?'':'o'}">`+cs.map((c,j)=>`<td class="${c.t==='num'?'':'sv'}">${c.t==='num'?(e.v[j]||''):esc(e.v[j])}</td>`).join('')+`<td class="sd">${fmtShort(e.at)}</td><td class="sd"><button class="ra" onclick="delSheet('${e.id}')">${pendDel===e.id?'OK?':'✕'}</button></td></tr>`).join('')||`<tr><td colspan="${cs.length+2}" style="padding:18px;color:#64748b">Abhi koi entry nahi.</td></tr>`)+(rows.length?'<tr class="tr2">'+cs.map((c,i)=>i===0?'<td class="sv">Kul</td>':`<td>${sums[i]}</td>`).join('')+'<td></td><td></td></tr>':'');
 }
}

function addSheet(e){e.preventDefault();if(fmtOf(shId)==='rate')return addRateEntry(e);const cs=colsOf(shId);
 const v=cs.map((c,i)=>c.t==='num'?(parseFloat($('sh-f'+i).value)||0):$('sh-f'+i).value.trim());
 if(!v.some(x=>x))return toast('Kuch to bharein');
 (state.accounts[shId]||(state.accounts[shId]=[])).push({id:uid('h_'),v,at:today()});
 cs.forEach((c,i)=>{$('sh-f'+i).value=''});save();renderSheet();shScrollEnd();toast('Entry saved')}
function addRateEntry(e){e.preventDefault();
 const name=$('sh-f0').value.trim();if(!name)return toast('Product ka naam bharein');
 const rate=parseFloat($('sh-f1').value);if(isNaN(rate)||rate<0)return toast('Sahi Rate bharein');
 let gstVal=$('sh-f2').value.trim();
 const gst=gstVal===''?5:parseFloat(gstVal);if(isNaN(gst))return toast('GST number me daalein');
 const mrp=parseFloat($('sh-f3').value)||0;
 const qty=parseFloat($('sh-f4').value)||0;
 const {net,price}=calcNetPrice(rate,gst,state.rf.add,state.rf.mp);
 const v=[name,net,price,mrp,rate,gst,qty];
 (state.accounts[shId]||(state.accounts[shId]=[])).push({id:uid('h_'),v,at:today()});
 ['sh-f0','sh-f1','sh-f2','sh-f3','sh-f4'].forEach(i=>$(i).value='');
 save();renderSheet();shScrollEnd();toast('Entry saved • GST '+(gst)+'% • Net '+net+' • Price '+price)}
function delSheet(id){if(pendDel!==id){pendDel=id;renderSheet();return toast('Delete ke liye dubara "OK?" dabayein')}
 state.accounts[shId]=state.accounts[shId].filter(x=>x.id!==id);pendDel=null;save();renderSheet();toast('Entry deleted')}
function openRedit(id){const e=(state.accounts[shId]||[]).find(x=>x.id===id);if(!e)return;
 $('re-id').value=id;$('re-p').value=e.v[0]||'';$('re-r').value=e.v[4]||'';$('re-g').value=e.v[5]==null||e.v[5]===''?5:e.v[5];$('re-m').value=e.v[3]||'';$('re-q').value=e.v[6]||'';$('re-d').value=e.at||today();
 openModal('m-redit')}
function saveRedit(e){e.preventDefault();const row=(state.accounts[shId]||[]).find(x=>x.id===$('re-id').value);if(!row)return;
 const name=$('re-p').value.trim(),rate=parseFloat($('re-r').value),gst=parseFloat($('re-g').value)||5,mrp=parseFloat($('re-m').value)||0,qty=parseFloat($('re-q').value)||0;
 if(!name||isNaN(rate))return toast('Product aur Rate zaroori hain');
 const {net,price}=calcNetPrice(rate,gst,state.rf.add,state.rf.mp);
 row.v=[name,net,price,mrp,rate,gst,qty];row.at=$('re-d').value||today();
 save();closeModal('m-redit');renderSheet();toast('Updated')}
function saveRf(e){e.preventDefault();state.rf.add=parseFloat($('rf-add').value)||3;state.rf.mp=parseFloat($('rf-mp').value)||20;save();closeModal('m-rf');if(shId&&fmtOf(shId)==='rate')renderSheet();toast('Formula saved')}

function setBanH(){const b=document.querySelector('.pg:not(.hidden) .ban');if(b)document.documentElement.style.setProperty('--ban-h',b.offsetHeight+'px')}

/* ---------- CLINIC ---------- */
const isClinic=v=>v.fmt==='clinic'||/rehman|रहमान/i.test(v.name||'');
const cv=()=>state.vendors.find(x=>x.id===activeV);
function clinicPeriod(v){const t=today(),y=t.slice(0,4),m=t.slice(5,7),last=new Date(+y,+m,0).getDate();
 return{from:v.from||(y+'-'+m+'-01'),to:v.to||(y+'-'+m+'-'+String(last).padStart(2,'0'))}}
function clinicCalc(v){const P=clinicPeriod(v),pct=v.pct==null?30:Number(v.pct);
 const mv=(v.moves||[]).map((e,i)=>({...e,_o:i})).sort((a,b)=>a.date===b.date?a._o-b._o:a.date.localeCompare(b.date));
 const rows=(v.products||[]).map(p=>{let add=0,mi=0,last=0,rem=0;
  mv.forEach(e=>{if(e.pid!==p.id)return;
   if(e.date<=P.to){if(e.last!=null)last=Number(e.last);if(e.rem!=null)rem=Number(e.rem)}
   if(e.date>=P.from&&e.date<=P.to){add+=Number(e.add||0);mi+=Number(e.minus||0)}});
  const net=rd2(last+add-mi-rem),total=rd2(net*Number(p.mrp||0)),na=rd2(total*pct/100);
  return{p,add,mi,last,rem,net,total,na}});
 return{P,pct,rows,total:rd2(rows.reduce((s,r)=>s+r.na,0))}}
function renderClinic(){const v=cv();if(!v)return;const C=clinicCalc(v);
 $('cl-nt').textContent=v.name;$('cl-name').textContent=v.name;$('cl-tot').textContent='₹'+fn(Math.round(C.total));
 $('cl-per').textContent=fmtDate(C.P.from)+' se '+fmtDate(C.P.to);
 $('cl-th5').innerHTML='Net Amount<br>('+C.pct+'% of MRP)';
 $('cl-pl').innerHTML=(v.products||[]).map(p=>`<option value="${esc(p.name)}">`).join('');
 let sn=0,st=0,sa=0;C.rows.forEach(r=>{sn+=r.net;st+=r.total;sa+=r.na});
 $('cl-body').innerHTML=(C.rows.map((r,i)=>`<tr class="${i%2?'g':''}"><td class="pn"><div class="pnw"><span class="pnb"><button class="clib e" onclick="editProd('${r.p.id}')">✎</button><button class="clib d" onclick="delProd('${r.p.id}')">${pendDel===r.p.id?'OK?':'✕'}</button></span><span>${esc(r.p.name)}</span></div></td><td class="${r.net<0?'neg':''}">${r.net}</td><td>${r.p.mrp}</td><td>${r.total}</td><td>${r.na}</td></tr>`).join('')||'<tr><td colspan="5" style="padding:18px;color:#64748b">Abhi koi product nahi.</td></tr>')
  +(C.rows.length?`<tr class="tt"><td class="pn">Total</td><td>${rd2(sn)}</td><td></td><td>${rd2(st)}</td><td>${rd2(sa)}</td></tr>`:'')}
function clHint(){const v=cv(),n=kv($('cl-p').value);const r=n?clinicCalc(v).rows.find(x=>kv(x.p.name)===n):null;
 $('cl-m').placeholder=r?String(r.p.mrp):'MRP/tab';$('cl-l').placeholder=r?String(r.last):'Last';$('cl-r').placeholder=r?String(r.rem):'Remain'}
function addClinic(e){e.preventDefault();const v=cv();if(!v)return;const name=$('cl-p').value.trim();if(!name)return toast('Product ka naam bharein');
 const g=id=>{const n=parseFloat($(id).value);return isNaN(n)?null:n};
 const mrp=g('cl-m'),add=g('cl-a'),mi=g('cl-n'),last=g('cl-l'),rem=g('cl-r');
 if(!v.products)v.products=[];if(!v.moves)v.moves=[];
 let p=v.products.find(x=>kv(x.name)===kv(name));
 if(!p){if(mrp==null)return toast('Naya product hai — MRP/tab bharein');p={id:uid('p_'),name,mrp};v.products.push(p)}else if(mrp!=null)p.mrp=mrp;
 const date=$('cl-d').value||today();
 if(add!=null||mi!=null||last!=null||rem!=null)v.moves.push({id:uid('m_'),pid:p.id,add,minus:mi,last,rem,date});
 ['cl-p','cl-m','cl-a','cl-n','cl-l','cl-r','cl-d'].forEach(i=>{$(i).value=''});$('cl-d').type='text';clHint();
 save();renderClinic();toast('Entry saved')}
function delProd(id){if(pendDel!==id){pendDel=id;renderClinic();return toast('Delete ke liye dubara "OK?" dabayein')}
 const v=cv();v.products=(v.products||[]).filter(p=>p.id!==id);v.moves=(v.moves||[]).filter(m=>m.pid!==id);pendDel=null;save();renderClinic();toast('Product deleted')}
function editProd(id){const v=cv(),p=(v.products||[]).find(x=>x.id===id);if(!p)return;toast('Product edit: name/MRP change via re-add for now')}
function openCper(){const v=cv();if(!v)return;const P=clinicPeriod(v);$('cp-from').value=P.from;$('cp-to').value=P.to;$('cp-pct').value=v.pct==null?30:v.pct;openModal('m-cper')}
function saveCper(e){e.preventDefault();const v=cv();if(!v)return;v.from=$('cp-from').value;v.to=$('cp-to').value;v.pct=parseFloat($('cp-pct').value)||30;save();closeModal('m-cper');renderClinic();toast('Period saved')}
function resetCper(){const v=cv();if(!v)return;delete v.from;delete v.to;save();closeModal('m-cper');renderClinic()}
function openClog(){toast('Entries log — period filter available in full version')}
function clImg(){toast('Image share — use browser print for now')}

/* ---------- IMPORT ---------- */
function openImport(mode){impMode=mode;let help='';
 if(mode==='sheet'&&shId&&fmtOf(shId)==='rate'){
  help='<b>Rate sheet Import</b><br>Sirf 4 columns copy karein (header ke bina):<br><b>Product | Qty | MRP | Rate</b><br>GST auto 5% lagega. Date aaj ki lagegi.';
 }else if(mode==='ud'){help='Name | Amount | Description | Paid (tab separated)'}
 else if(mode==='shop'){help='Vendor | Bill | Paid | Date'}
 else help='Excel cells copy-paste karein (tab / comma separated)';
 $('imp-help').innerHTML=help;$('imp-text').value='';openModal('m-imp')}
function impFile(ev){const f=ev.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('imp-text').value=r.result};r.readAsText(f)}
function runImport(){
 const txt=$('imp-text').value.trim();if(!txt)return toast('Kuch paste karein');
 const lines=txt.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
 let n=0;
 if(impMode==='sheet'&&shId&&fmtOf(shId)==='rate'){
  lines.forEach(line=>{
   const p=line.split(/[\t,]/).map(s=>s.trim());
   if(p.length<3)return;
   let name=p[0],qty=0,mrp=0,rate=0;
   if(p.length>=4){qty=parseFloat(p[1])||0;mrp=parseFloat(p[2])||0;rate=parseFloat(p[3])||0}
   else{rate=parseFloat(p[1])||0;mrp=parseFloat(p[2])||0}
   if(!name||isNaN(rate))return;
   const {net,price}=calcNetPrice(rate,5,state.rf.add,state.rf.mp);
   (state.accounts[shId]||(state.accounts[shId]=[])).push({id:uid('h_'),v:[name,net,price,mrp,rate,5,qty],at:today()});
   n++;
  });
  save();closeModal('m-imp');renderSheet();shScrollEnd();toast(n+' rows import ho gayi (GST 5%)');
  return;
 }
 if(impMode==='ud'&&udId){
  lines.forEach(line=>{
   const p=line.split(/[\t,]/).map(s=>s.trim());
   if(p.length<2)return;
   const name=p[0],amount=parseFloat(p[1])||0,desc=p[2]||'',paid=parseFloat(p[3])||0;
   if(!name)return;
   state.accounts[udId].push({id:uid('u_'),name,amount,desc,paid,at:today()});n++;
  });
  save();closeModal('m-imp');renderUd();toast(n+' rows import');
  return;
 }
 if(impMode==='shop'){
  lines.forEach(line=>{
   const p=line.split(/[\t,]/).map(s=>s.trim());
   if(p.length<2)return;
   const vendor=p[0],bill=parseFloat(p[1])||0,paid=parseFloat(p[2])||0,date=p[3]&&p[3].includes('-')?p[3]:today();
   if(!vendor)return;
   state.shop.entries.push({id:'s_'+Date.now()+n,vendor,bill,paid,date});n++;
  });
  save();closeModal('m-imp');renderShopAll();toast(n+' shop rows import');
  return;
 }
 toast('Is mode ke liye import abhi limited hai');closeModal('m-imp')}

/* ---------- BACKUP / THEME / RESET ---------- */
function dlBackup(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ledger_backup_'+today()+'.json';a.click();toast('Backup downloaded')}
function copyBackup(){navigator.clipboard.writeText(JSON.stringify(state)).then(()=>toast('Backup text copied')).catch(()=>toast('Copy fail'))}
function restoreFile(ev){const f=ev.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=normShop(JSON.parse(r.result));save();renderHome();closeModal('m-backup');toast('Restored!')}catch(e){toast('Invalid JSON')}};r.readAsText(f)}
function restoreText(){try{state=normShop(JSON.parse($('rs-text').value));save();renderHome();closeModal('m-backup');toast('Restored!')}catch(e){toast('Invalid JSON')}}
function toggleTheme(){document.body.classList.toggle('dk');toast(document.body.classList.contains('dk')?'Dark':'Light')}
function resetDemo(){if(!confirm('Sample data se reset?'))return;localStorage.removeItem(KEY);state=load();renderHome();closeModal('m-backup');toast('Reset done')}

/* ---------- BOOT ---------- */
document.getElementById('boot').style.display='none';
renderHome();
