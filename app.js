'use strict';
// ───────── 배경 그림
const BG = { p0: 's_alley', p1: 's_alley', '1-1a': 'ch1_arrest', '1-1b': 'ch1_arrest', '1-1c': 'ch1_arrest', '1-1d': 'ch1_arrest',
  '1-2a': 's_interro', '1-2b': 's_interro', '1-3i': 's_interro', '1-3q0': 's_interro', '1-3q1': 's_interro', '1-3q2': 's_interro', '1-3q3': 's_interro', '1-3q4': 's_interro', '1-3r': 's_interro',
  '1-4a': 's_hearing', '1-4b': 's_hearing', '1-5a': 's_hearing', '1-5': 's_hearing', '1-5x': 's_hearing', g1: 's_interro',
  '2-0': 's_alley', '2-1a': 's_board', '2-1b': 's_board', '2-1c': 's_board', '2-1d': 's_board', '2-2a': 'ch2_evidence', '2-2': 'ch2_evidence', '2-2w': 'ch2_evidence', '2-3': 's_board', '2-3r': 'ch2_evidence', '2-3x': 's_board', '2-4': 's_board', '2-4n': 's_shop', g2: 's_board',
  c3: 's_pros', '3-0': 's_pros', '3-1a': 's_pros', '3-1b': 's_pros', '3-2': 's_pros', '3-2a': 's_pros', '3-2b': 's_pros', '3-3': 's_pros', '3-4': 's_pros', night: 's_alley', e1: 's_court', g3: 's_pros',
  '4-1i': 'ch4_court', '4-1a': 'ch4_court', '4-1b': 'ch4_statue', '4-1c': 's_judge', '4-2a': 's_judge', '4-2': 's_judge', '4-2x': 's_judge', '4-3a': 's_court', '4-3b': 's_court', '4-4a': 's_court', '4-4b': 's_court', '4-4': 's_court', '4-4x': 's_court', '4-4c': 's_judge', '4-4d': 's_witness', '4-4e': 's_court', '4-5': 's_court', '4-6': 's_judge', '4-6s': 's_judge', g4: 's_court',
  '5-1a': 'ch4_court', '5-1b': 'ch4_court', '5-1A': 'ch4_court', '5-1Aq': 'ch4_court', '5-1Ax': 'ch4_court', '5-1Bi': 's_judge', '5-1B': 's_judge', '5-1Bc': 's_judge', '5-2a': 'ch5_dna', '5-2b': 'ch5_dna', '5-2c': 'ch5_dna', '5-2x': 'ch5_dna',
  '5-3i': 's_judge', '5-3a': 's_judge', '5-3b': 's_judge', '5-3c': 's_judge', '5-3d': 's_judge', '5-3e': 's_judge', '5-3f': 's_judge', '5-4i': 's_shop', '5-4': 's_shop', '5-5': 's_dawn', '5-5b': 's_dawn', epi: 's_shop', end: 's_dawn' };
const CHBG = { 0: 's_alley', 1: 'ch1_arrest', 2: 's_board', 3: 's_pros', 4: 's_court', 5: 's_dawn' };
const CHNAME = { 0: '프롤로그', 1: '1장 · 윤재', 2: '2장 · 강민호 경위', 3: '3장 · 서지우 검사', 4: '4장 · 이도현 판사', 5: '5장 · 그 후' };
const ROLE = { yj: '이 사건의 피의자 · 한 달 전까지 분식집 아르바이트생', hs: '분식집 사장 · 이 사건의 피해자', km: '○○경찰서 강력팀 · 사법경찰관', sj: '공소청 검사 · 기소 여부를 정한다', dh: '지방 법원 합의부 재판장',
  kh: '윤재의 변호인', ms: '편의점 직원 · 목격자', ot: '다른 폭행 사건의 피의자', tl: '강민호의 상관', wj: '구속 여부를 정하는 판사', ju: '국민 참여 재판에 뽑힌 시민' };
const TEACH = { g1: '하나', g2: '둘', g3: '셋', g4: '넷' };
const img = n => 'img/' + n + '.webp';
const bgOf = st => img(BG[st.id] || CHBG[st.ch ?? 0]);
const IDX = Object.fromEntries(STEPS.map((s, i) => [s.id, i]));
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];
const val = (x, s) => typeof x === 'function' ? x(s) : x;
const mix = (n, k) => Array.from({ length: n }, (_, i) => i).sort((a, b) => ((a * 7 + k) % 11) - ((b * 7 + k) % 11));

// ───────── 상태
function fresh() {
  return { log: [], dp: [], pos: 0, held: false, everHeld: false, released: false, days: 0, lawyer: false, alibi: false, right: false, conf: false, fat: 10, used: { silent: 0, lawyerReq: 0 }, answers: [],
    phone: null, tokens: 4, ev: { cctv: false, wit: false, dna: false }, send: null, pexcl: false, extra: false, extraList: [], indicted: false, adm: {}, stampErr: [],
    v1: null, s1: null, s1o: null, s2: null, err: [], appeal: null, demand: null, real: null, heldAtTrial: false, tsv: false, bail: null, indep: null, say: null };
}
const freshMeta = () => ({ motion: null, dex: {}, missions: {}, gates: {}, wrong: 0, quiz: false, tickets: 2, lock: false, teacher: false, seen: {}, read: {} });
let S = fresh(), META = freshMeta(), MIS = null;
const DECISION = new Set(['choice', 'pick2', 'interro', 'tokens', 'evidence', 'syllogism', 'sentence']);
function radix(st, s) {
  switch (st.type) {
    case 'choice': return st.opts.length;
    case 'pick2': return 6; case 'interro': return 3; case 'tokens': return 8; case 'syllogism': return 2;
    case 'evidence': return 2 ** evidenceCards(s).length;
    case 'sentence': return SEN.R;
  }
}
function apply(st, s, v) {
  switch (st.type) {
    case 'choice': case 'pick2': st.apply(s, v); break;
    case 'interro': applyInterro(s, st.qi, v); break;
    case 'tokens': { const want = { cctv: v & 1, wit: v & 2, dna: v & 4 }; let left = s.tokens;
      for (const [k, c] of [['cctv', 1], ['wit', 1], ['dna', 2]]) if (want[k] && left >= c) { s.ev[k] = true; left -= c; } s.tokens = left; break; }
    case 'evidence': { const cards = evidenceCards(s); s.adm = {}; s.stampErr = [];
      cards.forEach((c, i) => { const excl = !!(v & (1 << i)); s.adm[c.k] = !excl;
        if (c.illegal && !excl) s.stampErr.push('영장 없이 얻은 문자를 증거로 채택했다');
        if (!c.illegal && excl) s.stampErr.push(eul(c.name) + ' 근거 없이 배제했다'); });
      s.err = [...s.stampErr]; break; }
    case 'syllogism': if (v === 1) { if (hardDoubts(s).length) s.err.push('의심을 남기는 증거가 법정에 있었는데도 합리적 의심이 모두 해소되었다고 보았다'); } s.v1 = v === 0 ? 'acq' : 'guilty'; s.heldAtTrial = s.held; addDays(s, 60); if (v === 0 && s.held) { s.held = false; s.released = true; } break;
    case 'sentence': { const x = SEN.dec(v);
      if (st.mode === 'demand') s.demand = x; else if (st.mode === 'first') s.s1 = x;
      else if (st.mode === 'appeal') { s.s1o = s.s1; s.s2 = x; s.s1 = x; } else s.real = x; break; }
  }
  if (st.after) st.after(s);
}
function applyInterro(s, qi, v) {
  const Q = INTERRO[qi]; const half = s.lawyer ? 0.5 : 1;
  if (Q.last) {
    if (v === 1) s.used.silent++;
    if (v === 2) s.conf = true;
    s.answers.push({ q: Q.q, text: s.conf ? '그냥…… 제가 했다고 할게요.' : v === 1 ? '(진술 거부)' : '저는 하지 않았습니다. 더 할 말도 없습니다.', how: s.conf ? 2 : v, flag: s.conf });
    return;
  }
  if (v === 0) { s.fat += 16 * half; if (Q.flag) s[Q.flag] = true; s.answers.push({ q: Q.q, text: Q.a, how: 0, flag: !!Q.flag }); }
  if (v === 1) { s.fat += 16 * half; s.used.silent++; s.answers.push({ q: Q.q, text: '(진술 거부)', how: 1 }); }
  if (v === 2) { s.used.lawyerReq++; if (!s.lawyer) { s.lawyer = true; s.fat += 6; } else s.fat += 7; if (Q.flag) s[Q.flag] = true; s.answers.push({ q: Q.q, text: Q.la, how: 2, flag: !!Q.flag }); }
}
function mark(st, s) {
  const d = META.dex;
  (st.teach || []).forEach(k => d[k] = 'play');
  (st.teachCard || []).forEach(k => { if (d[k] !== 'play') d[k] = 'card'; });
  if (st.teachFn) for (const [k, m] of Object.entries(st.teachFn(s))) if (d[k] !== 'play') d[k] = m;
}
function nextIndex(i, s) { for (let j = i + 1; j < STEPS.length; j++) { const st = STEPS[j]; if (!st.when || st.when(s)) return j; } return STEPS.length - 1; }
// 기록 재생: 선택 기록으로 상태를 다시 만든다. src(r, st, s, i)가 null이면 그 결정 장면에서 멈춘다.
function replay(src, stopPos) {
  const s = fresh(); let i = 0; mark(STEPS[0], s);
  while (i < STEPS.length - 1) {
    const st = STEPS[i];
    if (stopPos != null && i >= stopPos && !src.more()) break;
    if (DECISION.has(st.type)) { const r = radix(st, s); const v = src(r, st, s, i); if (v == null) break; s.log.push([v, r]); s.dp.push(i); apply(st, s, v); }
    else { if (stopPos == null && !src.more()) break; if (st.after) st.after(s); }
    i = nextIndex(i, s); mark(STEPS[i], s);
  }
  s.pos = i; return s;
}
function fromLog(log, pos) { let k = 0; const f = () => k < log.length ? log[k++][0] : null; f.more = () => k < log.length; return replay(f, pos); }
// 교사 화면 · 자동 진행용 기본 선택
function presetValue(name, st, s) {
  const P = PRESET[name] || {}; const p = P[st.id];
  switch (st.type) {
    case 'sentence': return SEN.enc(st.mode === 'appeal' && s.s1 ? s.s1 : st.mode === 'real' ? { kind: '징역', m: 24, susp: false, sec: 0 } : { kind: '징역', m: 18, susp: false, sec: 0 });
    case 'evidence': return evidenceCards(s).reduce((a, c, i) => a | (c.illegal ? 1 << i : 0), 0);
    case 'tokens': return p ?? 3;
    case 'syllogism': return p ?? (proof(s).proven ? 1 : 0);
    default: return p ?? 0;
  }
}
function run(name, stopPos) { const f = (r, st, s, i) => i === stopPos ? null : presetValue(name, st, s); f.more = () => false; return replay(f, stopPos); }
// 이어하기 코드: 선택 기록을 혼합 진법 수 하나로 압축
const AL = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function encode(log) {
  let n = 0n, m = 1n; for (const [v, r] of log) { n += BigInt(v) * m; m *= BigInt(r); }
  n = n * 64n + BigInt(log.length);
  let out = ''; do { out = AL[Number(n % 32n)] + out; n /= 32n; } while (n > 0n);
  const chk = [...out].reduce((a, c) => a + AL.indexOf(c), 0) % 32; return out + AL[chk];
}
function decode(code) {
  code = code.toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
  if (code.length < 2) return null; const body = code.slice(0, -1);
  if (AL[[...body].reduce((a, c) => a + AL.indexOf(c), 0) % 32] !== code.slice(-1)) return null;
  let n = 0n; for (const c of body) { const d = AL.indexOf(c); if (d < 0) return null; n = n * 32n + BigInt(d); }
  let len = Number(n % 64n); n /= 64n;
  const f = r => { if (len <= 0) return null; len--; const v = Number(n % BigInt(r)); n /= BigInt(r); return v; }; f.more = () => len > 0;
  return f;
}
// 저장 (이 기기에만, 이름 없이)
const KEY = 'nm2:save2';
function save() { try { localStorage.setItem(KEY, JSON.stringify({ log: S.log, pos: S.pos, meta: META })); } catch (e) { } }
function load() { try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (!d) return false; META = Object.assign(freshMeta(), d.meta || {}); S = fromLog(d.log || [], d.pos || 0); return true; } catch (e) { return false; } }

