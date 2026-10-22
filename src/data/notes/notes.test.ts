// 공부노트 데이터 자체 점검 — npx tsx src/data/notes/notes.test.ts
import assert from "node:assert/strict";
import { NOTE_SUBJECTS } from "./index";

const seen = new Set<string>();
let count = 0;

for (const subject of NOTE_SUBJECTS) {
  for (const unit of subject.units) {
    // unit id "py-2" → 단원 번호 "2"
    const unitNo = unit.id.split("-").pop();
    for (const note of unit.notes) {
      count++;
      // ① id 전역 유일
      assert.ok(!seen.has(note.id), `중복 id: ${note.id}`);
      seen.add(note.id);
      // ② id 형식 n-py-<unit>-<n>, 소속 unit 번호와 일치
      const m = /^n-py-(\d+)-(\d+)$/.exec(note.id);
      assert.ok(m, `id 형식 위반: ${note.id}`);
      assert.equal(m[1], unitNo, `${note.id} 가 ${unit.id} 에 있음`);
      // ③ 블록 1개 이상
      assert.ok(note.blocks.length >= 1, `${note.id} 블록 없음`);
      // ④ summary 60자 이내
      assert.ok(note.summary.length <= 60, `${note.id} summary ${note.summary.length}자`);
      // ⑤ 인라인 백틱은 짝수 개 — 홀수면 렌더러(text.split("`"))가 뒷부분을 전부 코드로 그린다
      const texts = [note.summary];
      for (const b of note.blocks) {
        if (b.type === "p" || b.type === "tip") texts.push(b.text);
        else if (b.type === "list") texts.push(...b.items);
        else if (b.type === "table") texts.push(...b.head, ...b.rows.flat());
      }
      for (const t of texts)
        assert.ok((t.split("`").length - 1) % 2 === 0, `${note.id} 백틱 홀수: ${t.slice(0, 40)}`);
    }
  }
}

console.log(`notes ${count}장 점검 통과`);
