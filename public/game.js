let ws, myId=null, gameState=null, cellPositions=[], selectedMaxPlayers=2;
const DICE_FACES=['⚀','⚁','⚂','⚃','⚄','⚅'];

function selectCount(n){
  selectedMaxPlayers=n;
  document.querySelectorAll('.count-btn').forEach(b=>{
    b.classList.toggle('active',parseInt(b.dataset.count)===n);
  });
}

function connectWS(){
  const proto=location.protocol==='https:'?'wss:':'ws:';
  ws=new WebSocket(`${proto}//${location.host}`);
  ws.onopen=()=>console.log('Connected');
  ws.onmessage=e=>handleMessage(JSON.parse(e.data));
  ws.onclose=()=>{console.log('Disconnected');setTimeout(connectWS,3000)};
  ws.onerror=e=>console.error('WS error',e);
}

function send(obj){if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj))}

function handleMessage(msg){
  switch(msg.type){
    case 'roomCreated':
      myId=msg.playerId;gameState=msg.state;
      document.getElementById('waitingMessage').style.display='block';
      document.getElementById('displayRoomCode').textContent=msg.roomId;
      document.getElementById('waitingCount').textContent=`(${gameState.players.length}/${gameState.maxPlayers})`;
      document.getElementById('btnCreate').style.display='none';
      document.querySelector('.join-section').style.display='none';
      document.querySelector('.player-count-select').style.display='none';
      document.querySelector('.player-count-label').style.display='none';
      break;
    case 'roomJoined':
      myId=msg.playerId;gameState=msg.state;
      if(gameState.started) showGameScreen();
      else{
        document.getElementById('lobby').querySelector('.lobby-form').innerHTML=
          `<div class="waiting-msg"><div class="spinner"></div><p>Ожидание... (${gameState.players.length}/${gameState.maxPlayers})</p></div>`;
      }
      break;
    case 'playerJoined':
      gameState=msg.state;
      const wc=document.getElementById('waitingCount');
      if(wc) wc.textContent=`(${gameState.players.length}/${gameState.maxPlayers})`;
      if(gameState.players.length>=2&&gameState.players[0]?.id===myId)
        document.getElementById('btnStartEarly').style.display='block';
      break;
    case 'gameStarted':
      gameState=msg.state; showGameScreen(); break;
    case 'turnResult':
      gameState=msg.state; processEvents(msg.events); updateUI(); break;
    case 'error':
      showToast(msg.text); break;
    case 'playerDisconnected':
      showToast(msg.text); break;
  }
}

function createRoom(){
  const name=document.getElementById('playerName').value.trim()||'Игрок';
  send({type:'createRoom',name,maxPlayers:selectedMaxPlayers});
}
function joinRoom(){
  const name=document.getElementById('playerName').value.trim()||'Игрок';
  const code=document.getElementById('roomCode').value.trim();
  if(!code){showToast('Введите код');return}
  send({type:'joinRoom',name,roomId:code});
}
function startEarly(){send({type:'startEarly'})}
function copyRoomCode(){
  navigator.clipboard.writeText(document.getElementById('displayRoomCode').textContent)
    .then(()=>showToast('Скопировано!'));
}

/* ===== TABS ===== */
function switchTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.getElementById('panelInfo').classList.toggle('tab-active',tab==='info');
  document.getElementById('panelBoard').classList.toggle('tab-active',tab==='board');
  document.getElementById('panelLog').classList.toggle('tab-active',tab==='log');
  if(tab==='board') setTimeout(scaleBoard,50);
}

/* ===== GAME SCREEN ===== */
function showGameScreen(){
  document.getElementById('lobby').classList.remove('active');
  const gs=document.getElementById('gameScreen');
  gs.classList.add('active');gs.style.display='flex';gs.style.flexDirection='column';
  cellPositions=createBoard(gameState.board);
  switchTab('board');
  document.getElementById('panelInfo').classList.add('tab-active');
  document.getElementById('panelLog').classList.add('tab-active');
  scaleBoard();
  window.addEventListener('resize',scaleBoard);
  updateUI();
}

function scaleBoard(){
  const c=document.getElementById('boardContainer');
  const b=document.querySelector('.board');
  if(!c||!b) return;
  const cw=c.clientWidth-12,ch=c.clientHeight-12;
  const scale=Math.min(cw/880,ch/880,1.2);
  b.style.transform=`scale(${scale})`;
}

