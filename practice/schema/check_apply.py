# 스키마 검증기. `python schema/check_apply.py` 로 실행.
# 문제 JSON이 형식에 맞는지 + apply 체인이 실제로 코드를 만들어내는지 확인한다.
import io, json, os, sys

TYPES = {"CONNECT", "PLACE", "ORDER", "SELECT", "FILL", "WRITE", "DEBUG"}
REQUIRED = ("id", "type", "prompt", "payload", "answer_key", "hint")


def apply_all(problems):
    """apply 엔트리를 순서대로 적용해 {파일경로: 내용} 을 만든다.
    런타임(백엔드)이 해야 할 동작과 같은 규칙이다."""
    files = {}
    for p in problems:
        for a in p.get("apply", []):
            f = a["file"]
            if "create" in a:
                files[f] = a["create"]
                continue
            body = files[f]  # create 없이 insert/replace 하면 KeyError = 작성자 실수
            if a["code"].strip() and a["code"].strip() in body:
                continue  # 이미 있으면 no-op (import 중복 방지)
            if "insert_after" in a:
                anchor = a["insert_after"]
                assert body.count(anchor) == 1, f"{p['id']}: 앵커가 유일하지 않음 {anchor!r}"
                files[f] = body.replace(anchor, anchor + "\n" + a["code"])
            else:
                anchor = a["replace"]
                assert body.count(anchor) == 1, f"{p['id']}: 앵커가 유일하지 않음 {anchor!r}"
                files[f] = body.replace(anchor, a["code"])
    return files


def check(path):
    d = json.load(io.open(path, encoding="utf-8"))
    problems = d["problems"] + d.get("other_chapters", [])

    ids = [p["id"] for p in problems]
    assert len(ids) == len(set(ids)), "중복 id"

    for p in problems:
        for k in REQUIRED:
            assert k in p, f"{p.get('id')}: 필수 필드 {k} 없음"
        assert p["type"] in TYPES, f"{p['id']}: 알 수 없는 type {p['type']}"
        ak = p["answer_key"]
        assert ak.get("match", "exact") in ("exact", "normalized", "tokens")
        if ak.get("match") == "tokens":
            assert ak.get("require"), f"{p['id']}: tokens 채점인데 require 없음"
        for a in p.get("apply", []):
            ops = [k for k in ("create", "insert_after", "replace") if k in a]
            assert len(ops) == 1, f"{p['id']}: apply 연산은 정확히 하나 ({ops})"
            if ops[0] != "create":
                assert "code" in a, f"{p['id']}: insert/replace 에는 code 필요"

    missing = TYPES - {p["type"] for p in problems}
    assert not missing, f"샘플에 없는 유형: {missing}"

    files = apply_all(d["problems"])
    ctrl = files["src/main/java/com/example/board/post/PostController.java"]
    assert 'return "posts/list"' in ctrl, "레슨1을 다 풀어도 list()가 완성되지 않음"
    assert "// @@list-body" not in ctrl, "치환되지 않은 앵커가 남음"

    print(f"OK  {len(problems)}문제 · {len(TYPES)}유형 전부 · 누적파일 {len(files)}개")


if __name__ == "__main__":
    check(sys.argv[1] if len(sys.argv) > 1
          else os.path.join(os.path.dirname(__file__), "problems-sample.json"))