// ───────── 화면 틀
const app = typeof document !== 'undefined' ? document.getElementById('app') : null;
function hud(st, s) {
  const ch = st.ch ?? 0; const dex = Object.values(META.dex).filter(Boolean).length;
  const days = s.everHeld ? (s.held ? `<span class="pill days" title="이야기 속에서 구속되어 있는 날수">구금 ${s.days}일째</span>` : `<span class="pill days off" title="풀려나기 전까지 구금되어 있던 날수. 형사 보상과 관련된다">구금되었던 기간 ${s.days}일 · 석방</span>`) : '';
  const tok = !MIS && ch === 2 ? `<span class="pill tok" id="tokpill" title="수사할 수 있는 남은 날. 토큰 하나가 하루다">수사 토큰 ${'●'.repeat(s.tokens)}${'○'.repeat(Math.max(0, 4 - s.tokens))}</span>` : '';
  const can = !MIS && S.log.length && (META.teacher || META.tickets > 0);
  const undo = MIS ? '' : `<button class="pill ghost" id="undobtn" ${can ? '' : 'disabled'} title="직전 선택으로 돌아가 다시 고른다">↶ 다시 고르기 ${META.teacher ? '∞' : META.tickets}</button>`;
  return `<span class="pill">${MIS ? '가지 않은 길 · ' + MIS.m.name : CHNAME[ch]}</span>${META.teacher ? '<span class="pill tmode">교사 모드</span>' : ''}${days}${tok}<span class="grow"></span>${undo}<button class="pill ghost" id="dexbtn">도감 ${dex}/57</button><button class="pill ghost" id="menubtn" aria-label="메뉴">≡</button>`;
}
let CUR = null;
function frame() {
  if ($('.shell', app) && $('.bgw', app)) return;
  app.innerHTML = `<div class="shell"><header class="hud"></header><div class="stage"><div class="bgw"><div class="scrim"></div><div class="fxl"></div></div><div class="ov"></div></div><section class="panel"></section></div>`;
}
function swapBg(src, blur) {
  const w = $('.bgw', app); const cur = $('img.bgi:not(.out)', w);
  if (cur && cur.dataset.src === src) { cur.classList.toggle('blur', !!blur); return; }
  const im = document.createElement('img'); im.className = 'bgi' + (blur ? ' blur' : ''); im.alt = ''; im.dataset.src = src; im.src = src;
  im.onload = () => { if (im.classList.contains('out')) return; const r = im.naturalWidth / im.naturalHeight; const stg = $('.stage', app); if (stg) stg.style.setProperty('--ar', Math.min(2.4, Math.max(1.78, r)).toFixed(3)); };
  w.insertBefore(im, $('.scrim', w));
  if (cur) { cur.classList.add('out'); setTimeout(() => cur.remove(), 700); }
}
function paint(st, s, stage, panel, bg) {
  frame(); CUR = { st, s };
  $('.shell', app).className = `shell ch${MIS ? 'm' : st.ch ?? 0}`;
  $('.hud', app).innerHTML = hud(st, s);
  swapBg(bg || bgOf(st), st.blur);
  $('.ov', app).innerHTML = stage || '';
  setPanel(panel || '');
  bindHud();
}
function setPanel(html) { $('.panel', app).innerHTML = (MIS && MIS.m.what ? `<div class="ifbar">⟲ 가지 않은 길 · 만약 ${MIS.m.what}<span>지금 장면: ${curStep().ch}장 · 지금 나는: ${misRole(curStep())}</span></div>` : '') + html; lockLaws(); }
function bindHud() {
  const d = $('#dexbtn'), m = $('#menubtn'), u = $('#undobtn');
  if (d) d.onclick = showDex; if (m) m.onclick = showMenu; if (u) u.onclick = undo;
}
function fx(name) {
  if (!name) return; const st = $('.stage', app); if (!st) return;
  if (name === 'tokens') { const t = $('#tokpill'); if (t) { t.classList.remove('glow'); void t.offsetWidth; t.classList.add('glow'); } return; }
  st.classList.remove('fx-shake', 'fx-zoom', 'fx-flash', 'fx-pan', 'fx-rewind', 'fx-ff'); void st.offsetWidth; st.classList.add('fx-' + name);
  const l = $('.fxl', app); l.innerHTML = name === 'rewind' ? '<span>◀◀ 되감기</span>' : name === 'ff' ? '<span>▶▶</span>' : '';
  clearTimeout(fx.t); fx.t = setTimeout(() => { st.classList.remove('fx-' + name); l.innerHTML = ''; }, 1400);
}
// 조문·교과서 카드를 모두 펼쳐 보아야 다음으로 넘어간다
function lockLaws() {
  const laws = $$('.panel details.law', app); if (!laws.length) return;
  const btn = $('#next', app) || $('#adv.last', app); if (!btn) return;
  const label = btn.dataset.label || btn.textContent; btn.dataset.label = label;
  const upd = () => { const seen = laws.filter(d => d.dataset.seen).length;
    if (seen < laws.length) { btn.disabled = true; btn.textContent = `카드를 펼쳐 읽자 ${seen}/${laws.length}`; } else { btn.disabled = false; btn.textContent = label; } };
  laws.forEach(d => { const key = (CUR ? CUR.st.id : '') + '|' + $('summary', d).textContent; if (META.read[key]) d.dataset.seen = 1;
    d.addEventListener('toggle', () => { if (d.open) { d.dataset.seen = 1; META.read[key] = 1; d.classList.add('seen'); } upd(); }); if (d.dataset.seen) d.classList.add('seen'); });
  upd();
}
const SPEAK = k => { const mind = k.endsWith('~'); const b = mind ? k.slice(0, -1) : k; return { b, mind, p: PEOPLE[b] || PEOPLE.nar }; };
function dlg(k, text) {
  const { b, mind, p } = SPEAK(k || 'nar');
  let tag = '';
  if (p[0]) { const isNew = ROLE[b] && !META.seen[b] && !MIS; if (isNew) META.seen[b] = 1;
    tag = `<b class="who ${p[1]}">${p[0]}${mind ? ' <small>속마음</small>' : ''}</b>${isNew ? `<span class="nametag new">${ROLE[b]}</span>` : ''}`; }
  return `<div class="dlg ${mind ? 'mind' : ''} ${b === 'nar' ? 'nar' : ''}">${tag}<p>${hl(text)}</p></div>`;
}
// 핵심 개념어 강조 · 한 대사에서 같은 말은 한 번만, 최대 3개
const KW = (() => { const t = new Set(); Object.keys(CDEF).forEach(k => t.add(k.replace(/\(.*?\)/g, '').trim())); Object.keys(GL).forEach(k => t.add(k));
  ['체포영장', '구속영장', '압수·수색 영장', '영장', '피의자', '피고인', '공소', '기소', '불기소', '송치', '불송치', '진술 거부권', '변호인', '무죄 추정', '합리적인 의심', '합리적 의심', '배심원', '재심', '항소', '상고', '양형 기준', '법정형', '집행 유예', '증거', '위법'].forEach(k => t.add(k));
  return [...t].filter(k => k.length >= 2 && !/[·,]/.test(k) || k === '압수·수색 영장').sort((x, y) => y.length - x.length); })();
