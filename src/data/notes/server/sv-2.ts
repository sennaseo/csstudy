// WAS·DB 단원 2 — DB 기초와 WAS 연결. 작성 규칙은 ../python.ts 상단 주석.
// SQL 예제의 out 은 SQLite 로 실제 실행해 확인한 결과다.
import type { NoteUnit } from "../types";

export const SV2: NoteUnit = {
  id: "sv-2",
  title: "DB 기초와 WAS 연결",
  notes: [
    {
      id: "n-sv-2-1",
      emoji: "🗄️",
      title: "DB와 DBMS, 테이블",
      summary: "DB 는 데이터 묶음, DBMS 는 그걸 관리하는 프로그램, 테이블은 표 한 장",
      blocks: [
        { type: "key", text: "DB 는 서류 창고, DBMS 는 창고 관리인" },
        {
          type: "figure",
          kind: "stack",
          nested: true,
          layers: [
            { icon: "🧑‍💼", label: "DBMS", sub: "MySQL, PostgreSQL, Oracle" },
            { icon: "🗄️", label: "데이터베이스", sub: "shop" },
            { icon: "📋", label: "테이블", sub: "member, orders" },
          ],
          caption: "DBMS 안에 DB, DB 안에 테이블",
        },
        { type: "h2", text: "왜 파일이 아니라 DB 인가" },
        {
          type: "compare",
          cols: [
            { title: "파일에 저장", tone: "bad", items: ["여럿이 동시에 쓰면 덮어씀", "원하는 줄을 찾으려면 다 읽어야 함", "쓰다가 꺼지면 반쯤 저장됨"] },
            { title: "DBMS 사용", tone: "good", items: ["동시 접근을 조율해 줌", "조건으로 필요한 것만 꺼냄", "실패하면 원래대로 되돌림"] },
          ],
        },
        { type: "h2", text: "테이블 읽는 법" },
        {
          type: "table",
          head: ["용어", "뜻", "엑셀로 치면"],
          rows: [
            ["테이블", "같은 종류 데이터를 모은 표", "시트 한 장"],
            ["행 (row)", "데이터 한 건", "가로 한 줄"],
            ["열 (column)", "항목 하나", "세로 한 칸"],
            ["스키마", "열 이름과 타입을 정한 틀", "머리글 줄"],
          ],
        },
        { type: "h2", text: "테이블 만들기" },
        {
          type: "code",
          code: `CREATE TABLE member (
    id   INTEGER PRIMARY KEY,
    name TEXT,
    age  INTEGER
);`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "엑셀은 아무 칸에 아무 값이나 넣을 수 있다. 테이블은 열마다 타입이 정해져 있어서 `age` 열에 글자를 넣으면 거절된다.",
        },
        {
          type: "list",
          style: "check",
          items: ["DB = 데이터, DBMS = 관리 프로그램", "테이블은 행(한 건)과 열(항목)로 된 표", "열마다 타입이 정해져 있다"],
        },
      ],
    },
    {
      id: "n-sv-2-2",
      emoji: "✍️",
      title: "SQL 기본: 넣고, 찾고, 고치고, 지우기",
      summary: "INSERT, SELECT, UPDATE, DELETE 네 문장으로 데이터를 다룬다",
      blocks: [
        { type: "key", text: "SQL 은 DBMS 에게 건네는 주문서" },
        {
          type: "figure",
          kind: "tree",
          root: { icon: "✍️", label: "SQL" },
          children: [
            { icon: "➕", label: "INSERT", sub: "넣기", ink: "green" },
            { icon: "🔍", label: "SELECT", sub: "찾기", ink: "blue" },
            { icon: "✏️", label: "UPDATE", sub: "고치기" },
            { icon: "🗑️", label: "DELETE", sub: "지우기", ink: "red" },
          ],
        },
        { type: "h2", text: "넣고 찾기" },
        {
          type: "code",
          code: `INSERT INTO member (id, name, age) VALUES (1, 'kim', 25);
INSERT INTO member (id, name, age) VALUES (2, 'lee', 31);
INSERT INTO member (id, name, age) VALUES (3, 'park', 19);

SELECT name, age FROM member WHERE age >= 20;`,
          out: "kim  | 25\nlee  | 31",
        },
        { type: "h2", text: "고치고 지우기" },
        {
          type: "code",
          code: `UPDATE member SET age = 26 WHERE id = 1;
DELETE FROM member WHERE id = 3;

SELECT * FROM member;`,
          out: "1 | kim | 26\n2 | lee | 31",
        },
        {
          type: "tip",
          kind: "warn",
          text: "`UPDATE` 와 `DELETE` 에서 `WHERE` 를 빼먹으면 모든 행이 바뀌거나 지워진다. 실행 전에 같은 조건으로 `SELECT` 를 먼저 돌려 본다.",
        },
        { type: "h2", text: "CRUD 와 짝짓기" },
        {
          type: "table",
          head: ["하는 일", "SQL", "HTTP 메서드"],
          rows: [
            ["Create", "`INSERT`", "POST"],
            ["Read", "`SELECT`", "GET"],
            ["Update", "`UPDATE`", "PUT · PATCH"],
            ["Delete", "`DELETE`", "DELETE"],
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["네 문장: `INSERT` `SELECT` `UPDATE` `DELETE`", "`WHERE` 로 대상 행을 고른다", "`WHERE` 없는 수정·삭제는 전체에 적용"],
        },
      ],
    },
    {
      id: "n-sv-2-3",
      emoji: "🔑",
      title: "기본키·외래키와 JOIN",
      summary: "기본키로 행을 구분하고, 외래키로 다른 테이블을 가리키고, JOIN 으로 합친다",
      blocks: [
        { type: "key", text: "기본키는 주민번호, 외래키는 그 번호를 적어 둔 메모" },
        {
          type: "figure",
          kind: "refs",
          vars: [
            { name: "orders 1번", to: 0 },
            { name: "orders 2번", to: 0 },
            { name: "orders 3번", to: 1 },
          ],
          objs: [
            { icon: "🧑", label: "member 1", sub: "kim" },
            { icon: "🧑", label: "member 2", sub: "lee", ink: "blue" },
          ],
          caption: "주문의 `member_id` 가 회원의 `id` 를 가리킨다",
        },
        { type: "h2", text: "두 가지 키" },
        {
          type: "compare",
          cols: [
            { title: "기본키 (PK)", items: ["행 하나를 딱 집어내는 값", "겹치면 안 되고 비면 안 됨", "예: `member.id`"] },
            { title: "외래키 (FK)", items: ["다른 테이블의 기본키를 적은 열", "없는 번호는 못 적게 막아 줌", "예: `orders.member_id`"] },
          ],
        },
        { type: "h2", text: "왜 테이블을 나누나" },
        {
          type: "p",
          text: "주문마다 회원 이름과 주소를 다시 적으면, 이사했을 때 주문 줄을 전부 고쳐야 한다. 회원 정보는 한 곳에만 두고 주문에는 번호만 적는다.",
        },
        { type: "h2", text: "JOIN 으로 다시 합치기" },
        {
          type: "code",
          code: `-- orders: (1, 1, 'keyboard'), (2, 1, 'mouse'), (3, 2, 'monitor')

SELECT m.name, o.item
FROM member m
JOIN orders o ON o.member_id = m.id;`,
          out: "kim | keyboard\nkim | mouse\nlee | monitor",
        },
        {
          type: "list",
          style: "flow",
          items: ["`member` 의 한 행을 집는다", "`orders` 에서 `member_id` 가 같은 행을 찾는다", "둘을 옆으로 이어 붙여 한 줄로 만든다"],
        },
        {
          type: "list",
          style: "check",
          items: ["기본키 = 행의 고유 번호", "외래키 = 다른 테이블 기본키를 가리키는 열", "`JOIN ... ON` 으로 번호가 같은 행끼리 합친다"],
        },
      ],
    },
    {
      id: "n-sv-2-4",
      emoji: "🔌",
      title: "WAS 가 DB 에 말 거는 법: JDBC",
      summary: "JDBC 는 자바와 DB 를 잇는 표준 창구, 드라이버만 바꾸면 DB 를 갈아탄다",
      blocks: [
        { type: "key", text: "JDBC 는 만능 콘센트, 드라이버는 나라별 어댑터" },
        {
          type: "figure",
          kind: "flow",
          nodes: [
            { icon: "🧑‍🍳", label: "WAS", sub: "자바 코드", ink: "red" },
            { icon: "🔌", label: "JDBC", sub: "표준 창구", ink: "blue" },
            { icon: "🗄️", label: "DB", sub: "MySQL 등", ink: "green" },
          ],
          edges: ["SQL 전달", "드라이버"],
        },
        { type: "h2", text: "네 단계" },
        {
          type: "list",
          style: "flow",
          items: ["커넥션(연결)을 얻는다", "SQL 을 담은 문장을 준비한다", "실행하고 결과를 한 줄씩 읽는다", "커넥션을 닫는다(반납)"],
        },
        { type: "h2", text: "코드로 보기" },
        {
          type: "code",
          code: `String sql = "SELECT name FROM member WHERE id = ?";

try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setLong(1, 1L);                 // ? 자리에 값 넣기
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getString("name"));
        }
    }
}`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "사용자가 입력한 값을 SQL 글자에 그대로 이어 붙이면 SQL 인젝션에 뚫린다. 값은 `?` 자리에 `setXxx` 로 넣는다.",
        },
        { type: "h2", text: "요즘은 한 겹 더" },
        {
          type: "table",
          head: ["도구", "하는 일"],
          rows: [
            ["JDBC", "SQL 을 직접 쓰고 결과도 직접 꺼냄"],
            ["MyBatis", "SQL 은 쓰되, 결과를 객체로 옮겨 줌"],
            ["JPA", "객체를 다루면 SQL 을 대신 만들어 줌"],
          ],
        },
        {
          type: "p",
          text: "MyBatis 와 JPA 도 맨 아래에서는 JDBC 를 쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: ["JDBC = 자바가 DB 에 접속하는 표준", "연결 → 준비 → 실행 → 닫기", "값은 `?` 로 넣는다"],
        },
      ],
    },
    {
      id: "n-sv-2-5",
      emoji: "🏊",
      title: "커넥션 풀",
      summary: "DB 연결은 비싸서 미리 여러 개 만들어 두고 빌려 쓴 뒤 돌려준다",
      blocks: [
        { type: "key", text: "전화를 매번 새로 걸지 않고, 연결된 회선을 돌려 쓴다" },
        {
          type: "figure",
          kind: "cycle",
          nodes: [
            { icon: "🏊", label: "풀에서 빌림", ink: "blue" },
            { icon: "✍️", label: "SQL 실행" },
            { icon: "↩️", label: "풀에 반납", ink: "green" },
          ],
        },
        { type: "h2", text: "연결 한 번이 비싼 이유" },
        {
          type: "list",
          style: "flow",
          items: ["네트워크 연결을 맺는다", "아이디·비밀번호를 확인한다", "DB 가 이 연결용 작업 공간을 준비한다"],
        },
        {
          type: "p",
          text: "SQL 한 줄 실행보다 이 준비가 더 오래 걸리기도 한다. 요청마다 반복하면 낭비다.",
        },
        { type: "h2", text: "풀이 하는 일" },
        {
          type: "compare",
          cols: [
            { title: "매번 새 연결", tone: "bad", items: ["요청마다 준비 시간 소모", "요청이 몰리면 DB 연결 수 폭발"] },
            { title: "커넥션 풀", tone: "good", items: ["만들어 둔 연결을 재사용", "최대 개수를 넘지 않게 제한"] },
          ],
        },
        { type: "h2", text: "스프링 부트 설정" },
        {
          type: "code",
          code: `# application.yml — 기본 풀은 HikariCP
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shop
    hikari:
      maximum-pool-size: 10   # 기본값도 10`,
        },
        {
          type: "tip",
          kind: "warn",
          text: "빌린 커넥션을 반납하지 않으면 풀이 바닥나고, 다음 요청들은 기다리다 시간 초과로 실패한다. `try-with-resources` 로 열면 알아서 반납된다.",
        },
        {
          type: "list",
          style: "check",
          items: ["연결 만들기가 비싸서 재사용한다", "빌림 → 사용 → 반납", "반납을 빼먹으면 풀이 마른다"],
        },
      ],
    },
    {
      id: "n-sv-2-6",
      emoji: "⚖️",
      title: "트랜잭션, 그리고 WAS 와 DB 늘리기",
      summary: "여러 SQL 을 한 묶음으로 처리하고, WAS 는 쉽게 DB 는 조심해서 늘린다",
      blocks: [
        { type: "key", text: "전부 성공하거나, 아무 일도 없었던 걸로" },
        {
          type: "figure",
          kind: "flow",
          nodes: [
            { icon: "🚩", label: "시작", sub: "BEGIN" },
            { icon: "💸", label: "A 계좌 -3000" },
            { icon: "💰", label: "B 계좌 +3000" },
            { icon: "✅", label: "확정", sub: "COMMIT", ink: "green" },
          ],
          edges: ["", "여기서 실패하면 ROLLBACK", ""],
        },
        { type: "h2", text: "트랜잭션" },
        {
          type: "code",
          code: `-- account: (1, 10000), (2, 0)
BEGIN;
UPDATE account SET balance = balance - 3000 WHERE id = 1;
-- 여기서 오류 발생!
ROLLBACK;

SELECT * FROM account;`,
          out: "1 | 10000\n2 | 0",
        },
        {
          type: "table",
          head: ["명령", "뜻"],
          rows: [
            ["`COMMIT`", "지금까지 한 일을 확정"],
            ["`ROLLBACK`", "시작 전 상태로 되돌림"],
          ],
        },
        {
          type: "p",
          text: "스프링에서는 서비스 메서드에 `@Transactional` 을 붙이면 메서드가 끝날 때 커밋, 예외가 나면 롤백된다.",
        },
        { type: "h2", text: "WAS 는 늘리기 쉽다" },
        {
          type: "compare",
          cols: [
            { title: "WAS", items: ["데이터를 스스로 들고 있지 않음", "똑같은 것을 여러 대 띄우면 끝", "한 대가 죽어도 다른 대가 받음"] },
            { title: "DB", items: ["데이터를 직접 들고 있음", "여러 대면 내용을 서로 맞춰야 함", "그래서 한 대를 크게 키우는 일이 많음"] },
          ],
        },
        { type: "h2", text: "그래서 WAS 는 무상태로" },
        {
          type: "tip",
          kind: "warn",
          text: "로그인 정보를 WAS 메모리에만 두면, 다음 요청이 다른 WAS 로 갔을 때 로그인이 풀린다. 세션은 Redis 같은 공용 저장소에 두거나 토큰(JWT)을 쓴다.",
        },
        {
          type: "list",
          style: "check",
          items: ["트랜잭션 = 전부 성공 아니면 전부 취소", "WAS 는 상태를 안 들고 있어 늘리기 쉽다", "오래 남길 값은 WAS 가 아니라 DB 나 공용 저장소에"],
        },
      ],
    },
  ],
};