/* ===== UPDATE UI ===== */
function updateUI(){
  if(!gameState) return;

  // Players
  const pc=document.getElementById('playersContainer');
  pc.innerHTML='';
  gameState.players.forEach((p,i)=>{
    const div=document.createElement('div');
    div.className='player-info'+(gameState.currentPlayerIndex===i?' active-player':'')+(p.bankrupt?' bankrupt':'');
    const isMe=p.id===myId;
    div.innerHTML=`
      <div class="player-header">
        <span class="player-token">${p.token}</span>
        <span class="player-name" style="color:${p.color}">${p.name}</span>
        ${isMe?'<span class="player-you" style="background:#2980b9">ВЫ</span>':''}
        ${p.bankrupt?'<span class="player-you" style="background:#c0392b">💀</span>':''}
        ${p.inJail?'<span class="player-you" style="background:#e67e22">🔒</span>':''}
      </div>
      <div class="player-money" style="color:${p.money<0?'#e74c3c':'#2ecc71'}">$${p.money}</div>
      <div class="player-properties" id="pp-${i}"></div>
    `;
    pc.appendChild(div);
    const propsEl=document.getElementById(`pp-${i}`);
    p.properties.forEach(pid=>{
      const cell=gameState.board[pid];
      const dot=document.createElement('span');
      dot.className='prop-dot';
      dot.style.background=COLOR_MAP[cell.color]||COLOR_MAP[cell.type]||'#999';
      dot.setAttribute('data-name',cell.name);
      const h=p.houses[pid]||0;
      if(h>0) dot.textContent=h===5?'H':h;
      propsEl.appendChild(dot);
    });
  });

  // Current player / turn
  const cur=gameState.players[gameState.currentPlayerIndex];
  const isMyTurn=cur&&cur.id===myId&&!cur.bankrupt;
  const ti=document.getElementById('turnInfo');

  if(gameState.gameOver){
    ti.textContent='Игра окончена!';
    if(gameState.winner){
      document.getElementById('winnerText').textContent=`${gameState.winner.name} победил!`;
      document.getElementById('winModal').style.display='flex';
    }
  }else if(cur){
    ti.textContent=`${cur.token} ${cur.name} ${isMyTurn?'— ваш ход!':'ходит...'}`;
  }

  // === Desktop buttons ===
  const btnR=document.getElementById('btnRoll');
  const btnB=document.getElementById('btnBuy');
  const btnP=document.getElementById('btnPass');
  const btnF=document.getElementById('btnPayFine');
  const btnU=document.getElementById('btnForceUnlock');
  btnR.style.display=btnB.style.display=btnP.style.display=btnF.style.display=btnU.style.display='none';

  if(isMyTurn&&!gameState.gameOver){
    if(gameState.awaitingAction&&gameState.awaitingAction.type==='buy_or_pass'){
      const cell=gameState.board[gameState.awaitingAction.cellId];
      btnB.style.display='block';
      btnB.textContent=`💰 Купить "${cell.name}" — $${cell.price}`;
      btnP.style.display='block';
    } else if(gameState.turnPhase==='roll'){
      btnR.style.display='block';
      if(cur.inJail){
        btnR.textContent='🎲 Бросить (выход из тюрьмы)';
        if(cur.money>=50) btnF.style.display='block';
      }else{
        btnR.textContent='🎲 Бросить кубики';
      }
    } else {
      // Фаза done или action но нет awaitingAction — значит зависло
      btnU.style.display='block';
    }
  }

  // === Mobile action bar ===
  updateMobileBar(isMyTurn, cur);

  // Dice
  updateDice(gameState.lastDice);

  // Board visuals
  updateTokens();
  updateOwners();
  updateHouses();
  updateBuild();
}

