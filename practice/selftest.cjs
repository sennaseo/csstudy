// 프로토타입 자체 점검: 7문제를 실제 render/submit 코드로 끝까지 풀어본다.
// jsdom 없이 최소 DOM 스텁으로 돌린다. 실패하면 exit 1.
const fs = require('fs'), vm = require('vm'), assert = require('assert');

const html = fs.readFileSync(__dirname + '/../public/practice/index.html', 'utf8');
const src = html.match(/<script>([\s\S]*)<\/script>/)[1];

// --- 최소 DOM 스텁 ---------------------------------------------------------
class El {
  constructor(tag='div'){ this.tag=tag; this.children=[]; this.dataset={}; this.style={};
    this._html=''; this.value=''; this.disabled=false; this.hidden=false; this.onclick=null;
    this.onchange=null; this.oninput=null; }
  get innerHTML(){ return this._html; }
  set innerHTML(v){ this._html = String(v); this.children = parse(this._html); }
  querySelectorAll(sel){
    const attr = sel.replace(/[\[\]]/g,'');          // "data-pick" 형태
    return this.children.filter(c => attr in c.dataset);
  }
}
// innerHTML에서 data-* 붙은 엘리먼트만 뽑아내는 아주 얇은 파서
function parse(h){
  const out = [];
  const re = /<(button|select|input|li)\b([^>]*)>/g; let m;
  while ((m = re.exec(h))) {
    const el = new El(m[1]); const attrs = m[2];
    const da = /data-([a-z]+)="([^"]*)"/g; let a;
    while ((a = da.exec(attrs))) el.dataset[a[1]] = a[2];
    const id = /\bid="([^"]+)"/.exec(attrs); if (id) el.id = id[1];
    out.push(el);
  }
  return out;
}

const registry = {};                                   // id -> El
const app = new El();
const sandbox = {
  console,
  document: {
    getElementById: id => registry[id] || (app.children.find(c => c.id === id) || null),
    querySelectorAll: sel => app.querySelectorAll(sel),
  },
};
sandbox.window = sandbox;
vm.createContext(sandbox);

// render()가 app.innerHTML을 쓰도록 app을 주입
vm.runInContext(src.replace('const app = document.getElementById("app");', 'const app = globalThis.__app;')
                   .replace(/^render\(\);\s*$/m, ''),
                Object.assign(sandbox, { __app: app }));

const L = vm.runInContext('LESSON', sandbox);
const P = L.problems;

// --- 플레이스루 ------------------------------------------------------------
// render/submit 내부가 document.getElementById로 찾는 요소를 매 문제마다 새로 등록
function stubInputs(){
  ['go','whyBtn','whyBox','fb','txt','fix','next','retry','ans','exit','start','toHome'].forEach(id => {
    registry[id] = new El(); registry[id].id = id;
  });
}

// --- 홈 화면 ---------------------------------------------------------------
stubInputs();
vm.runInContext('screen="home"; render()', sandbox);
const home = app.innerHTML;
assert.ok(home.includes('챕터 0'), '홈: 챕터 0이 없음');
assert.ok(home.includes('챕터 7'), '홈: 챕터 7이 없음');
assert.ok(home.includes('🔥'), '홈: streak 없음');
assert.ok(!/❤️|🤍/.test(home), '홈: 하트를 빼기로 했는데 남아 있음');
assert.ok(/class="node cur"/.test(home), '홈: 현재 챕터 표시 없음');
assert.ok((home.match(/class="node lock"/g) || []).length === 4, '홈: 잠긴 챕터가 4개가 아님');
assert.ok(home.includes('시작하기'), '홈: 시작 버튼 없음');
console.log('  홈 화면      챕터8개 OK · 하트없음 OK · 잠금4개 OK');

// 시작 → 레슨 진입
vm.runInContext('screen="lesson"; idx=0; render()', sandbox);
assert.ok(app.innerHTML.includes('문제 1'), '시작 후 레슨으로 안 넘어감');
console.log('  홈→레슨     OK');

let passed = 0;
const results = [];

for (let i = 0; i < P.length; i++) {
  const p = P[i];
  stubInputs();
  vm.runInContext(`screen="lesson"; idx=${i}; sel=null; order=null; pairs=null; tries=0;`, sandbox);
  vm.runInContext('render()', sandbox);

  // 렌더 결과에 질문이 들어갔는지
  assert.ok(app.innerHTML.includes('문제 ' + (i+1)), `${p.id}: 문제 번호 렌더 실패`);

  // 정답을 주입
  if (p.type === 'CONNECT') {
    vm.runInContext(`pairs = ${JSON.stringify(p.answer)}`, sandbox);
  } else if (p.type === 'ORDER') {
    vm.runInContext(`order = ${JSON.stringify(p.answer)}`, sandbox);
  } else if (p.type === 'DEBUG') {
    vm.runInContext(`sel = ${JSON.stringify(p.answer.cause)}`, sandbox);
    registry['fix'].value = p.answer.fix;
  } else if (p.type === 'FILL_TEXT') {
    registry['txt'].value = p.answer;
  } else {
    vm.runInContext(`sel = ${JSON.stringify(p.answer)}`, sandbox);
  }

  // 채점기가 정답을 정답으로 보는지
  const good = vm.runInContext(`check(LESSON.problems[${i}])`, sandbox);
  assert.ok(good, `${p.id} (${p.type}): 정답을 넣었는데 오답 판정됨`);

  // 오답도 오답으로 보는지 (역방향 확인)
  if (p.type === 'FILL_TEXT') { registry['txt'].value = 'wrong'; }
  else if (p.type === 'DEBUG') { registry['fix'].value = '/nope'; }
  else if (p.type === 'ORDER') { vm.runInContext('order = order.slice().reverse()', sandbox); }
  else if (p.type === 'CONNECT') { vm.runInContext('pairs = {mapping:"r4",findall:"r3",addattr:"r2",return:"r1"}', sandbox); }
  else { vm.runInContext('sel = "___nope___"', sandbox); }
  const bad = vm.runInContext(`check(LESSON.problems[${i}])`, sandbox);
  assert.ok(!bad, `${p.id} (${p.type}): 오답을 넣었는데 정답 판정됨`);

  passed++;
  results.push(`  ${p.id.padEnd(3)} ${p.type.padEnd(12)} 정답=OK 오답=OK`);
}

// --- 정규화 채점 확인 ------------------------------------------------------
const norm = vm.runInContext('norm', sandbox);
assert.strictEqual(norm('  "posts" '), 'posts', '따옴표/공백 정규화 실패');
assert.strictEqual(norm("'/POSTS'"), '/posts', '대소문자 정규화 실패');

// --- 코드 누적 확인 --------------------------------------------------------
const files = {};
P.forEach(p => (p.apply || []).forEach(a => files[a.file] = a));
const ctrl = files['src/main/java/com/example/board/post/PostController.java'].code;
const view = files['src/main/resources/templates/posts/list.html'].code;
assert.ok(ctrl.includes('addAttribute("posts"'), 'Controller가 posts 이름으로 안 넘김');
assert.ok(view.includes('${posts}'), 'list.html이 posts를 안 받음');
assert.ok(!/@@/.test(ctrl + view), '앵커 주석이 사용자에게 노출됨');

console.log(results.join('\n'));
console.log(`\n7문제 정오답 판정 ${passed}/7 · 정규화 OK · 누적파일 ${Object.keys(files).length}개`);
console.log(`XP 합계 ${P.reduce((a, b) => a + b.xp, 0)}`);
console.log('OK');
