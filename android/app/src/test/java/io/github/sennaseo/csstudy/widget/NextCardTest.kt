package io.github.sennaseo.csstudy.widget

import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class NextCardTest {
    // "직전 카드는 다시 안 나온다"는 규칙이 깨지면 여기서 잡힌다.
    // 카드가 120장이라 랜덤으로 우연히 통과할 수 있으니 여러 번 돌린다.
    @Test
    fun `다음 카드는 직전 카드와 절대 같지 않다`() {
        val size = 120
        for (current in 0 until size) {
            repeat(50) {
                val next = nextCardIndex(size, current)
                assertNotEquals("직전 카드가 또 나왔다", current, next)
                assertTrue("범위를 벗어났다: $next", next in 0 until size)
            }
        }
    }
}
