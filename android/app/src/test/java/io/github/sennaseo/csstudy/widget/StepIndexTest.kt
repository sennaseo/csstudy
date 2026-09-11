package io.github.sennaseo.csstudy.widget

import org.junit.Assert.assertEquals
import org.junit.Test

class StepIndexTest {
    // 마지막 카드에서 다음(+1)으로 넘어가면 처음(0)으로 순환해야 한다.
    @Test
    fun `마지막에서 다음으로 가면 처음으로 순환한다`() {
        assertEquals("마지막 다음은 처음이어야 한다", 0, stepIndex(120, 119, 1))
    }

    // 처음 카드에서 이전(-1)으로 넘어가면 마지막으로 순환해야 한다. 음수 delta 처리 확인.
    @Test
    fun `처음에서 이전으로 가면 마지막으로 순환한다`() {
        assertEquals("처음 이전은 마지막이어야 한다", 119, stepIndex(120, 0, -1))
    }

    // 순환이 아닌 평범한 전진도 깨지면 안 된다.
    @Test
    fun `평범한 전진은 그냥 다음 인덱스다`() {
        assertEquals("5 다음은 6이어야 한다", 6, stepIndex(120, 5, 1))
    }

    // 카드가 1장뿐이면 어느 방향으로 움직여도 제자리여야 한다.
    @Test
    fun `카드가 한 장이면 어디로 가도 제자리다`() {
        assertEquals("카드가 1장이면 항상 0이어야 한다", 0, stepIndex(1, 0, -1))
    }

    // 카드가 0장인 극단 상황에서 나누기 0으로 터지면 안 된다.
    @Test
    fun `카드가 0장이어도 나누기 0으로 터지지 않는다`() {
        assertEquals("카드가 0장이면 0을 반환해야 한다", 0, stepIndex(0, 3, 1))
    }

    // 이 변경의 핵심 목적: 다음을 갔다가 이전으로 돌아오면 원래 자리여야 한다.
    // 전 범위(0..119)에서 이 왕복 성질이 깨지면 좌/우 탭 순환 로직에 회귀가 생긴 것이다.
    @Test
    fun `다음으로 갔다가 이전으로 돌아오면 원래 자리다`() {
        val size = 120
        for (current in 0 until size) {
            val next = stepIndex(size, current, 1)
            val back = stepIndex(size, next, -1)
            assertEquals("다음-이전 왕복 후 원래 자리로 돌아오지 않았다: current=$current", current, back)
        }
    }
}