function updateMobileBar(isMyTurn, cur){
  const bar=document.getElementById('mobileActionBar');
  const btns=document.getElementById('mobileButtons');
  const md1=document.getElementById('mdice1');
  const md2=document.getElementById('mdice2');

  md1.textContent=DICE_FACES[(gameState.lastDice[0]||1)-1];
  md2.textContent=DICE_FACES[(gameState.lastDice[1]||1)-1];

  btns.innerHTML='';

  if(!isMyTurn||gameState.gameOver){
    const info=document.createElement('div');
    info.className='mobile-turn-info';
    info.textContent=cur? `${cur.token} ${cur.name} ходит...`:'Ожидание...';
    btns.appendChild(info);
    return;
  }

  if(gameState.awaitingAction&&gameState.awaitingAction.type==='buy_or_pass'){
    const cell=gameState.board[gameState.awaitingAction.cellId];
    const b1=document.createElement('button');
    b1.className='btn btn-buy';
    b1.textContent=`💰 Купить $${cell.price}`;
    b1.onclick=buyProperty;
    btns.appendChild(b1);
    const b2=document.createElement('button');
    b2.className='btn btn-pass';
    b2.textContent='❌ Нет';
    b2.onclick=passProperty;
    btns.appendChild(b2);
  } else if(gameState.turnPhase==='roll'){
    const b=document.createElement('button');
    b.className='btn btn-roll';
    if(cur.inJail){
      b.textContent='🎲 Бросить (тюрьма)';
    }else{
      b.textContent='🎲 БРОСИТЬ КУБИКИ';
    }
    b.onclick=rollDice;
    btns.appendChild(b);

    if(cur.inJail&&cur.money>=50){
      const bf=document.createElement('button');
      bf.className='btn btn-fine';
      bf.textContent='💸 50$ выход';
      bf.onclick=payJailFine;
      btns.appendChild(bf);
    }
  } else {
    // Зависло — кнопка разблокировки
    const bu=document.createElement('button');
    bu.className='btn btn-unlock';
    bu.textContent='🔓 Пропустить ход';
    bu.onclick=forceUnlock;
    btns.appendChild(bu);
  }
}

function updateDice(v){
  document.getElementById('dice1').textContent=DICE_FACES[(v[0]||1)-1];
  document.getElementById('dice2').textContent=DICE_FACES[(v[1]||1)-1];
  document.getElementById('mdice1').textContent=DICE_FACES[(v[0]||1)-1];
  document.getElementById('mdice2').textContent=DICE_FACES[(v[1]||1)-1];
}

function animateDice(cb){
  const els=[
    document.getElementById('dice1'),document.getElementById('dice2'),
    document.getElementById('mdice1'),document.getElementById('mdice2')
  ];
  els.forEach(e=>{if(e)e.classList&&e.classList.add('rolling')});
  let c=0;
  const iv=setInterval(()=>{
    const r1=DICE_FACES[Math.floor(Math.random()*6)];
    const r2=DICE_FACES[Math.floor(Math.random()*6)];
    els[0]&&(els[0].textContent=r1);
    els[1]&&(els[1].textContent=r2);
    els[2]&&(els[2].textContent=r1);
    els[3]&&(els[3].textContent=r2);
    if(++c>10){
      clearInterval(iv);
      els.forEach(e=>{if(e&&e.classList)e.classList.remove('rolling')});
      cb&&cb();
    }
  },60);
}

function updateTokens(){
  document.querySelectorAll('.token').forEach(e=>e.remove());
  const board=document.getElementById('board');
  const active=gameState.players.filter(p=>!p.bankrupt);
  active.forEach((p,i)=>{
    const center=getCellCenter(cellPositions,p.position);
    const off=getTokenOffset(i,active.length);
    const t=document.createElement('div');
    t.className='token';t.textContent=p.token;
    t.style.left=(center.x+off.x-11)+'px';
    t.style.top=(center.y+off.y-11)+'px';
    board.appendChild(t);
  });
}

function updateOwners(){
  document.querySelectorAll('.owner-marker').forEach(e=>e.remove());
  const board=document.getElementById('board');
  gameState.players.forEach(p=>{
    if(p.bankrupt)return;
    p.properties.forEach(pid=>{
      const pos=cellPositions[pid];if(!pos)return;
      const m=document.createElement('div');
      m.className='owner-marker';m.style.background=p.color;
      if(pos.side==='bottom'){m.style.left=(pos.x+pos.w-14)+'px';m.style.top=(pos.y+pos.h-14)+'px'}
      else if(pos.side==='top'){m.style.left=(pos.x+4)+'px';m.style.top=(pos.y+4)+'px'}
      else if(pos.side==='left'){m.style.left=(pos.x+4)+'px';m.style.top=(pos.y+pos.h-14)+'px'}
      else if(pos.side==='right'){m.style.left=(pos.x+pos.w-14)+'px';m.style.top=(pos.y+4)+'px'}
      board.appendChild(m);
    });
  });
}

