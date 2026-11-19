// WAS·DB 단원 1 — WAS 기초. 작성 규칙은 ../python.ts 상단 주석.
import type { NoteUnit } from "../types";

export const SV1: NoteUnit = {
  id: "sv-1",
  title: "WAS 기초",
  notes: [
    {
      id: "n-sv-1-1",
      emoji: "🧑‍🍳",
      title: "웹 서버와 WAS",
      summary: "이미 만들어진 파일을 건네는 웹 서버, 요청마다 코드를 돌려 만드는 WAS",
      blocks: [
        { type: "key", text: "웹 서버는 진열대, WAS 는 주문받고 요리하는 주방" },
        {
          type: "figure",
          kind: "tree",
          root: { icon: "🌐", label: "브라우저 요청" },
          children: [
            { icon: "🗂️", label: "웹 서버", sub: "정적 파일", ink: "blue", leaves: ["HTML·CSS·JS", "이미지"] },
            { icon: "🧑‍🍳", label: "WAS", sub: "동적 처리", ink: "red", leaves: ["로그인", "주문·결제"] },
          ],
        },
        { type: "h2", text: "정적 vs 동적" },
        {
          type: "compare",
          cols: [
            { title: "정적 콘텐츠", items: ["누가 요청해도 똑같은 파일", "로고 이미지, CSS, JS 파일", "꺼내서 주기만 하면 됨"] },
            { title: "동적 콘텐츠", items: ["요청한 사람·시점마다 다른 결과", "내 장바구니, 검색 결과", "코드를 실행해야 나옴"] },
          ],
        },
        { type: "h2", text: "둘의 역할" },
        {
          type: "table",
          head: ["", "웹 서버", "WAS"],
          rows: [
            ["하는 일", "파일을 찾아 그대로 전달", "코드를 실행해 응답을 만듦"],
            ["DB 접근", "안 함", "함"],
            ["대표 제품", "Nginx, Apache", "Tomcat, Jetty"],
          ],
        },
        {
          type: "tip",
          kind: "analogy",
          text: "편의점 진열대(웹 서버)는 이미 포장된 삼각김밥을 바로 건넨다. 주방(WAS)은 주문을 듣고 그 자리에서 만든다.",
        },
        { type: "h2", text: "WAS 라는 이름" },
        {
          type: "p",
          text: "WAS 는 Web Application Server 의 줄임말이다. 웹 애플리케이션(내가 짠 서버 코드)을 올려서 실행해 주는 프로그램이다.",
        },
        {
          type: "list",
          style: "check",
          items: ["정적 = 그대로 전달, 동적 = 실행해서 생성", "웹 서버는 파일 담당, WAS 는 코드 실행 담당", "DB 에 다녀오는 쪽은 WAS"],
        },
      ],
    },
    {
      id: "n-sv-1-2",
      emoji: "🏢",
      title: "3계층 구조: 웹 서버 → WAS → DB",
      summary: "요청은 웹 서버, WAS, DB 순으로 들어가고 응답은 거꾸로 돌아온다",
      blocks: [
        { type: "key", text: "앞에서 받고, 가운데서 처리하고, 뒤에서 보관한다" },
        {
          type: "figure",
          kind: "flow",
          nodes: [
            { icon: "🌐", label: "브라우저", sub: "요청 보냄" },
            { icon: "🗂️", label: "웹 서버", sub: "받아서 넘김", ink: "blue" },
            { icon: "🧑‍🍳", label: "WAS", sub: "로직 실행", ink: "red" },
            { icon: "🗄️", label: "DB", sub: "데이터 보관", ink: "green" },
          ],
          edges: ["HTTP", "동적 요청만", "SQL"],
        },
        { type: "h2", text: "세 층의 이름" },
        {
          type: "table",
          head: ["층", "맡는 일", "예"],
          rows: [
            ["표현 계층", "요청 접수, 정적 파일", "Nginx"],
            ["애플리케이션 계층", "업무 로직 실행", "Tomcat + 스프링"],
            ["데이터 계층", "데이터 저장·조회", "MySQL"],
          ],
        },
        { type: "h2", text: "로그인 요청 따라가기" },
        {
          type: "list",
          style: "flow",
          items: [
            "브라우저가 아이디·비밀번호를 담아 요청",
            "웹 서버가 받아 WAS 로 넘김",
            "WAS 가 DB 에 회원 정보를 물어봄",
            "DB 가 찾은 행을 돌려줌",
            "WAS 가 비밀번호를 비교해 결과를 만듦",
            "웹 서버를 거쳐 브라우저로 응답",
          ],
        },
        { type: "h2", text: "왜 나누나" },
        {
          type: "compare",
          cols: [
            { title: "한 덩어리", tone: "bad", items: ["한 곳이 죽으면 전부 멈춤", "느린 부분만 따로 못 늘림", "DB 가 인터넷에 그대로 노출"] },
            { title: "세 층 분리", tone: "good", items: ["층마다 따로 고치고 교체", "붐비는 층만 대수를 늘림", "DB 는 안쪽 망에 숨김"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["웹 서버 → WAS → DB, 응답은 반대 방향", "브라우저는 DB 와 직접 말하지 않는다", "나누면 층별로 늘리고 지킬 수 있다"],
        },
      ],
    },
    {
      id: "n-sv-1-3",
      emoji: "🛡️",
      title: "웹 서버를 WAS 앞에 두는 이유",
      summary: "정적 파일은 앞에서 끝내고, 요청을 나눠 주고, WAS 를 가려 준다",
      blocks: [
        { type: "key", text: "WAS 는 비싼 일만 하게 하고, 나머지는 앞에서 막아 준다" },
        {
          type: "figure",
          kind: "tree",
          root: { icon: "🗂️", label: "웹 서버", sub: "리버스 프록시", ink: "blue" },
          children: [
            { icon: "🧑‍🍳", label: "WAS 1" },
            { icon: "🧑‍🍳", label: "WAS 2" },
            { icon: "🧑‍🍳", label: "WAS 3" },
          ],
          caption: "앞에서 받아 뒤쪽 WAS 여러 대에 나눠 준다",
        },
        { type: "h2", text: "세 가지 이유" },
        {
          type: "table",
          head: ["이유", "설명"],
          rows: [
            ["부담 덜기", "이미지·CSS 같은 정적 파일은 웹 서버가 바로 응답"],
            ["나눠 주기", "WAS 여러 대에 요청을 고르게 분배 (로드 밸런싱)"],
            ["가려 주기", "WAS 주소를 숨기고 HTTPS 처리도 앞에서 맡음"],
          ],
        },
        { type: "h2", text: "Nginx 설정 맛보기" },
        {
          type: "code",
          code: `server {
    listen 80;

    # 정적 파일은 여기서 바로 응답
    location /static/ {
        root /var/www;
    }

    # 나머지는 WAS(톰캣 8080)로 넘김
    location / {
        proxy_pass http://localhost:8080;
    }
}`,
        },
        {
          type: "tip",
          kind: "memo",
          text: "요청을 대신 받아 뒤쪽 서버로 넘기는 역할을 리버스 프록시라고 부른다. WAS 한 대가 죽어도 웹 서버가 살아 있는 쪽으로만 보내면 서비스는 계속된다.",
        },
        { type: "h2", text: "스프링 부트는?" },
        {
          type: "p",
          text: "스프링 부트는 톰캣을 안에 품고 있어서 혼자서도 요청을 받는다. 공부할 땐 그대로 쓰고, 실제 서비스에선 보통 앞에 Nginx 를 둔다.",
        },
        {
          type: "list",
          style: "check",
          items: ["정적 파일은 웹 서버가 끝낸다", "WAS 여러 대에 요청을 나눠 준다", "WAS 는 뒤에 숨는다"],
        },
      ],
    },
    {
      id: "n-sv-1-4",
      emoji: "🐱",
      title: "톰캣과 서블릿",
      summary: "서블릿은 요청을 처리하는 자바 클래스, 톰캣은 그걸 실행해 주는 WAS",
      blocks: [
        { type: "key", text: "톰캣이 요청을 받아 알맞은 서블릿을 불러 준다" },
        {
          type: "figure",
          kind: "stack",
          nested: true,
          layers: [
            { icon: "🐱", label: "톰캣", sub: "서블릿 컨테이너 (WAS)" },
            { icon: "🚦", label: "DispatcherServlet", sub: "스프링의 대표 서블릿" },
            { icon: "🎮", label: "내 컨트롤러", sub: "내가 짠 코드" },
          ],
          caption: "요청은 바깥에서 안쪽으로 전달된다",
        },
        { type: "h2", text: "용어 정리" },
        {
          type: "table",
          head: ["용어", "뜻"],
          rows: [
            ["서블릿", "HTTP 요청을 받아 응답을 만드는 자바 클래스"],
            ["서블릿 컨테이너", "서블릿을 만들고 부르고 없애는 관리자"],
            ["톰캣", "가장 널리 쓰이는 서블릿 컨테이너"],
          ],
        },
        { type: "h2", text: "톰캣이 대신 해 주는 일" },
        {
          type: "list",
          style: "flow",
          items: [
            "포트(8080)를 열고 연결을 기다림",
            "들어온 HTTP 글자를 요청 객체로 바꿈",
            "주소에 맞는 서블릿을 찾아 실행",
            "응답 객체를 HTTP 글자로 바꿔 돌려줌",
          ],
        },
        { type: "h2", text: "서블릿 직접 써 보기" },
        {
          type: "code",
          code: `@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String name = req.getParameter("name");
        resp.getWriter().write("hello " + name);
    }
}`,
        },
        {
          type: "compare",
          cols: [
            { title: "서블릿 직접", items: ["요청·응답 객체를 손으로 다룸", "주소마다 클래스 하나"] },
            { title: "스프링 MVC", items: ["`@GetMapping` 메서드만 작성", "서블릿은 스프링이 하나로 처리"] },
          ],
        },
        {
          type: "list",
          style: "check",
          items: ["서블릿 = 요청 처리 클래스", "톰캣 = 서블릿을 돌려 주는 WAS", "스프링도 결국 톰캣 위의 서블릿 하나"],
        },
      ],
    },
    {
      id: "n-sv-1-5",
      emoji: "🧵",
      title: "스레드 풀: 여러 요청 동시에 받기",
      summary: "요청 하나에 스레드 하나, 스레드는 미리 만들어 두고 돌려 쓴다",
      blocks: [
        { type: "key", text: "요청마다 직원 한 명, 직원은 미리 뽑아 두고 돌려 쓴다" },
        {
          type: "figure",
          kind: "cycle",
          nodes: [
            { icon: "📨", label: "요청 도착" },
            { icon: "🧵", label: "스레드 빌림", ink: "blue" },
            { icon: "⚙️", label: "처리·응답", ink: "red" },
            { icon: "↩️", label: "스레드 반납", ink: "green" },
          ],
        },
        { type: "h2", text: "매번 새로 만들면" },
        {
          type: "compare",
          cols: [
            { title: "요청마다 생성", tone: "bad", items: ["만들고 없애는 비용이 큼", "요청이 몰리면 끝없이 늘어남", "메모리가 바닥나 서버가 죽음"] },
            { title: "스레드 풀", tone: "good", items: ["미리 만든 것을 재사용", "최대 개수가 정해져 있음", "넘치는 요청은 줄 서서 대기"] },
          ],
        },
        { type: "h2", text: "톰캣 기본값" },
        {
          type: "table",
          head: ["설정", "기본값", "뜻"],
          rows: [
            ["`threads.max`", "200", "동시에 일하는 스레드 최대 수"],
            ["`accept-count`", "100", "스레드가 꽉 찼을 때 대기 줄 길이"],
          ],
        },
        {
          type: "code",
          code: `# application.yml
server:
  tomcat:
    threads:
      max: 200
    accept-count: 100`,
        },
        { type: "h2", text: "그래서 조심할 것" },
        {
          type: "tip",
          kind: "warn",
          text: "여러 스레드가 컨트롤러·서비스 객체 하나를 같이 쓴다. 필드에 요청별 값(로그인한 사람 이름 등)을 저장하면 다른 사람 요청과 섞인다. 값은 지역 변수에 둔다.",
        },
        {
          type: "p",
          text: "느린 작업(오래 걸리는 DB 조회, 외부 API)이 스레드를 붙잡고 있으면 풀이 금방 바닥난다. 그러면 가벼운 요청까지 줄을 서게 된다.",
        },
        {
          type: "list",
          style: "check",
          items: ["요청 1개 = 스레드 1개", "스레드는 풀에서 빌리고 반납", "공유 객체 필드에 요청별 값을 두지 않는다"],
        },
      ],
    },
  ],
};
