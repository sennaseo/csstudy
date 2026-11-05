// =============================================================
// 공부노트 타일 라벨 — "꼭 볼 N가지" 포스터의 타일 한 칸에 들어가는 짧은 이름표.
// - short: 타일 굵은 제목. 3열 타일이라 8자 안팎 (긴 원래 제목은 상세 화면에서 보인다).
// - en   : 타일 아래 회색 영어 부제. 2~3단어.
// 노트를 새로 쓰면 여기에도 한 줄 추가 — notes.test.ts 가 빠진 걸 잡아낸다.
// =============================================================

export interface NoteLabel {
  short: string;
  en: string;
}

export const NOTE_LABELS: Record<string, NoteLabel> = {
  // ── 파이썬 · 기초문법 1
  "n-py-2-1": { short: "변수와 할당", en: "Variables" },
  "n-py-2-2": { short: "자료형 지도", en: "Data types" },
  "n-py-2-3": { short: "int·float", en: "Numbers" },
  "n-py-2-4": { short: "시퀀스·문자열", en: "Sequence & str" },
  "n-py-2-5": { short: "인덱싱·슬라이싱", en: "Slicing" },
  "n-py-2-6": { short: "스타일 가이드", en: "Style guide" },
  // ── 파이썬 · 기초문법 2
  "n-py-3-1": { short: "list·tuple", en: "Sequences" },
  "n-py-3-2": { short: "dict·set", en: "Non-sequences" },
  "n-py-3-3": { short: "형변환", en: "Type conversion" },
  "n-py-3-4": { short: "비교·논리 연산", en: "Operators" },
  "n-py-3-5": { short: "단축평가", en: "Short-circuit" },
  // ── 파이썬 · 함수와 제어문 1
  "n-py-4-1": { short: "함수 정의·호출", en: "Functions" },
  "n-py-4-2": { short: "매개변수와 인자", en: "Arguments" },
  "n-py-4-3": { short: "재귀 함수", en: "Recursion" },
  "n-py-4-4": { short: "내장 함수", en: "Built-ins" },
  "n-py-4-5": { short: "Scope·LEGB", en: "Scope" },
  "n-py-4-6": { short: "패킹·언패킹", en: "Packing" },
  "n-py-4-7": { short: "lambda", en: "Lambda" },
  // ── 파이썬 · 함수와 제어문 2
  "n-py-5-1": { short: "모듈 import", en: "Modules" },
  "n-py-5-2": { short: "패키지·pip", en: "Packages" },
  "n-py-5-3": { short: "조건문 if", en: "Conditionals" },
  "n-py-5-4": { short: "for 반복문", en: "For loop" },
  "n-py-5-5": { short: "while 반복문", en: "While loop" },
  "n-py-5-6": { short: "break·continue", en: "Loop control" },
  "n-py-5-7": { short: "컴프리헨션", en: "Comprehension" },
  // ── 파이썬 · 데이터 구조 1
  "n-py-6-1": { short: "자료구조·메서드", en: "Methods" },
  "n-py-6-2": { short: "문자열 탐색", en: "str search" },
  "n-py-6-3": { short: "문자열 조작", en: "str edit" },
  "n-py-6-4": { short: "리스트 추가·삭제", en: "list add/remove" },
  "n-py-6-5": { short: "리스트 정렬", en: "list sort" },
  "n-py-6-6": { short: "복사", en: "Copy" },
  "n-py-6-7": { short: "숫자 판별", en: "isdecimal" },
  // ── 파이썬 · 데이터 구조 2
  "n-py-7-1": { short: "딕셔너리 조회", en: "dict read" },
  "n-py-7-2": { short: "딕셔너리 변경", en: "dict update" },
  "n-py-7-3": { short: "세트 메서드", en: "set methods" },
  "n-py-7-4": { short: "집합 연산", en: "Set algebra" },
  "n-py-7-5": { short: "해시 테이블", en: "Hashable" },
  "n-py-7-6": { short: "BNF 읽기", en: "BNF / EBNF" },
  // ── 파이썬 · OOP 1
  "n-py-8-1": { short: "절차 vs 객체", en: "Paradigms" },
  "n-py-8-2": { short: "클래스·인스턴스", en: "Class & object" },
  "n-py-8-3": { short: "클래스 구조", en: "Class anatomy" },
  "n-py-8-4": { short: "메서드 3종", en: "Method types" },
  "n-py-8-5": { short: "매직 메서드", en: "Dunder" },
  // ── 파이썬 · OOP 2
  "n-py-9-1": { short: "상속", en: "Inheritance" },
  "n-py-9-2": { short: "다중 상속·MRO", en: "MRO" },
  "n-py-9-3": { short: "에러의 종류", en: "Debugging" },
  "n-py-9-4": { short: "try·except", en: "Exceptions" },
  "n-py-9-5": { short: "예외 심화", en: "EAFP / LBYL" },

  // ── 자바 · 자바 시작하기
  "n-jv-1-1": { short: "JDK·JRE·JVM", en: "Runtime" },
  "n-jv-1-2": { short: "main과 출력", en: "Hello World" },
  "n-jv-1-3": { short: "변수 선언", en: "Variables" },
  "n-jv-1-4": { short: "기본형 8가지", en: "Primitives" },
  "n-jv-1-5": { short: "형변환", en: "Casting" },
  "n-jv-1-6": { short: "상수 final", en: "Constants" },
  // ── 자바 · 연산자와 제어문
  "n-jv-2-1": { short: "산술·증감", en: "Arithmetic" },
  "n-jv-2-2": { short: "비교·논리·삼항", en: "Logic" },
  "n-jv-2-3": { short: "if 문", en: "Conditionals" },
  "n-jv-2-4": { short: "switch", en: "Switch" },
  "n-jv-2-5": { short: "반복문", en: "Loops" },
  "n-jv-2-6": { short: "break·라벨", en: "Loop control" },
  // ── 자바 · 배열과 문자열
  "n-jv-3-1": { short: "배열 만들기", en: "Arrays" },
  "n-jv-3-2": { short: "배열 순회", en: "Iteration" },
  "n-jv-3-3": { short: "다차원 배열", en: "2D arrays" },
  "n-jv-3-4": { short: "배열 복사", en: "Arrays utils" },
  "n-jv-3-5": { short: "String 비교", en: "Immutable" },
  "n-jv-3-6": { short: "StringBuilder", en: "String API" },
  // ── 자바 · 클래스와 객체
  "n-jv-4-1": { short: "클래스·객체", en: "Class & object" },
  "n-jv-4-2": { short: "필드와 메서드", en: "Members" },
  "n-jv-4-3": { short: "생성자·this", en: "Constructor" },
  "n-jv-4-4": { short: "오버로딩", en: "Overloading" },
  "n-jv-4-5": { short: "static", en: "Static" },
  "n-jv-4-6": { short: "캡슐화", en: "Encapsulation" },
  // ── 자바 · 상속과 다형성
  "n-jv-5-1": { short: "상속 extends", en: "Inheritance" },
  "n-jv-5-2": { short: "오버라이딩", en: "Overriding" },
  "n-jv-5-3": { short: "다형성", en: "Polymorphism" },
  "n-jv-5-4": { short: "final·Object", en: "Object class" },
  "n-jv-5-5": { short: "추상 클래스", en: "Abstract" },
  "n-jv-5-6": { short: "인터페이스", en: "Interface" },
  // ── 자바 · 예외 처리와 기본 API
  "n-jv-6-1": { short: "예외 계층", en: "Exceptions" },
  "n-jv-6-2": { short: "try-catch", en: "Catch" },
  "n-jv-6-3": { short: "throws·throw", en: "Checked" },
  "n-jv-6-4": { short: "자원 닫기", en: "Try-with-res" },
  "n-jv-6-5": { short: "래퍼 클래스", en: "Boxing" },
  "n-jv-6-6": { short: "Math·LocalDate", en: "Core API" },
  // ── 자바 · 제네릭과 컬렉션
  "n-jv-7-1": { short: "제네릭", en: "Generics" },
  "n-jv-7-2": { short: "컬렉션 지도", en: "Collections" },
  "n-jv-7-3": { short: "List", en: "ArrayList" },
  "n-jv-7-4": { short: "Set", en: "HashSet" },
  "n-jv-7-5": { short: "Map", en: "HashMap" },
  "n-jv-7-6": { short: "정렬 비교자", en: "Comparator" },
  // ── 자바 · 람다와 스트림
  "n-jv-8-1": { short: "람다식", en: "Lambda" },
  "n-jv-8-2": { short: "메서드 참조", en: "Method ref" },
  "n-jv-8-3": { short: "스트림 흐름", en: "Stream" },
  "n-jv-8-4": { short: "중간 연산", en: "filter·map" },
  "n-jv-8-5": { short: "최종 연산", en: "collect" },
  "n-jv-8-6": { short: "Optional", en: "Null safety" },
};