function updateHouses(){
  document.querySelectorAll('.house-indicator').forEach(e=>e.remove());
  const board=document.getElementById('board');
  gameState.players.forEach(p=>{
    Object.entries(p.houses).forEach(([pid,cnt])=>{
      if(cnt<=0)return;
      const pos=cellPositions[pid];if(!pos)return;
      const ind=document.createElement('div');
      ind.className='house-indicator';
      ind.innerHTML=cnt===5?'🏨':'🏠'.repeat(cnt);
      if(pos.side==='bottom'){ind.style.left=(pos.x+3)+'px';ind.style.top=(pos.y+2)+'px'}
      else if(pos.side==='top'){ind.style.left=(pos.x+3)+'px';ind.style.top=(pos.y+pos.h-16)+'px'}
      else if(pos.side==='left'){ind.style.left=(pos.x+pos.w-18)+'px';ind.style.top=(pos.y+2)+'px'}
      else if(pos.side==='right'){ind.style.left=(pos.x+2)+'px';ind.style.top=(pos.y+2)+'px'}
      board.appendChild(ind);
    });
  });
}

function updateBuild(){
  const section=document.getElementById('buildSection');
  const container=document.getElementById('buildableProperties');
  const me=gameState.players.find(p=>p.id===myId);
  if(!me||gameState.gameOver||me.bankrupt){section.style.display='none';return}
  const buildable=[];
  const groups=gameState.propertyGroups;
  for(const[color,gids]of Object.entries(groups)){
    if(color==='railroad'||color==='utility')continue;
    if(!gids.every(id=>me.properties.includes(id)))continue;
    gids.forEach(id=>{
      const cell=gameState.board[id];
      const h=me.houses[id]||0;
      if(h>=5||me.money<cell.houseCost)return;
      const minH=Math.min(...gids.map(g=>me.houses[g]||0));
      if(h<=minH) buildable.push({id,cell,houses:h,cost:cell.houseCost,color});
    });
  }
  if(!buildable.length){section.style.display='none';return}
  section.style.display='block';
  container.innerHTML='';
  buildable.forEach(item=>{
    const b=document.createElement('button');
    b.className='build-btn';
    const lbl=item.houses===4?'Отель':`Дом ${item.houses+1}`;
    b.innerHTML=`<span><span class="cb" style="background:${COLOR_MAP[item.color]}"></span>${item.cell.name}</span><span>${lbl} ($${item.cost})</span>`;
    b.onclick=()=>buildHouse(item.id);
    container.appendChild(b);
  });
}

function processEvents(events){
  events.forEach(ev=>{
    let cls='log-entry';
    switch(ev.type){
      case 'dice':animateDice(()=>updateDice(gameState.lastDice));
        addLog(`🎲 ${ev.player}: ${ev.values[0]}+${ev.values[1]}=${ev.values[0]+ev.values[1]}`,cls);break;
      case 'message':addLog(ev.text,cls);break;
      case 'offer':addLog(`🏠 ${ev.text}`,cls);break;
      case 'rent':addLog(`💸 ${ev.text}`,cls+' rent-event');break;
      case 'buy':addLog(`✅ ${ev.text}`,cls+' buy-event');break;
      case 'card':addLog(`🃏 ${ev.text}`,cls+' card-event');break;
      case 'build':addLog(`🏗 ${ev.text}`,cls+' buy-event');break;
    }
  });
}

function addLog(text,cls){
  const log=document.getElementById('eventLog');
  const e=document.createElement('div');
  e.className=cls||'log-entry';
  e.textContent=text;
  log.insertBefore(e,log.firstChild);
  while(log.children.length>80) log.removeChild(log.lastChild);
}

/* ===== ACTIONS ===== */
function rollDice(){send({type:'rollDice'})}
function buyProperty(){if(gameState.awaitingAction)send({type:'buyProperty',cellId:gameState.awaitingAction.cellId})}
function passProperty(){send({type:'passProperty'})}
function buildHouse(cellId){send({type:'buyHouse',cellId})}
function payJailFine(){send({type:'payJailFine'})}
function forceUnlock(){send({type:'forceUnlock'})}
function surrender(){if(confirm('Точно сдаться?'))send({type:'surrender'})}

/* ===== HELPERS ===== */
function showModal(title,text){
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalText').textContent=text;
  document.getElementById('modal').style.display='flex';
}
function closeModal(){document.getElementById('modal').style.display='none'}
let toastTO;
function showToast(text){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}
  t.textContent=text;t.style.opacity='1';t.style.display='block';
  clearTimeout(toastTO);
  toastTO=setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.style.display='none',300)},3000);
}

connectWS();