const KWRE = new RegExp('(' + KW.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
function hl(text) { if (typeof text !== 'string' || text.includes('<')) return text; const seen = new Set();
  return text.replace(KWRE, m => { if (seen.has(m) || seen.size >= 3 || m === '증거' && seen.size) return m; seen.add(m); return `<b class="kw">${m}</b>`; }); }
// 긴 대사는 문장 단위로 나눠 한 화면에 짧게
function splitLong(lines) { const out = [];
  for (const L of lines) { const [w, t, f, bg] = L; if (typeof t !== 'string' || t.length <= 62 || t.includes('<')) { out.push(L); continue; }
    const parts = t.match(/[^.?!]+[.?!]+[”’"」)]*\s*|[^.?!]+$/g) || [t]; const ch = []; let cur = '';
    for (const p of parts) { if (cur && (cur + p).trim().length > 52) { ch.push(cur.trim()); cur = p; } else cur += p; }
    if (cur.trim()) ch.push(cur.trim());
    ch.forEach((c, i) => out.push([w, c, i === 0 ? f : null, bg])); }
  return out; }
const lawCards = cards => (cards || []).length ? `<div class="laws">${cards.map(([t, x], i) => `<details class="law" data-k="${i}"><summary>${t}</summary><p>${x}</p></details>`).join('')}</div>` : '';
const gloss = gl => gl && gl.length ? `<details class="gloss"><summary>용어 힌트 펼치기</summary><dl>${gl.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></details>` : '';
const nextBtn = (label = '다음') => `<div class="row end"><button class="btn" id="next">${label} ▸</button></div>`;

function curStep() { return MIS ? STEPS[IDX[MIS.list[Math.max(0, MIS.i)].split('!')[0]]] : STEPS[S.pos]; }
function render() {
  const s = MIS ? MIS.s : S; const st = curStep();
  if (!MIS) save();
  (RENDER[st.type] || RENDER.card)(st, s);
  if (st.fx && st.type !== 'talk') fx(st.fx);
  window.scrollTo({ top: 0 });
}
function go() {
  if (MIS) { MIS.i++; if (MIS.i >= MIS.list.length) return finishMission(); markMission(curStep()); return render(); }
  const st = STEPS[S.pos]; if (!DECISION.has(st.type) && st.after) st.after(S);
  S.pos = nextIndex(S.pos, S); mark(STEPS[S.pos], S); render();
}
function decide(st, s, v) { if (!MIS) { S.log.push([v, radix(st, s)]); S.dp.push(S.pos); } apply(st, s, v); if (!MIS) save(); const u = $('#undobtn'); if (u) u.disabled = !(META.teacher || META.tickets > 0); }
function undo() {
  if (MIS || !S.log.length) return; if (!META.teacher && META.tickets <= 0) return;
  modal(`<h3>직전 선택으로 돌아갈까?</h3><p>바로 앞의 선택 장면으로 돌아가 다시 고를 수 있다. ${META.teacher ? '교사 화면에서는 횟수 제한이 없다.' : `남은 기회 ${META.tickets}번 중 1번을 쓴다.`}</p>
    <div class="row end"><button class="btn sub" id="mx">취소</button><button class="btn" id="my">돌아가기</button></div>`);
  $('#mx').onclick = closeModal;
  $('#my').onclick = () => { closeModal(); if (!META.teacher) META.tickets--; const to = S.dp[S.dp.length - 1]; S = fromLog(S.log.slice(0, -1), to); save(); render(); fx('rewind'); };
}
const bindNext = () => { const b = $('#next'); if (b) b.onclick = go; };
function wrong(el, msg, ms = 1500) { META.wrong++; if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); } const box = el && el.closest && (el.querySelector('.ifb') || (el.closest('.slot, .clsrow') || el).querySelector('.ifb')); const f = box || $('#fb'); if (f) f.innerHTML = `<div class="fb bad">${msg || '다시 생각해 보자.'}</div>`;
  // 오답 뒤 잠깐 잠금: 아무거나 연달아 눌러 맞히는 것을 막는다
  const els = $$('.panel .opt:not(:disabled), .panel .bin:not(:disabled), .panel .stamp:not(:disabled), #chk:not(:disabled)'); els.forEach(e => { e.disabled = true; e.classList.add('cool'); });
  setTimeout(() => els.forEach(e => { if (e.isConnected) { e.disabled = false; e.classList.remove('cool'); } }), ms); }
function fbSet(html) { const f = $('#fb'); f.innerHTML = html; lockLaws(); bindNext(); }
const okBox = (st, text, extra = '') => `<div class="fb ok"><b>맞다.</b> ${text || ''}</div>${extra}${lawCards(st.cards)}${nextBtn()}`;
function showResult(h, p, cards, extra = '') { setPanel(`<div class="result"><h3>${h}</h3><p>${p}</p></div>${extra}${lawCards(cards)}${nextBtn()}`); bindNext(); }
const optList = (opts, cls = '') => `<div class="opts">${opts.map((o, i) => `<button class="opt ${cls}" data-i="${i}">${o}</button>`).join('')}</div>`;

const RENDER = {
  title(st, s) {
    paint(st, s, `<div class="titlecard"><small>${st.role || ''}</small><h1>${st.title}</h1><p>${st.sub}</p></div>`,
      st.id === 'p0' ? `<p class="hint">학생 한 명이 한 사건을 피의자, 경찰, 검사, 판사의 자리에서 차례로 겪는 이야기다. 이름은 묻지 않고, 기록은 이 기기에만 남는다.</p>${S.log.length ? '' : ''}${nextBtn('시작')}` : nextBtn('들어가기'));
    bindNext(); if (st.ch) fx('zoom');
  },
  talk(st, s) {
    const lines = splitLong(val(st.lines, s)); let k = 0;
    const draw = () => {
      const [w, t, f, bg] = lines[k]; const last = k === lines.length - 1;
      paint(st, s, dlg(w, t), `<div class="row between"><span class="hint">${k + 1} / ${lines.length}</span><button class="btn ${last ? 'last' : ''}" id="adv">${last ? '계속' : '다음'} ▸</button></div>${last ? lawCards(st.cards) : ''}`, bg ? img(bg) : null);
      if (k === 0 && st.fx) fx(st.fx); if (f) fx(f);
      $('#adv').onclick = () => { if (k < lines.length - 1) { k++; draw(); } else go(); };
      $('.ov').onclick = () => { const a = $('#adv'); if (a && !a.disabled) a.click(); };
    };
    draw();
  },
  record(st, s) {
    const lines = val(st.lines, s);
    const rows = s.answers.map(a => `<li class="${a.flag ? 'flag' : ''}"><b>문</b> ${a.q}<br><b>답</b> ${a.text}${a.how === 2 ? ' <small>(변호인과 상의한 뒤)</small>' : ''}</li>`).join('');
    paint(st, s, dlg('nar', lines[0][1]), `<div class="doc rec"><h4>피의자 신문 조서</h4><ol>${rows}</ol>${s.conf ? '<span class="docseal">印</span>' : ''}</div>
      <p class="hint">표시된 답은 수사 기록에 남아 뒤에서 다시 쓰인다. 진술을 거부한 질문은 ‘(진술 거부)’로만 남고, 그 때문에 불이익을 받지 않는다.</p>${nextBtn()}`);
    bindNext();
  },
  chat(st, s) {
    const bubbles = st.msgs.filter(m => !m[0].endsWith('~'));
    const mind = st.msgs.filter(m => m[0].endsWith('~'));
    paint(st, s, dlg('nar', '강민호의 휴대전화가 울린다.'), `<div class="chat"><div class="chathead">${PEOPLE[bubbles[0][0]][0]}</div>${bubbles.map((m, i) => `<div class="bubble" style="animation-delay:${i * .5}s">${m[1]}</div>`).join('')}</div>
      ${mind.map(m => `<div class="mindline"><b>${PEOPLE[m[0].slice(0, -1)][0]} · 속마음</b><p>${m[1]}</p></div>`).join('')}${nextBtn()}`);
    bindNext(); fx('shake');
  },
  quiz(st, s) {
    paint(st, s, dlg(st.who || 'nar', val(st.q, s)), `${st.doc ? DOCS[st.doc](s) : ''}${gloss(st.gloss)}${optList(st.opts)}${st.hint ? `<details class="gloss"><summary>힌트</summary><p>${st.hint}</p></details>` : ''}<div id="fb"></div>`);
    $$('.opt').forEach(b => b.onclick = () => { const i = +b.dataset.i;
      if (i === st.ans) { $$('.opt').forEach(x => x.disabled = true); b.classList.add('right'); fbSet(okBox(st, st.ok)); }
      else wrong(b, st.no && st.no[i]); });
  },
  contradict(st, s) { RENDER.quiz(st, s); },
  multi(st, s) {
    const sel = new Set();
    paint(st, s, dlg(st.who || 'nar', st.q), `${optList(st.opts, 'chk')}<div class="row end"><button class="btn" id="chk">확인</button></div><div id="fb"></div>`);
    $$('.opt').forEach(b => b.onclick = () => { const i = +b.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); b.classList.toggle('sel'); });
    $('#chk').onclick = () => { const a = new Set(st.ans); const ok = sel.size === a.size && [...a].every(x => sel.has(x));
      if (ok) { $$('.opt').forEach(x => { x.disabled = true; if (a.has(+x.dataset.i)) x.classList.add('right'); }); $('#chk').remove(); fbSet(okBox(st, st.ok)); }
      else { const miss = [...a].filter(x => !sel.has(x)).length, extra = [...sel].filter(x => !a.has(x)).length; wrong($('.opts'), `${miss ? `빠진 것이 ${miss}개 ` : ''}${extra ? `틀린 것이 ${extra}개 ` : ''}있다.`); } };
  },
  classify(st, s, o = {}) {
    const items = o.items || st.items, bins = o.bins || st.bins; const pick = items.map(() => null); const order = mix(items.length, 3);
    paint(st, s, dlg(st.who || 'nar', val(o.q || st.q, s)), `${gloss(st.gloss)}<div class="cls">${order.map(i => `<div class="clsrow" data-i="${i}"><p>${items[i][0]}</p><div class="bins">${bins.map((b, j) => `<button class="bin" data-j="${j}">${b}</button>`).join('')}</div></div>`).join('')}</div><div class="row end"><button class="btn" id="chk">확인</button></div><div id="fb"></div>`);
    $$('.clsrow').forEach(r => $$('.bin', r).forEach(b => b.onclick = () => { pick[+r.dataset.i] = +b.dataset.j; $$('.bin', r).forEach(x => x.classList.toggle('sel', x === b)); r.classList.remove('bad'); }));
    $('#chk').onclick = () => { let bad = 0; $$('.clsrow').forEach(r => { const i = +r.dataset.i; const ok = pick[i] === items[i][1]; r.classList.toggle('bad', !ok); if (!ok) bad++; });
      if (!bad) { $$('.bin').forEach(x => x.disabled = true); $('#chk').remove(); fbSet(okBox(st, o.ok || st.ok, o.done ? o.done() : '')); }
      else wrong($('.cls'), `${bad}개가 맞지 않는다. 붉게 표시된 줄을 다시 보자. 막히면 위의 용어 힌트를 펼쳐 보자.`); };
  },
  order(st, s) {
    const shuf = mix(st.items.length, 2); let n = 0;
    paint(st, s, dlg('nar', st.q), `${gloss(st.gloss)}<ol class="seq" id="seq"></ol><div class="opts two">${shuf.map(i => `<button class="opt" data-i="${i}">${st.items[i]}</button>`).join('')}</div><div id="fb"></div>`);
    $$('.opt').forEach(b => b.onclick = () => { const i = +b.dataset.i;
      if (i === n) { b.disabled = true; b.classList.add('right'); $('#seq').insertAdjacentHTML('beforeend', `<li class="stampin">${st.phase ? `<small class="phase">${st.phase[i]}</small> ` : ''}${st.items[i]}${st.say ? `<span class="sayq">${(PEOPLE[st.say[i][0]] || PEOPLE.nar)[0] || ''}${(PEOPLE[st.say[i][0]] || PEOPLE.nar)[0] ? ': ' : ''}“${st.say[i][1]}”</span>` : ''}</li>`); if (st.say) { $('.ov').innerHTML = dlg(st.say[i][0], st.say[i][1]); fx('zoom'); } n++;
        if (n === st.items.length) fbSet(okBox(st, st.ok)); }
      else wrong(b, '순서가 맞지 않는다. 앞 단계를 먼저 찾아보자.'); });
  },
  choice(st, s) {
    const board = st.board ? boardHtml(s) : '';
    paint(st, s, dlg(st.who || 'nar', val(st.q, s)), `${board}${gloss(st.gloss)}${optList(val(st.opts, s))}`);
    const done = v => { decide(st, s, v); const [h, p] = st.res(s); showResult(h, p, st.cards); if (st.fx) fx(st.fx); };
    if (MIS && MIS.force != null) { const v = MIS.force; MIS.force = null; return done(v); }
    $$('.opt').forEach(b => b.onclick = () => done(+b.dataset.i));
  },
  pick2(st, s) {
    const sel = [];
    paint(st, s, dlg(st.who || 'wj', st.q), `${optList(st.opts, 'chk')}<div class="row end"><button class="btn" id="chk" disabled>두 가지 말하기</button></div>`);
    $$('.opt').forEach(b => b.onclick = () => { const i = +b.dataset.i; const k = sel.indexOf(i); if (k >= 0) sel.splice(k, 1); else if (sel.length < 2) sel.push(i); $$('.opt').forEach(x => x.classList.toggle('sel', sel.includes(+x.dataset.i))); $('#chk').disabled = sel.length !== 2; });
    $('#chk').onclick = () => { const a = [...sel].sort(); const v = PAIRS.findIndex(p => p[0] === a[0] && p[1] === a[1]); decide(st, s, v); const [h, p] = st.res(s);
      showResult(h, '', st.cards, `<div class="why">${p}</div>${st.note ? `<p class="hint">${st.note}</p>` : ''}`); fx(st.fx); };
  },
  interro(st, s) {
    const Q = INTERRO[st.qi]; const forced = false;
    const opts = Q.last ? ['끝까지 부인한다', '진술을 거부한다', '지쳐서 “그냥…… 제가 했다고 할게요.”라고 말해 버린다'] : ['직접 답한다: “' + Q.a + '”', '진술을 거부한다', s.lawyer ? '변호인과 상의한 뒤 답한다' : '변호인을 불러 달라고 한다'];
    const gauge = `<div class="gauge"><span>피로</span><div class="bar"><i style="width:${Math.min(100, s.fat)}%"></i></div><span>${s.lawyer ? '변호인 곁에 있음' : '변호인 없음'}</span></div>`;
    paint(st, s, dlg('km', Q.q), `${gauge}${st.qi === 0 ? `<p class="hint">질문마다 하나를 고른다. 피로는 신문이 길어질수록 쌓이고, 답하든 진술을 거부하든 똑같이 쌓인다. 진술을 거부해도 불이익은 없다. 변호인이 곁에 있으면 덜 지친다.</p>` : ''}
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}" ${forced && i < 2 ? 'disabled' : ''}>${o}</button>`).join('')}</div>${forced ? '<p class="hint bad">피로가 한계에 이르렀다. 생각이 잘 이어지지 않는다.</p>' : ''}`);
    $$('.opt').forEach(b => b.onclick = () => { const v = +b.dataset.i; const hadLawyer = s.lawyer; decide(st, s, v);
      const a = s.answers[s.answers.length - 1]; const L = [];
      if (Q.last) { L.push(['yj', a.text]); L.push(s.conf ? ['km~', '드디어 들었다. ……그런데 이 말, 정말 믿어도 되는 걸까. 지쳐서 한 말이라면 증거가 되기 어렵다.'] : v === 1 ? ['km', '알겠습니다. 진술을 거부할 권리는 계속 보장됩니다.'] : ['km', '알겠습니다. 진술을 거부할 권리는 계속 보장됩니다. 오늘 신문은 여기까지 하겠습니다.']); }
      else if (v === 0) { L.push(['yj', a.text]); L.push(['km~', Q.flag ? '이 말은 조서에 적어 둔다. 확인해 볼 만하다.' : '받아 적는다. 표정을 살핀다.']); }
      else if (v === 1) { L.push(['yj', '그 질문에는 답하지 않겠습니다.']); L.push(['km', '알겠습니다. 진술하지 않은 것으로 적겠습니다.']); }
      else { if (!hadLawyer) L.push(['nar', '신문이 잠시 멈춘다. 한 시간 뒤, 김하나 변호사가 도착했다.']); L.push(['kh', Q.adv]); L.push(['yj', a.text]); }
      let k = 0; const step = () => { $('.ov').innerHTML = dlg(L[k][0], L[k][1]); };
      step(); setPanel(`${gauge.replace(/width:[\d.]+%/, `width:${Math.min(100, s.fat)}%`)}<div class="row end"><button class="btn" id="adv2">다음 ▸</button></div>`);
      $('#adv2').onclick = () => { k++; if (k < L.length) step(); else go(); }; });
  },
  tokens(st, s) {
    const items = [['cctv', '주변 상가 CCTV 확보', 1, s.alibi ? '조서: “그 시각 집에 있었다” → 골목 주변 영상으로 확인할 수 있다' : '분식집 말고도 골목을 비추는 카메라가 있을지 모른다'],
      ['wit', '목격자 탐문', 1, s.right ? '조서: “나는 오른손잡이다” → 범인이 어느 손을 썼는지 물어볼 수 있다' : '사건 시각 골목을 본 사람이 있을지 모른다'],
      ['dna', '담배꽁초 DNA 감정 의뢰', 2, '현장에서 담배꽁초가 나왔다 · 결과는 늦게 나온다']];
    const sel = new Set();
    paint(st, s, dlg('km~', val(st.q, s)), `<div class="tokbig" id="tokbig"></div><div class="opts">${items.map(([k, t, c, h]) => `<button class="opt chk" data-k="${k}" data-c="${c}">${t} <span class="cost">토큰 ${c}개</span><small class="clue">${h}</small></button>`).join('')}</div>
      <p class="hint">토큰을 남겨도 돌려받지 못한다. 하지만 무엇을 할지는 직접 정한다.</p><div class="row end"><button class="btn" id="chk">이대로 수사한다</button></div>`);
    const upd = () => { const used = [...sel].reduce((a, k) => a + items.find(x => x[0] === k)[2], 0); const left = s.tokens - used;
      $('#tokbig').innerHTML = `남은 토큰 <b>${'●'.repeat(left)}${'○'.repeat(used)}</b> ${left}개`;
      $$('.opt').forEach(b => { const k = b.dataset.k; b.classList.toggle('sel', sel.has(k)); b.disabled = !sel.has(k) && used + +b.dataset.c > s.tokens; }); };
    $$('.opt').forEach(b => b.onclick = () => { const k = b.dataset.k; sel.has(k) ? sel.delete(k) : sel.add(k); upd(); }); upd();
    $('#chk').onclick = () => { const v = (sel.has('cctv') ? 1 : 0) | (sel.has('wit') ? 2 : 0) | (sel.has('dna') ? 4 : 0); decide(st, s, v); go(); };
  },
  files(st, s) {
    const F = evFiles(s); const done = new Set(F.filter(f => f.note).map(f => f.k));
    const list = () => {
      paint(st, s, dlg('km~', st.q), `<div class="files">${F.map(f => `<button class="file ${done.has(f.k) ? 'done' : ''}" data-k="${f.k}"><span class="tabk">수사 기록</span><b>${f.h}</b><small>${done.has(f.k) ? (f.note ? '결과 기다리는 중' : '검토함 ✓') : '눌러서 펼치기'}</small></button>`).join('')}</div>
        <p class="hint">기록마다 “이 증거가 무엇을 보여 주고, 무엇은 보여 주지 못하는가”를 따져 보자. ${done.size}/${F.length}</p>
        ${done.size === F.length ? `<div class="mindline"><b>강민호 경위 · 속마음</b><p>${verdictLine(s)}</p></div>${nextBtn('송치 여부 정하러 가기')}` : ''}`);
      $$('.file').forEach(b => b.onclick = () => open(F.find(f => f.k === b.dataset.k))); bindNext();
    };
    const open = f => {
      const m = mix(f.opts ? f.opts.length : 0, f.h.length % 5);
      paint(st, s, dlg('km', eul(f.h) + ' 펼친다.'), `<div class="doc file-doc"><h4>${f.h}</h4><ul>${f.lines.map(l => `<li>${l}</li>`).join('')}</ul></div>
        ${f.note ? `<div class="row end"><button class="btn" id="bk">목록으로</button></div>` : `<p class="q">${f.q}</p><div class="opts">${m.map(i => `<button class="opt" data-i="${i}">${f.opts[i]}</button>`).join('')}</div><div id="fb"></div>`}`);
      if (f.note) { done.add(f.k); $('#bk').onclick = list; return; }
      $$('.opt').forEach(b => b.onclick = () => { if (+b.dataset.i === f.ans) { done.add(f.k); $$('.opt').forEach(x => x.disabled = true); b.classList.add('right'); $('#fb').innerHTML = `<div class="fb ok"><b>맞다.</b> ${f.ok}</div><div class="row end"><button class="btn" id="bk">목록으로</button></div>`; $('#bk').onclick = list; } else wrong(b, '기록에 적힌 내용만 보자. 기록이 말하지 않는 것까지 넘겨짚지 않는다.'); });
    };
    list();
  },
  review(st, s) {
    const items = reviewItems(s);
    RENDER.classify({ ...st, gloss: [['피해 사실', '범죄로 어떤 피해가 생겼는지 보여 주는 기록'], ['윤재를 가리킴', '윤재가 범인일 가능성을 높이는 기록'], ['윤재가 아닐 수도', '윤재가 범인이라는 데 의심을 남기는 기록'], ['절차 문제', '수집 과정이 법에 맞지 않아 법정에서 문제가 될 수 있는 기록']] }, s, {
      items, bins: ['피해 사실', '윤재를 가리킴', '윤재가 아닐 수도', '절차 문제'],
      ok: '기록을 모두 나눴다.',
      done: () => { const n = b => items.filter(x => x[1] === b).length; const inc = n(1), dbt = n(2), pr = n(3);
        return `<div class="mindline"><b>서지우 검사 · 속마음</b><p>${dbt ? '윤재를 가리키는 기록도, 의심을 남기는 기록도 있다. 어느 쪽이 많은지가 아니라 <b>각 기록이 무엇을 증명하는지</b>가 중요하다.' : '윤재를 가리키는 기록뿐이다. 반대쪽 증거는 <b>찾아보지 않은 건</b> 아닐까.'}${pr ? ' 절차에 문제가 있는 기록도 있다.' : ''}</p></div>`; } });
  },
  indict(st, s) {
    const P = indictPieces(s), D = doubts(s);
    const slots = [['범죄 사실', '무슨 일이 있었나'], ['범인으로 보는 이유', '왜 윤재인가'], ['동기 · 정황', '왜 그랬을까']];
    const put = P.map(() => null);
    const draw = () => {
      const has = j => P.some((p, i) => put[i] === j && !p.illegal);
      const allPut = P.every((p, i) => put[i] != null);
      paint(st, s, dlg('sj', '공소장을 쓰자. 기록을 알맞은 칸에 넣는다.'),
        `<div class="checks">${slots.map(([h], j) => `<span class="ck ${has(j) ? 'on' : ''}">${has(j) ? '✓' : '○'} ${h}</span>`).join('')}</div>
        <div class="slots3">${slots.map(([h, sub], j) => `<div class="slot ${has(j) ? 'full' : ''}"><h4>${h} <small>${sub}</small></h4>${P.map((p, i) => put[i] === j ? `<span class="chip pros">${p.t.split(' · ')[0]}${p.illegal ? ' ⚠' : ''}</span>` : '').join('')}</div>`).join('')}</div>
        <div class="cls">${P.map((p, i) => `<div class="clsrow ${put[i] != null ? 'placed' : ''}" data-i="${i}"><p>${p.t}</p><div class="bins">${slots.map(([h], j) => `<button class="bin ${put[i] === j ? 'sel' : ''}" data-j="${j}">${h}</button>`).join('')}</div></div>`).join('')}</div>
        ${D.length ? `<div class="result defbox"><h3>함께 넘길 기록 · 윤재가 아닐 수도 있다</h3><ul>${D.map(d => `<li>${d}</li>`).join('')}</ul><p class="hint">검사는 피고인에게 유리한 기록도 숨기지 않는다.</p></div>` : ''}
        <div id="fb"></div><div class="row end"><button class="btn seal" id="chk" ${allPut ? '' : 'disabled'}>공소를 제기한다</button></div>`);
      $$('.clsrow').forEach(r => $$('.bin', r).forEach(b => b.onclick = () => { const i = +r.dataset.i, j = +b.dataset.j;
        if (P[i].slot !== j) return wrong(r, `‘${P[i].t.split(' · ')[0]}’는 ‘${slots[j][0]}’ 칸의 기록이 아니다.`);
        put[i] = put[i] === j ? null : j; draw();
        if (P[i].illegal && put[i] === j) $('#fb').innerHTML = `<div class="fb bad"><b>영장 없이 얻은 증거</b>다. 법정에서 증거로 쓰지 못할 수 있다.</div>`;
        if (P[i].k === 'conf' && put[i] === j) $('#fb').innerHTML = `<div class="fb bad"><b>자백만으로는 유죄가 될 수 없다.</b> 다른 증거가 함께 있어야 한다.</div>`; }));
      $('#chk').onclick = () => {
        const facts = P.filter((p, i) => put[i] != null && !p.illegal).map(p => p.t.split(' · ')[0]);
        setPanel(`${DOCS.indict(s, facts)}<div class="mindline"><b>서지우 검사 · 속마음</b><p>${D.length ? '혐의는 인정된다. 하지만 풀리지 않은 의심도 있다. 그건 법정에서 가릴 일이다.' : '혐의는 인정된다. 그런데 반대쪽 기록이 하나도 없다. 찾지 않아서 없는 건 아닐까.'}</p></div>
          <div class="keybox"><p><b>공소 제기(기소)</b> = 검사가 법원에 재판을 신청하는 것</p><p>기소는 <b>유죄라는 뜻이 아니다.</b> 유죄인지는 법원이 증거로 판단한다.</p><p>이제 윤재는 <b>피의자 → 피고인</b></p></div>${lawCards(st.cards)}${nextBtn()}`);
        bindNext(); fx('shake');
      };
    };
    draw();
  },
  evidence(st, s) {
    const cards = evidenceCards(s); const pick = cards.map(() => null);
    const late = c => c.k === 'dna' || c.k === 'loc'; const opened = new Set(cards.map((c, i) => late(c) ? null : i).filter(i => i != null));
    const from = c => c.k === 'dna' ? `${(s.extraList || []).includes('담배꽁초 DNA 감정') ? '검사의 보완 수사 요청' : '강민호 경위의 감정 의뢰'}로 맡긴 담배꽁초 DNA 감정` : '압수·수색 영장으로 요청한 통신사 위치 기록 회신';
    const body = (c, i) => `<div><span class="side">${c.by === 'def' ? '변호인 신청' : '검사 제출'}</span>${c.illegal ? '<span class="tag bad">영장 없음</span>' : ''}${c.by === 'pros' && c.side === 'def' ? '<span class="tag good">피고인에게 유리</span>' : ''}<b>${c.name}</b><p>${c.t}</p><small class="how">수집 경위 · ${HOW(c)}</small>${(() => { const f = evFiles(s).find(x => x.k === c.k); return f ? `<details class="gloss"><summary>수사 기록 자세히</summary><ul>${f.lines.map(l => `<li>${l}</li>`).join('')}</ul></details>` : ''; })()}</div><div class="row"><button class="stamp ok" data-v="0">채택</button><button class="stamp no" data-v="1">배제</button></div><div class="reasons" hidden><small>배제하는 이유는?</small>${['적법한 절차를 어기고 수집했다', '내용을 믿기 어렵다', '다른 증거와 맞지 않는다', '피고인에게 불리하다'].map((r, j) => `<button class="bin" data-r="${j}">${r}</button>`).join('')}</div>`;
    const anyLate = cards.some(late);
    paint(st, s, dlg('dh', anyLate ? '증거 조사를 시작하자. 방금 도착한 봉투도 이 법정에서 함께 연다.' : st.q), `<p class="hint">${anyLate ? st.q + ' ' : ''}배제 도장은 적법한 절차를 어기고 얻은 증거에만 찍는다. 믿기 어렵다고 배제하는 것이 아니다.</p>${gloss(st.gloss)}<div class="evs">${cards.map((c, i) => late(c)
      ? `<div class="ev sealed" data-i="${i}"><div class="env"><span class="envseal">봉인</span><b>방금 도착한 봉투</b><p>${from(c)}</p><button class="btn seal" data-open="${i}">봉투 열기</button></div></div>`
      : `<div class="ev ${c.side}" data-i="${i}">${body(c, i)}</div>`).join('')}</div><div class="row end"><button class="btn" id="chk" disabled>판단을 마친다</button></div><div id="fb"></div>`);
    const upd = () => { $('#chk').disabled = pick.some(p => p === null) || opened.size < cards.length; };
    const setPick = (el, v) => { pick[+el.dataset.i] = v; $$('.stamp', el).forEach(x => x.classList.toggle('sel', +x.dataset.v === v)); el.dataset.st = v; $('.reasons', el).hidden = true; upd(); };
    const bindStamps = el => { const c = cards[+el.dataset.i];
      $('.stamp.ok', el).onclick = () => setPick(el, 0);
      $('.stamp.no', el).onclick = () => { $('.reasons', el).hidden = false; };
      $$('[data-r]', el).forEach(b => b.onclick = () => { const r = +b.dataset.r;
        if (r === 0 && c.illegal) return setPick(el, 1);
        if (r === 0) return wrong(el, `${c.name}${jong(c.name) ? "은" : "는"} ${HOW(c)}. 적법한 절차를 어긴 점이 없어 배제할 이유가 없다.`);
        wrong(el, '그것은 증거를 얼마나 믿을지(증명력)의 문제다. 배제 사유가 아니다. 일단 채택하고, 판결문을 쓸 때 무엇이 증명되었는지 따진다.'); }); };
    $$('.ev:not(.sealed)').forEach(bindStamps);
    $$('[data-open]').forEach(b => b.onclick = () => { const i = +b.dataset.open, c = cards[i]; const el = $(`.ev[data-i="${i}"]`);
      el.className = `ev ${c.side} reveal`; el.innerHTML = body(c, i); bindStamps(el); opened.add(i); upd();
      fx('flash'); const here = curStep(); setTimeout(() => { if (curStep() === here) fx('shake'); }, 450);
      $('.ov').innerHTML = dlg(c.k === 'dna' ? 'nar' : 'nar', c.k === 'dna' ? '“현장 담배꽁초의 DNA는 피고인의 것과 일치하지 않는다.” 방청석이 술렁인다.' : '“사건 시각, 피고인의 휴대전화는 집 부근에 있었다.” 윤재가 고개를 든다.');
      if (opened.size === cards.length) setTimeout(() => { if (curStep() === here && $('.ov')) $('.ov').innerHTML = dlg('sj~', '피고인에게 유리한 결과다. ……그래도 숨길 수는 없다. 검사는 이기려고 법정에 서는 사람이 아니다.'); }, 2600); });
    $('#chk').onclick = () => { const v = pick.reduce((a, p, i) => a | (p << i), 0); decide(st, s, v);
      $$('.stamp').forEach(x => x.disabled = true); $('#chk').remove();
      const notes = cards.map((c, i) => { const excl = pick[i] === 1; if (c.illegal) return excl ? `<li class="good">${c.name}: 배제가 맞다. 적법한 절차에 따르지 않고 수집한 증거는 증거로 할 수 없다.</li>` : `<li class="badl">${c.name}: 영장 없이 얻은 증거를 채택했다. 이 판단은 상소심에서 다시 검토된다.</li>`;
        return excl ? `<li class="badl">${c.name}: 적법하게 얻은 증거를 배제했다. 이 판단은 상소심에서 다시 검토된다.</li>` : ''; }).join('');
      const noIll = !cards.some(c => c.illegal); const illIn = cards.some((c, i) => c.illegal && pick[i] === 0);
      const why = illIn ? `<div class="why"><b>위법한 증거가 법정을 통과했다.</b> 경찰이 영장 없이 얻고, 검사가 그대로 넘기고, 판사까지 채택했다. 세 단계의 확인이 모두 실패한 것이다. 이 문자가 유죄 판단에 쓰이면 윤재는 법이 금지한 증거로 처벌받게 된다. 내용이 사실이어도 마찬가지다. 상소심에서 이 판결은 깨질 수 있다.</div>`
        : noIll ? `<div class="why">이번 기록에는 위법하게 수집한 증거가 없었다. 경찰이 영장을 받았기 때문이다. 배제할 것이 없다는 것을 확인하는 것도 판사의 일이다. 채택은 ‘증거로 쓸 수 있다’는 뜻일 뿐, ‘유죄를 증명한다’는 뜻이 아니다. 증거가 무엇을 증명하는지는 판결문(삼단 논법)에서 따진다.</div>` : '';
      fbSet(`<div class="result"><h3>도장을 찍었다</h3><ul>${notes || '<li class="good">모든 증거를 적법성에 맞게 판단했다.</li>'}</ul></div>${why}${lawCards(st.cards)}${nextBtn()}`); fx('shake'); };
  },
  jury(st, s) {
    const adm = s.adm || {}; const has = k => evidenceCards(s).some(c => c.k === k && adm[c.k] !== false); const hard = hardDoubts(s).length > 0;
    // 배심원마다 중요하게 본 증거가 다르다. 평결은 증거의 개수가 아니라 각자가 본 근거에서 나온다.
    const J = [
      has('dna') ? ['무죄', '담배꽁초 DNA가 다르다. 피해자의 지목이 틀렸을 수 있다'] : ['유죄', '피해자가 체격이 비슷하다고 했다'],
      has('cctv2') ? ['무죄', 'CCTV 속 다른 남자가 누군지 밝혀지지 않았다'] : ['유죄', '분식집 CCTV 속 체형이 비슷하다'],
      ['무죄', '범인의 얼굴을 본 사람이 없다'],
      has('loc') ? ['무죄', '그 시각 휴대전화가 집 부근에 있었다'] : ['유죄', '다음 날 후드티를 버린 것이 마음에 걸린다'],
      has('wit') ? ['무죄', '목격자는 범인이 왼손을 썼다고 했다'] : has('conf') ? ['유죄', '자백이 있고, 다른 정황과도 맞는다'] : ['유죄', '임금 문제로 다툰 동기가 있다'],
      hard ? ['무죄', '다른 증거로 풀리지 않는 의심이 남았다'] : ['유죄', '여러 정황이 모두 같은 쪽을 가리킨다'],
    ];
    const RS = [];
    J.forEach(v => { if (!RS.some(r => r[1] === v[1])) RS.push(v); });
    if (!RS.some(r => r[0] === '유죄')) RS.unshift(['유죄', '피해자가 체격이 비슷하다고 했다']);
    let mine = null;
    const draw = () => {
      const all = mine ? [...J, mine] : J; const gn = all.filter(v => v[0] === '유죄').length;
      paint(st, s, dlg('ju', mine ? '평의를 마쳤다. 평결을 재판장에게 건넨다.' : '배심원 6명이 의견을 냈다. 7번 자리에 당신이 앉아 보자.'),
        `<div class="jury">${all.map((v, i) => `<div class="seat ${v[0] === '유죄' ? 'g' : 'a'} ${i === 6 ? 'me' : ''}" style="animation-delay:${mine ? 0 : i * .2}s"><b>${i + 1}번${i === 6 ? ' · 나' : ''}</b><span>${v[0]}</span><small>${v[1]}</small></div>`).join('')}${mine ? '' : '<div class="seat me empty"><b>7번 · 나</b><span>?</span></div>'}</div>
        ${!mine ? `<p class="q">내 평결은? 가장 중요하게 본 근거 하나를 고르자.</p><div class="opts">${RS.map((r, i) => `<button class="opt" data-r="${i}"><b class="${r[0] === '유죄' ? 'pros' : 'def'}">${r[0]}</b> · ${r[1]}</button>`).join('')}</div>`
        : `<div class="keybox"><p>평결 <b>유죄 ${gn} · 무죄 ${7 - gn}</b></p><p>배심원마다 <b>중요하게 본 증거</b>가 달랐다. 전원 일치가 안 되면 판사의 의견을 들은 뒤 <b>다수결</b>로 평결한다.</p></div><p class="q">이 평결은 판사를 구속할까?</p>${optList(['평결은 법원을 기속하지 않지만, 판사는 최대한 존중해야 한다', '평결대로 판결해야 한다', '평결은 아무 의미가 없다'])}`}<div id="fb"></div>`);
      if (!mine) return $$('[data-r]').forEach(b => b.onclick = () => { mine = RS[+b.dataset.r]; draw(); });
      $$('.opt').forEach(b => b.onclick = () => { if (+b.dataset.i === 0) { b.classList.add('right'); $$('.opt').forEach(x => x.disabled = true); fbSet(okBox(st, '배심원의 평결과 양형 의견은 <b>법적 구속력이 없다.</b> 하지만 판사는 법정 공방을 지켜보고 토론해 내린 의견을 <b>최대한 존중</b>해야 한다. 이를 통해 국민의 사법 주권이 보장된다.')); } else wrong(b); });
    };
    draw();
  },
  syllogism(st, s) {
    const adm = s.adm || {}; const inEv = evidenceCards(s).filter(c => adm[c.k] !== false); const has = k => inEv.some(c => c.k === k);
    const laws = [[LAW.c257, true], [['형법 제250조 제1항', '사람을 살해한 자는 사형, 무기 또는 5년 이상의 징역에 처한다.'], false], [['민법 제750조', '고의 또는 과실로 인한 위법행위로 타인에게 손해를 가한 자는 그 손해를 배상할 책임이 있다.'], false]];
    // 소전제 후보: 증거로 확인된 사실만. 증명해야 할 결론과 여론은 빼내야 한다.
    const real = [['diag', '한소망 씨는 손목에 6주 치료가 필요한 상해를 입었다', '진단서'], has('victim') && ['victim', '피해자는 범인의 체격이 피고인과 비슷했다고 진술했다', '피해자 진술'],
      has('shopcctv') && ['shopcctv', '분식집 CCTV에 후드를 쓴 사람의 흐린 체형이 찍혔다', '분식집 CCTV'], has('hood') && ['hood', '피고인은 사건 다음 날 낡은 후드티를 버렸다', '주민 진술'],
      ['wage', '피고인은 한 달 전 피해자와 임금 문제로 다투었다', '진술 조서'], has('texts') && ['texts', '피고인은 “돈 안 주면 가만 안 있을 거예요”라는 문자를 보냈다', '휴대전화 문자'],
      has('conf') && ['conf', '피고인은 신문 끝에 “제가 했다고 할게요”라고 말했다', '자백 조서'], has('cctv2') && ['cctv2', '사건 직전 골목에 왼손으로 담배를 피우던 다른 남자가 있었다', '주변 상가 CCTV'],
      has('wit') && ['wit', '목격자는 범인이 왼손으로 휘둘렀다고 진술했다', '목격자 진술'], has('loc') && ['loc', '사건 시각 피고인의 휴대전화는 집 부근에 있었다', '위치 기록'],
      has('dna') && ['dna', '현장 담배꽁초의 DNA는 피고인의 것과 다르다', 'DNA 감정']].filter(Boolean);
    const X = [['x1', '피고인이 피해자를 폭행하여 상해를 입혔다', '이 문장은 <b>증명해야 할 결론</b>이다. 소전제에 미리 넣으면 결론을 근거로 쓰는 셈이 된다.'], ['x2', '동네 사람들 대부분이 피고인을 범인이라고 생각한다', '<b>여론은 증거가 아니다.</b> 판사는 법정에 나온 증거로만 판단한다.']];
    const facts = [...real]; facts.splice(1, 0, X[0]); facts.splice(Math.min(4, facts.length), 0, X[1]);
    const nameOf = k => (real.find(r => r[0] === k) || [])[2];
    // 합리적 의심: 의심마다, 그것을 풀어 줄 증거를 직접 연결해야 한다
    const LINK = ['victim', 'shopcctv', 'hood', 'wage', 'texts', 'conf'].filter(k => k === 'wage' || has(k));
    const D = [['face', '범인의 얼굴을 본 사람이 없다', ['victim', 'shopcctv', 'hood'], '얼굴 대신 <b>여러 간접 증거</b>가 같은 사람을 가리킨다고 보았다. 이 판단의 이유는 판결문에 남는다.'],
      has('conf') && ['conf', '자백만으로는 유죄가 될 수 없다', ['victim', 'shopcctv', 'hood'], '자백을 뒷받침하는 <b>보강 증거</b>가 있다고 보았다.'],
      has('cctv2') && ['cctv2', '사건 직전 골목에 다른 남자가 있었다', [], 'CCTV 속 남자가 누구인지 밝혀지지 않는 한 이 의심은 남는다.'],
      has('wit') && ['wit', '범인은 왼손을 썼다. 피고인은 오른손잡이라고 했다', [], '체격이나 동기는 ‘왼손’과 ‘오른손잡이’의 어긋남을 풀어 주지 못한다.'],
      has('loc') && ['loc', '그 시각 피고인의 휴대전화는 집 부근에 있었다', [], '휴대전화를 두고 나왔다는 증거가 따로 있어야 한다.'],
      has('dna') && ['dna', '현장 담배꽁초 DNA가 피고인과 다르다', [], '다른 사람의 DNA가 왜 현장에 있는지 설명하는 증거가 없다.']].filter(Boolean);
    const dz = {}; let major = null; const out = new Set(); let firstScale = true; let linking = null;
    const draw = () => {
      const allDone = D.every(([k]) => dz[k]); const anyLeft = D.some(([k]) => dz[k] === 'left'); const factsDone = out.size === X.length;
      const ready = major === 0 && factsDone && allDone;
      paint(st, s, dlg('dh~', '진실을 알고 싶은 마음만으로 유죄를 선고할 수는 없다. 증명된 사실로만 판단한다.'), `${scaleHtml(s, null, firstScale)}<div class="syl">
        <div class="slot"><h4>① 대전제 · 적용할 법</h4>${laws.map(([l], i) => `<button class="opt ${major === i ? 'sel' : ''}" data-l="${i}"><b>${l[0]}</b><small>${l[1]}</small></button>`).join('')}</div>
        <div class="slot s2"><h4>② 소전제 · 증거로 확인된 사실만 남기자</h4><p class="hint">증거로 확인된 사실이 <b>아닌</b> 문장 2개를 골라 빼자.</p><div class="ifb"></div>
          ${facts.map(([k, t, src]) => `<button class="opt fact ${out.has(k) ? 'struck' : ''}" data-f="${k}" ${out.has(k) ? 'disabled' : ''}>${t}${src && !k.startsWith('x') ? `<small>${src}</small>` : ''}</button>`).join('')}</div>
        <div class="slot"><h4>③ 합리적 의심 점검</h4><p class="hint">의심마다 판단하자. ‘풀린다’고 하려면 <b>그 의심을 풀어 주는 증거</b>를 골라야 한다.</p>
          ${D.map(([k, txt]) => `<div class="clsrow doubt ${dz[k] ? 'placed' : ''}" data-k="${k}"><p><b>의심</b> ${txt}${dz[k] && dz[k] !== 'left' ? `<small class="okby">✓ ${dz[k]}(으)로 풀린다고 판단</small>` : ''}</p>
            <div class="bins"><button class="bin ${dz[k] === 'left' ? 'sel' : ''}" data-d="${k}" data-v="left">의심이 남는다</button><button class="bin ${dz[k] && dz[k] !== 'left' ? 'sel' : ''}" data-d="${k}" data-v="ok">다른 증거로 풀린다</button></div>
            <div class="ifb"></div>${linking === k ? `<div class="linkbox"><small>어떤 증거가 이 의심을 풀어 주나?</small><div class="bins">${LINK.filter(x => !(k === 'conf' && x === 'conf')).map(x => `<button class="bin" data-lk="${x}">${x === 'wage' ? '임금 다툼' : nameOf(x)}</button>`).join('')}</div></div>` : ''}</div>`).join('')}</div>
        <div class="slot"><h4>④ 결론</h4><p class="q sm">‘피고인이 피해자를 폭행해 상해를 입혔다’는 사실이 <b>합리적 의심 없이</b> 증명되었는가?</p>
          <div class="row"><button class="btn" id="acq" ${ready ? '' : 'disabled'}>증명되지 않았다 · 무죄</button><button class="btn seal" id="gui" ${ready && !anyLeft ? '' : 'disabled'}>증명되었다 · 유죄</button></div>
          <p class="hint">${!ready ? '①~③을 먼저 마치자.' : anyLeft ? '의심이 남았다. 범죄 사실은 합리적 의심이 없을 정도로 증명되어야 한다(형사소송법 제307조 제2항). <b>유죄를 선고할 수 없다.</b>' : '모든 의심이 다른 증거로 풀린다고 판단했다. 정말 그런지 한 번 더 생각해 보자.'}</p></div></div><div id="fb"></div>${lawCards(st.cards)}`);
      firstScale = false;
      $$('[data-l]').forEach(b => b.onclick = () => { const i = +b.dataset.l; if (!laws[i][1]) return wrong(b, '이 사건은 상해 사건이다. 맞는 형법 조문을 고르자.'); major = i; draw(); });
      $$('[data-f]').forEach(b => b.onclick = () => { const k = b.dataset.f; const x = X.find(y => y[0] === k);
        if (!x) return wrong(b, `이것은 <b>${nameOf(k)}</b>(으)로 확인된 사실이다. 소전제에 남긴다.`); out.add(k); draw(); $('.s2 .ifb').innerHTML = `<div class="fb ok">${x[2]}</div>`; });
      $$('[data-d]').forEach(b => b.onclick = () => { const k = b.dataset.d; if (b.dataset.v === 'left') { dz[k] = 'left'; linking = null; } else linking = linking === k ? null : k; draw(); });
      $$('[data-lk]').forEach(b => b.onclick = () => { const k = linking, x = b.dataset.lk, d = D.find(y => y[0] === k); const nm = x === 'wage' ? '임금 다툼' : nameOf(x);
        if (!d[2].includes(x)) { const row = $(`.doubt[data-k="${k}"]`); return wrong(row, d[2].length ? `<b>${nm}</b>${jong(nm) ? '은' : '는'} 이 의심에 답하지 못한다. ${x === 'wage' || x === 'texts' ? '동기는 범인일 가능성을 높일 뿐, 그날 밤 누가 했는지 보여 주지 않는다.' : '자백을 자백으로 뒷받침할 수는 없다.'}` : `<b>${nm}</b>${jong(nm) ? '은' : '는'} 이 의심을 풀지 못한다. ${d[3]}`, 2600); }
        dz[k] = nm; linking = null; draw(); $(`.doubt[data-k="${k}"] .ifb`).innerHTML = `<div class="fb ok">${d[3]}</div>`; });
      const fin = v => { decide(st, s, v); showResult(v ? '주문. 피고인은 유죄.' : '주문. 피고인은 무죄.', v ? '남은 의심이 모두 다른 증거로 풀린다고 보고, 증명된 사실에 형법 제257조 제1항을 적용했다. 이어서 형을 정한다.' : '피고인이 범인이라는 사실은 <b>합리적 의심 없이 증명되지 않았다.</b> 증명이 없으면 무죄다(무죄 추정).' + (s.heldAtTrial ? ' 구속되어 있던 윤재는 법정에서 풀려났다.' : ''), st.cards,
        `<div class="mindline"><b>이도현 판사 · 속마음</b><p>${v ? '의심이 모두 풀렸다고 판단했다. 이 판결문이 그 판단을 끝까지 증명해야 한다.' : '진범이 아직 밖에 있을지도 모른다. 그래도 증명되지 않은 죄로 사람을 벌할 수는 없다.'}</p></div>`); fx('flash'); };
      $('#acq').onclick = () => fin(0); $('#gui').onclick = () => fin(1);
    };
    draw();
  },
  sentence(st, s) { sentenceUI(st, s); },
  comp(st, s) {
    const rows = ['구금 + 혐의 없음 불송치 결정', '구금 + 혐의 없음 불기소 처분', '구금 + 무죄 확정 판결', '구금 + 재심에 따른 무죄 확정 판결', '해당 없음 · 구금된 적이 없다'];
    const ans = !s.everHeld ? 4 : s.appeal === 'keep' ? 3 : 2;
    paint(st, s, dlg('nar', `윤재의 기록: ${s.everHeld ? '구금된 적 있음(이야기 속 ' + s.days + '일)' : '구금된 적 없음'} · ${s.appeal === 'keep' ? '유죄 확정 뒤 재심 무죄' : '무죄 확정'}. 형사 보상을 청구할 수 있을까?`),
      `<p class="hint">교과서 81쪽 ‘형사 보상을 청구할 수 있는 경우’에서 윤재에게 맞는 칸을 고르자.</p>${optList(rows)}<div id="fb"></div>`);
    $$('.opt').forEach(b => b.onclick = () => { const i = +b.dataset.i; if (i === ans) { $$('.opt').forEach(x => x.disabled = true); b.classList.add('right'); fbSet(okBox(st, ans === 4 ? '형사 보상은 구금에 대한 보상이다. 한 번도 구금되지 않았다면 대상이 아니다.' : '윤재는 국가를 상대로 구금에 대한 보상을 청구할 수 있다. 청구했다고 자동으로 지급되는 것은 아니다.')); } else wrong(b, '윤재가 구금된 적이 있는지, 어떤 결과로 무죄가 되었는지 다시 보자.'); });
  },
  card(st, s) {
    const c = st.check;
    const body = st.p.split('\n').map(x => `<p>${x}</p>`).join('');
    const tok = st.fx === 'tokens' ? `<div class="tokshow">${'●'.repeat(4)}<small>토큰 하나 = 수사할 수 있는 하루</small></div>` : '';
    paint(st, s, dlg('nar', st.h), `<div class="result"><h3>${st.h}</h3>${body}${tok}</div>${c ? `<p class="q">${c.q}</p>${optList(c.opts)}<div id="fb"></div>` : lawCards(st.cards) + nextBtn()}`);
    if (c) $$('.opt').forEach(b => b.onclick = () => { if (+b.dataset.i === c.ans) { b.classList.add('right'); $$('.opt').forEach(x => x.disabled = true); fbSet(okBox(st, '')); } else wrong(b); });
    else bindNext();
  },
  save(st, s) {
    const code = encode(S.log);
    paint(st, s, `<div class="titlecard"><small>저장</small><h1>${st.h}</h1><p>${st.p}</p></div>`, `<div class="result"><h3>이어하기 코드</h3><p class="code">${code.replace(/(.{4})/g, '$1 ').trim()}</p><p class="hint">같은 기기로 다음 시간에 들어오면 자동으로 이어진다. 다른 기기를 쓸 때만 메뉴(≡)에서 이 코드를 입력한다. 코드에는 선택 기록만 들어 있고 이름은 없다.</p></div>${nextBtn()}`); bindNext();
  },
  gate(st, s) {
    if (META.teacher || META.gates[st.id]) return go();
    const syl = [...st.word]; const got = []; let k = 0; const order = mix(syl.length, 5); let tries = 0;
    const queue = st.qs.map((_, i) => ({ i, n: 0 })); let miss = 0;
    const ask = it => { const [q, o, a] = st.qs[it.i]; const m = mix(o.length, (q.length + it.n * 3) % 11); return [q, m.map(j => o[j]), m.indexOf(a)]; };
    const tiles = () => `<div class="tiles">${order.map(i => `<span class="tile ${got.includes(i) ? 'on' : ''}">${got.includes(i) ? syl[i] : '?'}</span>`).join('')}</div>`;
    const recap = `<details class="gloss recapd" open><summary>${CHNAME[st.ch]} 정리</summary><dl class="recap">${st.recap.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl></details>`;
    const draw = () => {
      if (queue.length) {
        const it = queue[0]; const [q, o, a] = ask(it);
        paint(st, s, `<div class="titlecard"><small>${CHNAME[st.ch]} · 정리 퍼즐</small><h1>암호 조각 ${got.length}/${syl.length}</h1>${tiles()}</div>`,
          `${recap}<p class="q">${q}</p>${optList(o)}<p class="hint">한 번에 맞혀야 조각을 얻는다. 틀리면 3초 동안 고를 수 없고, 그 문제는 보기 순서가 바뀌어 맨 뒤로 간다.${miss ? ` · 틀린 횟수 ${miss}` : ''}</p><div id="fb"></div>`);
        $$('.opt').forEach(b => b.onclick = () => { if (+b.dataset.i === a) { got.push(it.i); queue.shift(); k++; draw(); fx('flash'); return; }
          miss++; it.n++; queue.push(queue.shift()); wrong(b, '조각을 얻지 못했다. 위의 정리 카드를 다시 읽어 보자. 이 문제는 뒤에 다시 나온다.', 3000);
          let sec = 3; const tick = setInterval(() => { sec--; const c = $('#chk2'); if (sec <= 0) { clearInterval(tick); draw(); } else if (c) c.textContent = sec; }, 1000);
          $('#fb').insertAdjacentHTML('beforeend', '<p class="hint">다음 문제까지 <b id="chk2">3</b>초</p>'); });
      } else {
        paint(st, s, `<div class="titlecard"><small>${CHNAME[st.ch]} · 정리 퍼즐</small><h1>조각을 모두 모았다</h1>${tiles()}</div>`,
          `<p class="q">흩어진 네 글자를 바른 순서로 맞춰 암호를 입력하자.</p><p class="hint" id="mh">${tries >= 2 ? '뜻: ' + st.meaning : '이 장에서 배운 핵심 원칙의 이름이다.'}</p>
          <div class="row"><input id="gw" placeholder="네 글자 암호" autocomplete="off"><button class="btn" id="gb">열기</button></div>
          ${META.lock ? `<div class="row"><input id="tw" placeholder="선생님 확인 암호" autocomplete="off"></div>` : ''}<div id="fb"></div>`);
        const tryIt = () => { const w = $('#gw').value.replace(/\s/g, '');
          if (w !== st.word) { tries++; if (tries >= 2) $('#mh').textContent = '뜻: ' + st.meaning; return wrong($('#gw'), '순서가 맞지 않는다.'); }
          if (META.lock && $('#tw').value.trim() !== TEACH[st.id]) return wrong($('#tw'), '선생님 확인 암호를 기다리자. 다 같이 다음 장으로 넘어간다.');
          META.gates[st.id] = true; setPanel(`<div class="result"><h3>${st.word}</h3><p>${st.meaning}</p></div>${nextBtn('다음 장으로')}`); bindNext(); fx('zoom'); };
        $('#gb').onclick = tryIt; $('#gw').onkeydown = e => { if (e.key === 'Enter') tryIt(); };
      }
    };
    draw();
  },
  ending(st, s) {
    const DW = ['', '하루', '이틀', '사흘', '나흘', '닷새', '엿새', '이레', '여드레', '아흐레', '열흘']; const dw = s.days <= 10 ? DW[s.days] : s.days + '일';
    const jong = w => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c <= 11171 ? c % 28 !== 0 : /[0136789]$/.test(w) || /일$/.test(w); };
    const name = s.appeal === 'keep' ? '1년 뒤의 새벽' : s.v1 === 'guilty' ? '두 번째 저울' : s.heldAtTrial ? '긴 겨울' : s.everHeld ? dw + '의 밤' : '돌아갈 집';
    const line = { '1년 뒤의 새벽': '진실은 끝내 왔다. 너무 늦게.', '두 번째 저울': '한 번의 재판만 있었다면 나는 어떻게 됐을까.', '긴 겨울': '무죄는 받았지만, 그 계절은 돌아오지 않는다.', '돌아갈 집': '갇히지는 않았지만, 범인으로 의심받은 시간은 짧지 않았다.' }[name] || `${dw}${jong(dw) ? '이었' : '였'}지만, 다시는 겪고 싶지 않은 밤이었다.`;
    const ev = evidenceCards(s).map(c => `${c.name}${c.illegal ? '(영장 없음)' : ''}`).join(', ');
    paint(st, s, `<div class="titlecard"><small>엔딩</small><h1>${name}</h1><p>“${line}”</p></div>`, `<div class="result rec"><h3>사건 기록부</h3><ul>
      <li>구금: ${s.everHeld ? `있음 · 이야기 속 ${s.days}일` : '없음'}</li><li>쓴 권리: 진술 거부 ${s.used.silent}회 · 변호인 ${s.lawyer ? '있음' : '없음'} · 구속 적부심 ${s.tsv ? '청구' : '없음'} · 보석 ${s.bail ? '허가' : s.bail === false ? '기각' : '해당 없음'}</li>
      <li>법정에 나온 증거: ${ev}</li><li>검사의 구형: ${SEN.txt(s.demand) || '없음'}</li>
      <li>1심: ${s.v1 === 'acq' ? '무죄' : '유죄 · ' + SEN.txt(s.s1o || s.s1)} · 최종: ${s.appeal === 'keep' ? '유죄 확정(' + SEN.txt(s.s1) + ') → 재심 무죄' : s.appeal === 'fix' ? '항소심 무죄' : '무죄 확정'}</li>
      <li>오태식에게 정한 형: ${SEN.txt(s.real)}</li><li>판단 문제에서 다시 생각한 횟수: ${META.wrong}</li></ul></div>
      ${nextTaskBox()}`);
    $('#todex').onclick = nextTask;
  },
};

function verdictLine(s) {
  const d = [s.ev.cctv && 'CCTV 속 다른 남자', s.ev.wit && '왼손으로 휘둘렀다는 목격자', s.alibi && '“집에 있었다”는 말'].filter(Boolean);
  return `피해자의 지목, 비슷한 체격, 버린 후드티${s.phone ? ', 거친 문자' : ''}${s.conf ? ', 그리고 자백' : ''}. 하지만 범인의 얼굴을 본 사람은 아무도 없다.` + (d.length ? ` 게다가 ${d.join(', ')}까지 있다. 이걸로 범인이라고 할 수 있을까.` : ' 반대쪽을 가리키는 증거는 없다. ……내가 찾지 않은 것일 수도 있다.') + ' 범인을 잡는 것도 중요하지만, 잘못된 사람을 범인으로 만들지 않는 것도 내 일이다.';
}
// ───────── 3장 기록 조각
function reviewItems(s) {
  const I = [['진단서 · 한소망 씨 손목 상해, 6주 치료', 0], ['피해자 진술 · “얼굴은 못 봤지만, 체격이 윤재와 비슷했어요”', 1], ['분식집 CCTV · 후드를 쓴 사람의 흐린 체형', 1], ['주민 진술 · 다음 날 낡은 후드티를 버리는 윤재를 보았다', 1]];
  if (s.phone === 'warrant') I.push(['휴대전화 문자 · “돈 안 주면 가만 안 있을 거예요” (압수·수색 영장 있음)', 1]);
  if (s.phone === 'nowarrant') I.push(['휴대전화 문자 · “돈 안 주면 가만 안 있을 거예요” (영장 없이 열어 봄)', 3]);
  if (s.conf) I.push(['자백 조서 · “그냥…… 제가 했다고 할게요.”', 1]);
  if (s.alibi) I.push(['신문 조서 · “그 시각 집에 있었다”', 2]);
  if (s.right) I.push(['신문 조서 · “나는 오른손잡이다”', 2]);
  if (s.ev.cctv) I.push(['주변 상가 CCTV · 사건 직전 왼손으로 담배를 피우며 기다리는 남자', 2]);
  if (s.ev.wit) I.push(['목격자 민서 · “범인은 왼손으로 휘둘렀어요”', 2]);
  return I;
}
function indictPieces(s) {
  const P = [{ k: 'diag', t: '진단서 · 손목 상해, 6주 치료', slot: 0 }, { k: 'victim', t: '피해자 진술 · “얼굴은 못 봤지만 체격이 윤재와 비슷했다”', slot: 1 },
    { k: 'shopcctv', t: '분식집 CCTV · 후드를 쓴 사람의 흐린 체형', slot: 1 }, { k: 'hood', t: '주민 진술 · 다음 날 후드티를 버리는 윤재', slot: 1 }, { k: 'wage', t: '임금 다툼 · 한 달 전 밀린 임금 문제로 다투고 그만둠', slot: 2 }];
  if (s.phone === 'warrant' || (s.phone === 'nowarrant' && !s.pexcl)) P.push({ k: 'texts', t: '휴대전화 문자 · “돈 안 주면 가만 안 있을 거예요”' + (s.phone === 'nowarrant' ? ' (영장 없음)' : ''), slot: 2, illegal: s.phone === 'nowarrant' });
  if (s.conf) P.push({ k: 'conf', t: '자백 조서 · “제가 했다고 할게요”', slot: 1 });
  return P;
}
function doubts(s) {
  return [s.alibi && '윤재는 그 시각 집에 있었다고 말했다', s.right && '윤재는 오른손잡이라고 말했다', s.ev.cctv && '주변 상가 CCTV에 왼손으로 담배를 피우던 다른 남자가 있다', s.ev.wit && '목격자는 범인이 왼손으로 휘둘렀다고 했다', s.ev.dna && '담배꽁초 DNA 감정 결과가 아직 오지 않았다'].filter(Boolean);
}
function boardHtml(s) {
  const c = evidenceCards(s);
  const chips = c.map(x => `<span class="chip ${x.side}">${x.name}${x.illegal ? ' ⚠영장 없음' : ''}</span>`).join('') + (s.ev.dna ? '<span class="chip wait">DNA 감정 · 결과 기다리는 중</span>' : '') + (s.phone === 'warrant' ? '<span class="chip wait">위치 기록 · 통신사 회신 기다리는 중</span>' : '');
  return `<div class="board"><h4>수사 보드</h4><div>${chips}</div><p class="hint"><span class="chip pros sm">윤재를 가리킴</span> <span class="chip def sm">윤재가 아닐 수 있음</span> <span class="chip wait sm">아직 결과 없음</span></p></div>`;
}

// ───────── 형량 정하기: 종류 · 기간 · 집행 유예 · 보안 처분을 직접 조정하고 확정한다
function sentenceUI(st, s) {
  const mode = st.mode; const base = mode === 'appeal' && s.s1 ? s.s1 : { kind: '징역', m: 12, susp: false, sec: 0 };
  let x = { kind: base.kind, m: base.m || 12, y: base.y || 2, won: base.won || 300, susp: !!base.susp, sec: base.sec || 0 };
  let askedCombo = mode !== 'demand'; let moved = false;
  // 형의 종류와 양형 사정을 먼저 따진다. 양형 기준 영역은 학생이 판단한 사정에서 나온다.
  let kindOk = mode === 'appeal'; const FX = senFactors(mode); const fm = FX.map(() => null);
  let Z = [4, 18, '기본 영역'];
  const setZ = () => { Z = FX.some((f, i) => f[1] === 1 && fm[i] === 1) ? [6, 30, '가중 영역(중한 상해)'] : [4, 18, '기본 영역']; };
  const cur = () => x.kind === '징역' ? { kind: '징역', m: x.m, susp: x.susp && x.m <= 36, sec: x.susp && x.m <= 36 ? x.sec : 0 } : x.kind === '자격정지' ? { kind: '자격정지', y: x.y } : { kind: '벌금', won: x.won };
  const status = () => {
    const c = cur();
    if (mode === 'appeal' && SEN.heavy(c) > SEN.heavy(s.s1)) return ['bad', '1심 형보다 무겁다. 피고인만 항소한 사건이라 원심보다 무거운 형을 선고하지 못한다(불이익 변경 금지).'];
    if (c.kind !== '징역') return ['ok', '법정형 안이다. 형법 제257조 제1항은 징역, 자격 정지, 벌금 가운데 하나를 고르게 한다.'];
    const inZ = c.m >= Z[0] && c.m <= Z[1];
    return inZ ? ['ok', `법정형 안이고 양형 기준 ${Z[2]}(${mm(Z[0])}~${mm(Z[1])}) 안이다.`] : ['warn', `법정형 안이지만 양형 기준 ${Z[2]}(${mm(Z[0])}~${mm(Z[1])})을 벗어났다. 선고할 수는 있지만, 판결문에 그 이유를 밝혀야 한다.`];
  };
  const head = { demand: '서지우 검사 · 구형', first: '이도현 판사 · 1심 형 선고', appeal: '항소심 판사 · 형 다시 정하기', real: '이도현 판사 · 오태식의 형' }[mode];
  const draw = () => {
    if (!askedCombo) {
      paint(st, s, dlg(st.who || 'dh', val(st.q, s)), `<div class="result"><h3>먼저 조문을 보자</h3><p>${LAW.c257[1]}</p></div><p class="q">상해죄에서 징역과 벌금을 함께 정할 수 있을까?</p>
        ${optList(['없다 · 조문이 ‘또는’으로 이어져 있어 셋 가운데 하나를 고른다', '있다 · 징역과 벌금을 더해서 정할 수 있다'])}<div id="fb"></div>`);
      $$('.opt').forEach(b => b.onclick = () => { if (+b.dataset.i === 0) { askedCombo = true; draw(); } else wrong(b, '조문의 ‘또는’을 다시 보자. 징역, 자격 정지, 벌금 가운데 하나를 고르는 구조다.'); });
      return;
    }
    if (!kindOk) {
      const who = mode === 'real' ? '오태식' : '윤재';
      paint(st, s, dlg(st.who || 'dh', `${who}에게 어떤 종류의 형이 맞을까? 법정형은 셋 다 허용한다. 이유를 따져 고르자.`), `<div class="keybox"><p><b>사건</b> 손목에 6주 치료가 필요한 상해${mode === 'real' ? ' · 후유 장애 소견' : ''} · 피해 회복 기록 없음</p></div>
        <p class="q">형의 종류와 그 이유는?</p>${optList(['<b>징역</b> · 신체에 큰 피해를 준 책임을 묻는다', '<b>벌금</b> · 피해가 가볍고 피해도 회복되었다', '<b>자격 정지</b> · 공무원이 될 자격, 선거권 등을 정지한다'])}<div id="fb"></div>`);
      $$('.opt').forEach(b => b.onclick = () => { const i = +b.dataset.i; if (i === 0) { kindOk = true; x.kind = '징역'; return draw(); }
        wrong(b, i === 1 ? '이 사건과 맞지 않는 이유다. <b>6주 치료</b>가 필요한 상해이고, <b>피해 회복 기록도 없다.</b>' : '자격 정지는 <b>일정한 자격</b>을 정지하는 형이다(형법 제43조·제44조). 손목 상해에 대한 책임과는 거리가 멀다.', 2600); });
      return;
    }
    if (fm.some(v => v === null)) {
      paint(st, s, dlg(st.who || 'dh', '형의 크기를 정하기 전에, 형을 무겁게 할 사정이 있는지 따져 보자.'), `<p class="q">각 사정은 형을 <b>무겁게 하는 사정(가중 요소)</b>일까?</p>
        <div class="cls">${FX.map((f, i) => `<div class="clsrow ${fm[i] !== null ? 'placed' : ''}" data-i="${i}"><p>${f[0]}${fm[i] !== null ? `<small class="okby">${f[2]}</small>` : ''}</p><div class="bins"><button class="bin ${fm[i] === 1 ? 'sel' : ''}" data-m="1" ${fm[i] !== null ? 'disabled' : ''}>무겁게 하는 사정</button><button class="bin ${fm[i] === 0 ? 'sel' : ''}" data-m="0" ${fm[i] !== null ? 'disabled' : ''}>해당 없음</button></div></div>`).join('')}</div>
        <p class="hint">양형 기준의 ‘중한 상해’는 형법 제258조의 ‘중상해죄’와 다른 말이다.</p><div id="fb"></div>`);
      $$('.clsrow').forEach(r => $$('[data-m]', r).forEach(b => b.onclick = () => { const i = +r.dataset.i, m = +b.dataset.m; if (FX[i][1] !== m) return wrong(r, FX[i][2], 2600); fm[i] = m; setZ(); draw(); }));
      return;
    }
    const c = cur(); const [lv, msg] = status();
    const rng = x.kind === '징역' ? [1, 84, 1, x.m, '개월'] : x.kind === '자격정지' ? [1, 10, 1, x.y, '년'] : [5, 1000, 5, x.won, '만 원'];
    const zones = x.kind === '징역' ? `<div class="zones"><span class="zone z1" style="left:${pc(2)}%;width:${pc(8)}%" title="감경 2~10개월"></span><span class="zone z2" style="left:${pc(4)}%;width:${pc(14)}%" title="기본 4~18개월"></span><span class="zone z3" style="left:${pc(6)}%;width:${pc(24)}%" title="가중 6~30개월"></span><span class="zone z4" style="left:0;width:${pc(36)}%" title="집행 유예 가능 3년 이하"></span></div>
      <div class="legend"><span class="k1">감경 2~10개월</span><span class="k2">기본 4~18개월</span><span class="k3">가중 6~30개월</span><span class="k4">집행 유예 가능 3년 이하</span></div>` : '';
    const suspOk = x.kind === '징역' && x.m <= 36;
    paint(st, s, dlg(st.who || 'dh', val(st.q, s)), `<div class="sen"><div class="senhead">${head}${mode === 'appeal' ? ` · 1심 형: <b>${SEN.txt(s.s1)}</b>` : ''}${mode === 'first' && s.demand ? ` · 검사의 구형: <b>${SEN.txt(s.demand)}</b> <small>(참고만 한다. 따를 의무는 없다)</small>` : ''}</div>
      ${mode !== 'appeal' ? `<p class="hint">판단한 사정 → <b>${Z[2]} ${mm(Z[0])}~${mm(Z[1])}</b></p>` : ''}
      <div class="tabs">${['징역', '자격정지', '벌금'].map(k => `<button class="tab ${x.kind === k ? 'sel' : ''}" data-k="${k}">${k === '자격정지' ? '자격 정지' : k}</button>`).join('')}</div>
      <div class="bigv">${SEN.txt(c)}</div>
      ${moved ? '' : '<p class="dragcue">◀ 동그라미를 끌어 보자 ▶</p>'}<div class="track2 ${lv} ${moved ? '' : 'pulse'}"><input type="range" id="rg" min="${rng[0]}" max="${rng[1]}" step="${rng[2]}" value="${rng[3]}" aria-label="형의 크기">${zones}</div>
      <div class="ends"><span>${rng[0]}${rng[4]}</span><span>법정형 최대 ${x.kind === '징역' ? '7년' : x.kind === '자격정지' ? '10년' : '1천만 원'}</span></div>
      ${x.kind === '징역' ? `<div class="extra"><button class="sw ${x.susp && suspOk ? '' : 'off'}" id="susp" ${suspOk ? '' : 'disabled'}>집행 유예 ${x.susp && suspOk ? '켬' : '끔'}</button>${suspOk ? '' : '<small>징역 3년 이하일 때만 가능</small>'}
        ${x.susp && suspOk ? ['보호 관찰', '사회봉사 명령', '수강 명령'].map((t, i) => `<button class="sw ${x.sec & (1 << i) ? '' : 'off'}" data-b="${i}">${t}</button>`).join('') : ''}</div>` : ''}
      <div class="status ${lv}">${msg}</div>
      <details class="gloss"><summary>막대는 왜 있을까?</summary><p>막대 전체는 법이 허용하는 범위, 곧 법정형이다(상해죄: 7년 이하 징역, 10년 이하 자격 정지, 1천만 원 이하 벌금). 판사는 이 범위를 벗어난 형을 선고할 수 없다. 색 구간은 대법원 양형위원회가 정한 일반 상해의 양형 기준으로, 판사가 참고하는 권고 범위다. 벌금 500만 원 이하도 집행 유예가 가능하지만, 이 게임에서는 징역에만 집행 유예를 붙인다.</p></details>
      ${mode !== 'appeal' ? `<details class="gloss"><summary>양형 기준, 왜 이 정도일까? 너무 약하지 않을까?</summary>
        <p>양형 기준은 대법원 양형위원회가 정한 권고 기준이다. 비슷한 사건에 비슷한 형이 나오도록 하려고 만든다. 법정형(징역 7년 이하)이 모든 상해 사건을 담는 그릇이라면, 양형 기준은 그중 ‘일반 상해’ 사건에서 실제로 쓰이는 범위를 좁혀 둔 것이다.</p>
        <p><b>가중 영역(6개월~2년 6개월)</b>으로 가는 사정의 예: 중한 상해, 비난할 만한 범행 동기, 잔혹한 범행 수법, 범행에 취약한 피해자, 위험한 물건을 들고 범행, 상습범·동종 누범.</p>
        <p><b>감경 영역(2개월~10개월)</b>으로 가는 사정의 예: 경미한 상해, 피해자에게도 상당한 책임이 있는 경우, 자수, 피해자가 처벌을 원하지 않거나 피해를 실질적으로 회복한 경우.</p>
        <p>판사는 양형 기준을 벗어나 더 무겁게도 정할 수 있다. 다만 그때는 판결문에 이유를 적어야 한다. 그리고 형벌이 피해자 구제의 전부는 아니다. 배상 명령, 범죄 피해자 구조, 신변 보호가 따로 있다(5장).</p>
        <p class="q">생각해 보기: 형벌의 목적은 저지른 잘못만큼 벌하는 것일까, 다시 죄를 짓지 않게 하는 것일까?</p><a class="extlink" href="https://www.scourt.go.kr/sc/krsc/pdf/F18.Crimes_of_Violence(2022).pdf" target="_blank" rel="noopener">양형위원회 원문 자료 보기 (새 창)</a></details>` : ''}
      <div class="row end"><button class="btn" id="ok" ${lv === 'bad' ? 'disabled' : ''}>이 형으로 정한다</button></div></div>${lawCards(st.cards)}`);
    $$('.tab').forEach(b => b.onclick = () => { x.kind = b.dataset.k; draw(); });
    $('#rg').oninput = e => { moved = true; const cue = $('.dragcue'); if (cue) cue.remove(); $('.track2').classList.remove('pulse'); const v = +e.target.value; if (x.kind === '징역') x.m = v; else if (x.kind === '자격정지') x.y = v; else x.won = v; const c2 = cur(); $('.bigv').textContent = SEN.txt(c2); const [l2, m2] = status(); $('.status').className = 'status ' + l2; $('.status').textContent = m2; $('.track2').className = 'track2 ' + l2; $('#ok').disabled = l2 === 'bad'; };
    $('#rg').onchange = () => draw();
    const su = $('#susp'); if (su) su.onclick = () => { x.susp = !x.susp; if (!x.susp) x.sec = 0; draw(); };
    $$('[data-b]').forEach(b => b.onclick = () => { x.sec ^= 1 << +b.dataset.b; draw(); });
    $('#ok').onclick = () => {
      const c2 = cur(); modal(`<h3>이 형으로 확정할까?</h3><p class="bigv">${SEN.txt(c2)}</p><p>${status()[1]}</p><div class="row end"><button class="btn sub" id="mx">고치기</button><button class="btn seal" id="my">확정</button></div>`);
      $('#mx').onclick = closeModal;
      $('#my').onclick = () => { closeModal(); decide(st, s, SEN.enc(c2)); const after = { demand: '구형은 형에 대한 검사의 의견일 뿐, 판사를 구속하지 않는다. 실제 재판에서는 판사가 구형보다 가벼운 형을 선고하는 일이 흔하다. 검사는 처벌해야 할 이유를 중심으로 의견을 내고, 판사는 변호인의 주장과 피고인에게 유리한 사정(형법 제51조의 양형 조건)까지 함께 따져 형을 정하기 때문이다. 법정형 안이라면 구형보다 무거운 형도 선고할 수 있다.', first: '1심 판결이 선고되었다.', appeal: '1심보다 무겁지 않은 범위에서 형을 다시 정했다.', real: c2.kind === '징역' && c2.susp ? '집행 유예를 붙였다. 보호 관찰·사회봉사·수강 명령은 집행 유예에 붙일 수 있는 명령이다(형법 제62조의2). 교과서는 이를 보안 처분으로 다룬다(77쪽).' : '형을 정했다.' }[mode];
        showResult(SEN.txt(c2), after + ' ' + status()[1], st.cards, ''); $('.result').classList.add('sen', 'done'); fx('shake'); };
    };
  };
  draw();
}
function senFactors(mode) {
  if (mode === 'appeal') return [];
  const base = [['손목에 6주 치료가 필요한 상해를 입었다', 0, '6주 치료가 필요하다는 것만으로 ‘중한 상해’가 되지는 않는다. 일반 상해의 기본 사정이다.'],
    ['피해가 회복되지 않았고, 피해자는 처벌을 원한다', 0, '형을 가볍게 할 사정이 없다는 뜻이다. 그 자체로 형을 무겁게 하는 사정은 아니다.']];
  if (mode === 'real') base.splice(1, 0, ['치료 뒤에도 손목에 후유 장애가 남았다는 의사 소견이 있다', 1, '상해가 남긴 결과가 무겁다. 양형 기준의 ‘중한 상해’로 볼 수 있는 사정이다.']);
  return base;
}
const pc = m => m / 84 * 100;
const mm = m => (m >= 12 ? Math.floor(m / 12) + '년' + (m % 12 ? ' ' + m % 12 + '개월' : '') : m + '개월');

function scaleHtml(s, p, anim) {
  const adm = s.adm || {}; const X = s.extraList || [];
  const from = c => ({ victim: '2장 피해자 조사', shopcctv: '2장 분식집 CCTV', hood: '2장 주민 조사', texts: c.illegal ? '2장 영장 없이 열람 → 3장 검사가 넘김' : '2장 압수·수색 영장', conf: '1장 긴 신문 끝 자백',
    cctv2: X.includes('주변 상가 CCTV 확보') ? '3장 검사의 보완 수사 요청' : '2장 수사 토큰', wit: X.includes('목격자 탐문') ? '3장 검사의 보완 수사 요청' : '2장 수사 토큰', loc: '2장 압수·수색 영장', dna: X.includes('담배꽁초 DNA 감정') ? '3장 검사의 보완 수사 요청' : '2장 수사 토큰' })[c.k];
  const cs = evidenceCards(s); const L = cs.filter(c => c.side === 'pros'), R = cs.filter(c => c.side === 'def');
  // 증거를 한쪽씩 번갈아 올린다
  const seq = []; for (let i = 0; i < Math.max(L.length, R.length); i++) { if (L[i]) seq.push(L[i]); if (R[i]) seq.push(R[i]); }
  const order = k => seq.findIndex(c => c.k === k); const STEP = .45;
  const chip = c => `<span class="chip ${adm[c.k] === false ? 'off' : c.side}" style="animation-delay:${(order(c.k) * STEP + .2).toFixed(2)}s">${c.name}<small>${adm[c.k] === false ? '배제됨 · 무게 없음' : from(c)}</small></span>`;
  const miss = [!s.ev.cctv && '주변 상가 CCTV', !s.ev.wit && '목격자', !s.ev.dna && 'DNA 감정', s.phone !== 'warrant' && '휴대전화 위치 기록'].filter(Boolean);
  const hd = hardDoubts(s).length; const side = strongDefense(s) ? 1 : hd ? 0 : -1; const d = (seq.length * STEP + .4).toFixed(2);
  return `<div class="scalebox ${anim ? 'anim' : ''}" style="--t:${side * 3}deg;--ly:${-side * 12}px;--ry:${side * 12}px;--d:${d}s">
    <p class="scalecap">채택된 증거를 양쪽에 정리했다. <b>증거의 개수로 판결이 정해지지는 않는다.</b></p>
    <div class="fulcrum"></div><div class="bar2"></div><div class="beam"><div class="pan l"><h5>윤재가 범인이다</h5>${L.map(chip).join('')}</div><div class="pan r"><h5>범인이 아닐 수 있다</h5>${R.map(chip).join('') || '<small>올라온 증거 없음</small>'}</div></div>
    <div class="scalehint">${miss.length ? `<p class="hint">법정에 오지 못한 증거: ${miss.join(', ')} · 앞 단계에서 확보하지 않았다.</p>` : ''}
    <p class="hint">${side > 0 ? '유죄 쪽 증거로는 <b>풀기 어려운 의심</b>이 여럿 있다.' : side < 0 ? '증거가 한쪽을 가리킨다. 그래도 <b>남은 의심</b>은 없는지 따져야 한다.' : '풀어야 할 의심이 하나 있다. 아래에서 따져 보자.'}</p></div></div>`;
}
const HOW = c => ({ victim: '피해자 진술 조서로 남겼다', shopcctv: '분식집에서 동의를 받아 제출받았다', hood: '주민의 진술 조서로 남겼다', texts: c.illegal ? '영장 없이 휴대전화를 열어 찾았다' : '압수·수색 영장으로 휴대전화를 압수해 찾았다', conf: '진술 거부권을 알린 뒤 신문해 조서로 남겼다', cctv2: '상가에서 동의를 받아 제출받았다', wit: '목격자의 진술 조서로 남겼다', loc: '압수·수색 영장으로 통신사에서 받았다', dna: '현장에서 수거해 봉인한 담배꽁초를 감정했다' }[c.k]);
const DOCS = {
  warrant: () => `<div class="doc"><h4>체 포 영 장</h4><dl><dt>피의자</dt><dd>윤재</dd><dt>죄명</dt><dd>상해</dd><dt>청구</dt><dd>검사 서지우</dd><dt>발부</dt><dd>○○지방법원 판사</dd></dl><span class="docseal">印</span></div>`,
  courts: () => `<div class="org"><b>대법원</b><div><span>고등 법원</span><span>특허 법원</span></div><div><span class="hl">지방 법원</span><span>가정 법원</span><span>행정 법원</span><span>회생 법원</span></div><small>교과서 86쪽 법원 조직</small></div>`,
  levels: () => `<div class="org lv"><div><span>1심 지방 법원·지원 단독 판사</span>→<span>2심 지방 법원 본원 합의부</span>→<span>3심 대법원</span></div><div><span>1심 지방 법원·지원 합의부</span>→<span>2심 고등 법원</span>→<span>3심 대법원</span></div></div>`,
  indict: (s, facts) => `<div class="doc wide"><h4>공 소 장</h4><dl><dt>피고인</dt><dd>윤재</dd><dt>죄명</dt><dd>상해</dd><dt>적용 법조</dt><dd>형법 제257조 제1항</dd><dt>공소 사실</dt><dd>피고인은 사건 당일 밤 11시경 분식집 앞 골목에서 피해자 한소망을 폭행하여 6주의 치료가 필요한 손목 상해를 입혔다.</dd><dt>근거</dt><dd>${facts.join(', ')}</dd><dt>구속 여부</dt><dd>${s.held ? '구속' : '불구속'}</dd></dl><span class="docseal">印</span></div>`,
};

// ───────── 모달
function modal(html) { closeModal(); app.insertAdjacentHTML('beforeend', `<div class="modal" id="modal"><div class="box">${html}</div></div>`); }
function closeModal() { const m = $('#modal'); if (m) m.remove(); }

// ───────── 개념 도감 · 미션 · 메뉴
function missionNeed(m) { return m.need.some(k => META.dex[k] !== 'play'); }
function showDex() {
  const done = S.pos >= IDX.end;
  const n = CONCEPTS.filter(([k]) => META.dex[k] === 'play').length, c = CONCEPTS.filter(([k]) => META.dex[k] === 'card').length;
  const ms = MISSIONS.filter(missionNeed);
  app.innerHTML = `<div class="ch5 shell"><header class="hud"><span class="pill">개념 도감</span><span class="grow"></span><button class="pill ghost" id="back">돌아가기</button></header>
  <section class="panel wide"><h2 class="big">${n === 57 ? '57개 모두 직접 체험' : `직접 체험 ${n} · 카드로 확인 ${c} · 아직 ${57 - n - c}`}</h2>
  <p class="hint">체험하거나 카드로 본 개념을 누르면 뜻과 관련 조문·교과서 내용을 다시 볼 수 있다.</p><div class="dex">${CONCEPTS.map(([k, p]) => `<div class="dc ${META.dex[k] || ''}" title="교과서 ${p}쪽"><b>${k}</b><small>${p}쪽 · ${META.dex[k] === 'play' ? '체험' : META.dex[k] === 'card' ? '카드' : '—'}</small></div>`).join('')}</div>
  ${done ? (ms.length || !META.quiz ? nextTaskBox() : extraMissions()) : '<p class="hint">엔딩을 본 뒤에 ‘가지 않은 길’이 열린다. 엔딩 뒤에는 내 선택으로 겪지 못한 다른 세계를 다녀와 모든 개념을 체험해야 끝난다.</p>'}</section></div>`;
  $('#back').onclick = () => { MIS = null; render(); };
  $$('.dc').forEach((el, i) => { const [k, p] = CONCEPTS[i]; if (!META.dex[k]) return; el.classList.add('open'); el.tabIndex = 0; el.setAttribute('role', 'button');
    const show = () => { const sts = STEPS.filter(x => [...(x.teach || []), ...(x.teachCard || [])].includes(k) || (x.teachFn && x.id === '4-4c' && k === '자백만이 유일한 증거'));
      const seen = new Set(); const cards = sts.flatMap(x => x.cards || []).filter(c => !seen.has(c[0] + c[1]) && seen.add(c[0] + c[1]));
      modal(`<h3>${k}</h3><p class="hint">교과서 ${p}쪽 · ${META.dex[k] === 'play' ? '직접 체험함' : '카드로 확인함'} · ${[...new Set(sts.map(x => CHNAME[x.ch]))].join(', ')}</p><p>${CDEF[k]}</p>${cards.length ? `<div class="laws">${cards.map(([t, x]) => `<details class="law"><summary>${t}</summary><p>${x}</p></details>`).join('')}</div>` : ''}<div class="row end"><button class="btn" id="mx">닫기</button></div>`);
      $('#mx').onclick = closeModal; };
    el.onclick = show; el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } }; });
  $$('[data-m]').forEach(b => b.onclick = () => startMission(MISSIONS.find(m => m.id === b.dataset.m)));
  const td = $('#todex'); if (td) td.onclick = nextTask;
}
// 엔딩 뒤 필수 과정: 남은 개념의 되감기 미션 → 마무리 문제 → 학습 완료
function nextTaskBox() {
  const ms = MISSIONS.filter(missionNeed);
  if (ms.length) { const min = ms.reduce((a, m) => a + m.min, 0);
    return `<div class="result"><h3>아직 끝나지 않았다</h3><p>내가 고른 길에서는 직접 겪지 못한 개념이 있다. 그 개념은 내가 가지 않은 길, 곧 다른 선택이 만든 다른 세계에 있다. 그 세계 ${ms.length}곳(약 ${min}분)을 다녀와야 사건이 완전히 끝난다. 내 사건 기록과 엔딩은 바뀌지 않는다.</p><ul>${ms.map(m => `<li><b>${m.name}</b> · ${m.need.filter(k => META.dex[k] !== 'play').join(', ')}</li>`).join('')}</ul></div><div class="row end"><button class="btn" id="todex">가지 않은 길로 ▸</button></div>`; }
  if (!META.quiz) return `<div class="result"><h3>마지막 관문</h3><p>57개 개념을 모두 직접 겪었다. 마무리 문제 3개를 풀면 끝난다.</p></div><div class="row end"><button class="btn" id="todex">마무리 문제 ▸</button></div>`;
  return `<div class="row end"><button class="btn" id="todex">학습 완료 화면 ▸</button></div>`;
}
function nextTask() { closeModal(); const ms = MISSIONS.filter(missionNeed); if (ms.length) return startMission(ms[0], true); if (!META.quiz) return finalQuiz(); showComplete(); }
function extraMissions() {
  const rest = MISSIONS.filter(m => !META.missions[m.id]);
  return `<div class="result"><h3>학습 완료</h3><p>57개 개념을 모두 직접 체험하고 마무리 문제까지 풀었다.</p></div>${rest.length ? `<h3>더 해 보기 (선택)</h3><p class="hint">내가 가지 않은 다른 길도 겪어 볼 수 있다.</p><div class="opts">${rest.map(m => `<button class="opt" data-m="${m.id}"><b>${m.name}</b> <small>${m.need.join(' · ')} · 약 ${m.min}분</small></button>`).join('')}</div>` : ''}`;
}
function showComplete() {
  const n = CONCEPTS.filter(([k]) => META.dex[k] === 'play').length;
  app.innerHTML = '';
  paint(STEPS[IDX.end], S, `<div class="titlecard"><small>사건 종결</small><h1>학습 완료</h1><p>개념 ${n}/57 직접 체험 · 마무리 문제 완료</p></div>`,
    `<div class="result"><h3>선생님께 이 화면을 보여 주자</h3><p>가지 않은 길 ${Object.keys(META.missions).length}곳을 다녀왔다. 판단 문제에서 다시 생각한 횟수는 ${META.wrong}번이다.</p></div><div class="result"><h3>생각해 보기</h3><p class="hint">정답이 하나로 정해지지 않은 질문이다. 내 생각과 그 이유를 짧게 적어 보자.</p><ol>
      <li>경찰이 범인을 빨리 잡으려는 목적이라면 영장을 생략해도 될까?</li>
      <li>피해자의 진술이 진실이라고 믿더라도 다른 증거를 확인해야 하는 이유는 무엇일까?</li>
      <li>의심이 남아 있던 3장에서, 서지우 검사는 기소했어야 할까?</li>
      <li>배심원 다수가 유죄라고 했는데 판사가 무죄를 선고한다면, 그 판결은 부당한 것일까?</li>
      <li>무죄를 선고받은 윤재는 잃어버린 시간을 보상받을 수 있을까? 무엇으로, 어디까지?</li></ol></div><div class="result"><h3>더 해 보기 (선택)</h3><p>대법원 양형위원회의 ‘당신이 판사입니다’에서 실제 사건을 바탕으로 한 상해 사건의 형을 직접 정해 볼 수 있다. 오태식에게 정한 형과 비교해 보자. 이 게임의 기록은 이 기기에 그대로 남아 있다.</p><a class="extlink" href="https://www.scourt.go.kr/sc/exp/step.work?step_id=01&case_id=00" target="_blank" rel="noopener">국민 양형 체험 열기 (새 창)</a></div><div class="row end"><button class="btn sub" id="dx">개념 도감 보기</button></div>`);
  $('#dx').onclick = showDex; fx('flash');
}
function misRole(st) { if (MIS && MIS.i < 0) return MIS.m.role; if (st.id.startsWith('5-1B')) return '항소심 판사'; return { 1: '피의자 윤재', 2: '강민호 경위', 3: '서지우 검사', 4: '이도현 판사' }[st.ch] || '이야기를 지켜보는 사람'; }
function startMission(m, req) {
  const s = JSON.parse(JSON.stringify(S)); m.set(s);
  MIS = { m, s, list: m.steps, i: -1, force: null };
  app.innerHTML = '';
  const st0 = STEPS[IDX[m.steps[0].split('!')[0]]];
  paint(st0, s, `<div class="titlecard"><small>${req ? `가지 않은 길 · 남은 ${MISSIONS.filter(missionNeed).length}곳` : '가지 않은 길(선택)'}</small><h1>${m.name}</h1><p>만약 ${m.what}?</p></div>`,
    `<div class="result world"><h3>다른 세계로 가기 전에</h3>
      <p class="hint">사건의 결말은 선택마다 달라진다. 지금부터 잠깐, 내가 고르지 않은 선택이 만든 다른 세계를 다녀온다.</p>
      <dl class="worlddl"><dt>내 이야기</dt><dd>${m.real(S)}</dd><dt>이 세계</dt><dd>만약 ${m.what}</dd><dt>장면</dt><dd>${m.scene}</dd><dt>지금 나는</dt><dd><b>${m.role}</b></dd></dl>
      <h4>이 세계에서 따져 볼 것</h4><ol>${m.think.map(x => `<li>${x}</li>`).join('')}</ol>
      <p class="hint">다녀와도 내 사건 기록과 엔딩은 바뀌지 않는다.</p></div>${nextBtn('이 세계로 들어가기')}`);
  bindNext(); fx('pan');
}
function markMission(st) { (st.teach || []).concat(st.teachCard || []).forEach(k => { if (MIS.m.need.includes(k)) META.dex[k] = 'play'; }); if (st.teachFn) Object.keys(st.teachFn(MIS.s)).forEach(k => { if (MIS.m.need.includes(k)) META.dex[k] = 'play'; }); const f = MIS.list[MIS.i].split('!')[1]; MIS.force = f === 'keep' ? 1 : null; }
function finishMission() { const m = MIS.m; m.need.forEach(k => META.dex[k] = 'play'); META.missions[m.id] = true; MIS = null; save();
  const left = MISSIONS.filter(missionNeed).length;
  app.innerHTML = ''; paint(STEPS[IDX.end], S, `<div class="titlecard"><small>내 이야기로 돌아왔다</small><h1>${m.name}</h1><p>다른 세계에서 직접 겪은 것: ${m.need.join(' · ')}</p></div>`,
    `<div class="row end"><button class="btn" id="todex">${left ? `다음 세계로 (남은 ${left}곳) ▸` : META.quiz ? '도감으로 ▸' : '마무리 문제 ▸'}</button></div>`);
  $('#todex').onclick = () => (left || !META.quiz) ? nextTask() : showDex(); fx('flash'); }
function finalQuiz() {
  const Q = [['체포·구속·압수·수색에 필요한 영장은 누가 발부할까?', ['판사(법관)', '검사', '경찰'], 0], ['적법한 절차에 따르지 않고 수집한 증거는?', ['증거로 할 수 없다', '사실이면 쓸 수 있다', '검사가 원하면 쓸 수 있다'], 0], ['구금되었던 사람이 무죄 판결을 받았을 때 국가에 청구할 수 있는 제도는?', ['형사 보상', '배상 명령', '범죄 피해자 구조'], 0]];
  let k = 0;
  const draw = () => { const [q, o, a] = Q[k]; app.innerHTML = `<div class="ch5 shell"><header class="hud"><span class="pill">마무리 문제 ${k + 1}/3</span></header><section class="panel wide"><h2 class="big">${q}</h2>${optList(o)}<div id="fb"></div></section></div>`;
    $$('.opt').forEach(b => b.onclick = () => { if (+b.dataset.i === a) { k++; if (k < 3) draw(); else { META.quiz = true; save(); showComplete(); } } else wrong(b); }); };
  draw();
}
function showMenu() {
  const code = encode(S.log);
  modal(`<h3>메뉴</h3><p>이어하기 코드</p><p class="code">${code.replace(/(.{4})/g, '$1 ').trim()}</p>
    <div class="row"><input id="ci" placeholder="다른 기기의 이어하기 코드"><button class="btn" id="cb">불러오기</button></div><div id="fb"></div>
    <div class="row"><button class="btn sub" id="mo">화면 효과: ${document.documentElement.classList.contains('lowmotion') ? '끔' : '켬'}</button></div>
    <div class="row"><button class="btn sub" id="rs">이 기기의 기록 지우기</button><button class="btn" id="cl">닫기</button></div>`);
  $('#mo').onclick = () => { META.motion = document.documentElement.classList.contains('lowmotion') ? 'on' : 'off'; applyMotion(); save(); closeModal(); showMenu(); };
  $('#cl').onclick = closeModal;
  $('#cb').onclick = () => { const f = decode($('#ci').value); if (!f) return wrong($('#ci'), '코드를 확인하자.'); const keep = { lock: META.lock }; META = Object.assign(freshMeta(), keep); S = replay(f, null); STEPS.slice(0, S.pos).forEach(x => { if (x.type === 'gate') META.gates[x.id] = true; }); MIS = null; closeModal(); save(); render(); };
  $('#rs').onclick = () => { const b = $('#rs'); if (!b.dataset.sure) { b.dataset.sure = 1; b.textContent = '한 번 더 누르면 모두 지운다'; return; } try { localStorage.removeItem(KEY); } catch (e) { } S = fresh(); META = freshMeta(); MIS = null; mark(STEPS[0], S); closeModal(); render(); };
}
// ───────── 교사 화면: 아무 장면으로 바로 이동
function teacher() {
  let preset = 'good';
  const draw = () => {
    const groups = [0, 1, 2, 3, 4, 5].map(ch => [ch, STEPS.map((x, i) => [x, i]).filter(([x]) => x.ch === ch)]);
    app.innerHTML = `<div class="ch4 shell"><header class="hud"><span class="pill">교사용 화면</span><span class="grow"></span><a class="pill ghost" href="#" id="tostu">학생 화면으로</a></header><section class="panel wide">
    <h2 class="big">장면 바로 가기</h2><p class="hint">원하는 장면을 누르면, 아래에서 고른 길로 그 장면 직전까지 자동으로 진행한 뒤 보여 준다. 교사 화면에서 들어가면 ‘다시 고르기’가 무제한이고 정리 퍼즐을 건너뛴다.</p>
    <div class="row">${[['good', '권리를 잘 쓴 길(불구속)'], ['hold', '구속된 길'], ['bad', '지름길·유죄 길']].map(([k, t]) => `<button class="tab ${preset === k ? 'sel' : ''}" data-p="${k}">${t}</button>`).join('')}</div>
    <div class="nav">${groups.map(([ch, list]) => `<div class="navl"><h4>${CHNAME[ch]}</h4>${list.map(([x, i]) => `<button class="navb" data-i="${i}" title="${x.type}">${x.id} <small>${navName(x)}</small></button>`).join('')}</div>`).join('')}</div>
    <h2 class="big">정리 퍼즐 · 속도 맞추기</h2>
    <p class="hint">정리 퍼즐은 학생이 스스로 풀어 암호를 얻는다. 반 전체가 같이 넘어가게 하려면 학생 기기에서 주소 끝에 <b>#잠금</b>을 붙여 열게 한다. 그러면 퍼즐을 푼 뒤 아래 ‘선생님 확인 암호’를 하나 더 입력해야 한다.</p>
    <table class="tt"><tr><th>장 끝</th><th>학생이 푸는 암호</th><th>선생님 확인 암호(#잠금일 때)</th></tr>${STEPS.filter(x => x.type === 'gate').map(gx => `<tr><td>${CHNAME[gx.ch]}</td><td>${gx.word}</td><td><b>${TEACH[gx.id]}</b></td></tr>`).join('')}</table>
    <div class="row"><button class="btn sub" id="lk">${META.lock ? '이 기기: 잠금 켜짐 (끄기)' : '이 기기에 잠금 켜기'}</button></div></section></div>`;
    $$('[data-p]').forEach(b => b.onclick = () => { preset = b.dataset.p; draw(); });
    $$('.navb').forEach(b => b.onclick = () => { const i = +b.dataset.i; META.teacher = true; MIS = null; S = run(preset, i); if (S.pos !== i) console.warn('scene skipped on this path'); history.replaceState(null, '', location.pathname + location.search); save(); app.innerHTML = ''; render(); });
    $('#lk').onclick = () => { META.lock = !META.lock; save(); draw(); };
    $('#tostu').onclick = () => { META.teacher = false; save(); };
  };
  draw();
}
function navName(x) { const t = { title: x.title, talk: '대화', record: '조서', chat: '메시지', quiz: '문제', contradict: '모순 찾기', multi: '모두 고르기', classify: '분류', order: '순서', choice: '선택', pick2: '두 가지 말하기', interro: '신문 질문', tokens: '수사 토큰', review: '기록 검토', indict: '공소장', evidence: '증거 도장', jury: '배심원', syllogism: '삼단 논법', sentence: '형 정하기', comp: '형사 보상', card: x.h, save: '저장', gate: '정리 퍼즐', ending: '엔딩' }[x.type]; return t || x.type; }
function applyMotion() { let low = false; try { low = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { } if (META.motion === 'on') low = false; if (META.motion === 'off') low = true; document.documentElement.classList.toggle('lowmotion', low); return low; }
function boot() {
  const h = decodeURIComponent(location.hash);
  if (h === '#교사') { load(); return teacher(); }
  if (!load()) { S = fresh(); mark(STEPS[0], S); }
  if (h === '#잠금') { META.lock = true; save(); }
  applyMotion();
  app.innerHTML = ''; render();
}
if (app) { window.addEventListener('hashchange', boot); boot(); }
