// 공부노트 데이터 자체 점검 — npx tsx src/data/notes/notes.test.ts
import assert from "node:assert/strict";
import { NOTE_SUBJECTS } from "./index";
import { NOTE_LABELS } from "./labels";
import { NOTE_ALIASES, splitConcepts, conceptOf } from "./concepts";

const seen = new Set<string>();
let count = 0;

for (const subject of NOTE_SUBJECTS) {
  for (const unit of subject.units) {
    // unit id "py-2" → 과목 접두어 "py", 단원 번호 "2"
    const [prefix, unitNo] = unit.id.split("-");
    for (const note of unit.notes) {
      count++;
      // ① id 전역 유일
      assert.ok(!seen.has(note.id), `중복 id: ${note.id}`);
      seen.add(note.id);
      // ② id 형식 n-<접두어>-<unit>-<n>, 소속 unit 의 접두어·번호와 일치
      const m = /^n-([a-z]+)-(\d+)-(\d+)$/.exec(note.id);
      assert.ok(m, `id 형식 위반: ${note.id}`);
      assert.equal(`${m[1]}-${m[2]}`, `${prefix}-${unitNo}`, `${note.id} 가 ${unit.id} 에 있음`);
      // ⑦ 포스터 타일 라벨 — 3열 타일에 들어가야 하니 짧게
      const label = NOTE_LABELS[note.id];
      assert.ok(label, `${note.id} 타일 라벨(labels.ts) 없음`);
      assert.ok(label.length <= 16, `${note.id} 타일 제목 ${label.length}자`);
      // ③ 블록 1개 이상
      assert.ok(note.blocks.length >= 1, `${note.id} 블록 없음`);
      // ④ summary 60자 이내
      assert.ok(note.summary.length <= 60, `${note.id} summary ${note.summary.length}자`);
      // ⑤ 인라인 백틱은 짝수 개 — 홀수면 렌더러(text.split("`"))가 뒷부분을 전부 코드로 그린다
      // 블록 안 모든 문자열을 모은다(code 의 code·out 은 인라인 렌더 대상이 아니라 제외)
      const texts = [note.summary];
      const collect = (v: unknown, key = ""): void => {
        if (typeof v === "string") {
          if (key !== "code" && key !== "out" && key !== "type") texts.push(v);
        } else if (Array.isArray(v)) v.forEach((x) => collect(x, key));
        else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) collect(x, k);
      };
      note.blocks.forEach((b) => collect(b));
      // ⑥ 노트당 h2 5개 이하 — 번호 배지가 길어지면 지도가 아니라 목차가 된다
      assert.ok(note.blocks.filter((b) => b.type === "h2").length <= 5, `${note.id} h2 5개 초과`);
      // ⑧ 그림(figure) 모양 검사 — 그림이 깨지는 데이터를 미리 잡는다
      for (const b of note.blocks) {
        if (b.type !== "figure") continue;
        if (b.kind === "flow") {
          assert.ok(b.nodes.length >= 2, `${note.id} flow 상자 2개 미만`);
          if (b.edges) assert.equal(b.edges.length, b.nodes.length - 1, `${note.id} flow edges 개수`);
        }
        if (b.kind === "cycle") assert.ok(b.nodes.length >= 3 && b.nodes.length <= 5, `${note.id} cycle 은 3~5개`);
        if (b.kind === "tree") assert.ok(b.children.length >= 2 && b.children.length <= 4, `${note.id} tree 갈래는 2~4개`);
        if (b.kind === "stack") assert.ok(b.layers.length >= 2, `${note.id} stack 층 2개 미만`);
        if (b.kind === "refs")
          for (const v of b.vars) assert.ok(v.to >= 0 && v.to < b.objs.length, `${note.id} refs ${v.name} 가 없는 상자를 가리킴`);
      }
      for (const t of texts)
        assert.ok((t.split("`").length - 1) % 2 === 0, `${note.id} 백틱 홀수: ${t.slice(0, 40)}`);
    }
  }
}

// 라벨 쪽에만 남은 고아 id 도 잡는다 (노트를 지우고 라벨을 안 지운 경우)
for (const id of Object.keys(NOTE_LABELS)) assert.ok(seen.has(id), `labels.ts 에 없는 노트 id: ${id}`);

// 개념 사전: 별칭이 가리키는 노트가 실제로 있어야 한다
for (const id of Object.keys(NOTE_ALIASES)) assert.ok(seen.has(id), `concepts.ts 에 없는 노트 id: ${id}`);
// 낱말 자르기: 영문 개념은 더 긴 단어 속에서 걸리면 안 된다 (HashMap 속 Map)
{
  const segs = splitConcepts("HashMap 과 Map 은 다르다", new Set());
  const names = segs.filter((s) => s.concept).map((s) => s.concept);
  assert.deepEqual(names, ["HashMap", "Map"], `개념 자르기: ${JSON.stringify(names)}`);
  // 한글 개념은 앞 글자가 한글이면 안 걸린다 ("다형성" 속 "형성" 같은 오탐 방지 규칙)
  assert.ok(!splitConcepts("배열을 쓴다", new Set(["배열"])).some((s) => s.concept), "skip 에 든 개념이 링크됐다");
  // 카드 + 노트 둘 다 있는 개념은 둘 다 나온다
  const c = conceptOf("재귀");
  assert.ok(c?.card && c.notes.length >= 1, "재귀는 단어장 카드와 노트를 둘 다 가져야 한다");
  // 지금 노트 자신은 이동 대상에서 빠진다
  assert.ok(!conceptOf("HashMap", "n-jv-7-5")?.notes.some((n) => n.note.id === "n-jv-7-5"), "자기 노트로 가는 링크");
}

console.log(`notes ${count}장 점검 통과`);
