package io.github.sennaseo.csstudy.widget

import android.content.Context
import android.content.Intent
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.Composable
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.glance.background
import androidx.glance.currentState
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.color.ColorProvider
import androidx.glance.unit.ColorProvider
import org.json.JSONObject
import kotlin.random.Random

// ── 카드 데이터 ──────────────────────────────────────────────────────────
// 위젯은 앱 프로세스가 죽어도 런처가 다시 그린다. 그래서 웹앱의 localStorage 같은 건 못 쓰고,
// APK 안에 박혀 있는 assets/public/cards.json 을 그때그때 읽는다.
// (npx cap sync 가 public/ 을 여기로 복사해 준다.)
data class Card(
    val domain: String,
    val term: String,
    val oneLiner: String,
    val example: String,
)

private var cachedCards: List<Card>? = null

fun loadCards(context: Context): List<Card> {
    // 프로세스가 살아있는 동안은 한 번만 파싱. 120장짜리 JSON을 탭할 때마다 읽을 이유가 없다.
    cachedCards?.let { return it }
    val json = context.assets.open("public/cards.json").bufferedReader().use { it.readText() }
    val arr = JSONObject(json).getJSONArray("cards")
    val list = (0 until arr.length()).map { i ->
        val o = arr.getJSONObject(i)
        Card(
            domain = o.optString("domain"),
            term = o.optString("term"),
            oneLiner = o.optString("oneLiner"),
            example = o.optString("example"),
        )
    }
    cachedCards = list
    return list
}

// 도메인마다 이모지 하나. 위젯이 작아서 글자보다 그림이 먼저 눈에 들어온다.
fun domainEmoji(domain: String): String = when (domain) {
    "백엔드" -> "🛠"
    "프론트엔드" -> "🎨"
    "데이터베이스" -> "🗄"
    "인프라" -> "☁️"
    "CS" -> "🧠"
    else -> "📘"
}

// 직전 카드가 또 나오면 "버튼이 안 먹었나?" 싶다. 한 칸 밀어서 무조건 다른 카드가 되게 한다.
fun nextCardIndex(size: Int, current: Int): Int {
    if (size <= 1) return 0
    val next = Random.nextInt(size)
    return if (next == current) (next + 1) % size else next
}

// ── 상태 ────────────────────────────────────────────────────────────────
// Glance의 기본 상태 저장소는 위젯 인스턴스(glanceId)마다 파일이 따로 생긴다.
// 그래서 홈에 두 개를 놓으면 서로 다른 카드를 보게 되는 게 공짜로 된다.
val KEY_INDEX = intPreferencesKey("cardIndex")
val KEY_FLIPPED = booleanPreferencesKey("flipped")

// ── 색 ──────────────────────────────────────────────────────────────────
// 앱의 "손그림 스케치" 팔레트. Glance엔 CSS가 없으니 라이트/다크 색을 직접 한 쌍씩 준다.
private fun duo(light: Long, dark: Long) =
    ColorProvider(day = Color(light), night = Color(dark))

private val CardBg = duo(0xFFFFFDF8, 0xFF23221E)
private val PaperBg = duo(0xFFFBFAF7, 0xFF1B1A17)
private val Ink = duo(0xFF1B1A17, 0xFFF3F1EA)
private val InkSoft = duo(0xFF56534A, 0xFFB9B4A8)
private val Accent = duo(0xFF3B5BDB, 0xFF8DA2F0)

class CardWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val cards = loadCards(context)
        // 첫 카드는 "그리기 전에" 정해서 저장해 둔다.
        // 그리는 도중에 뽑으면 런처가 다시 그릴 때마다 다른 카드가 나와서, 뒤집어도 딴 카드가 보인다.
        updateAppWidgetState(context, id) { prefs ->
            if (prefs[KEY_INDEX] == null) prefs[KEY_INDEX] = Random.nextInt(cards.size)
        }
        provideContent {
            GlanceTheme {
                val prefs: Preferences = currentState()
                val index = (prefs[KEY_INDEX] ?: 0).coerceIn(0, cards.size - 1)
                val flipped = prefs[KEY_FLIPPED] ?: false
                CardBody(cards[index], flipped)
            }
        }
    }
}

@Composable
private fun CardBody(card: Card, flipped: Boolean) {
    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(PaperBg)
            .padding(6.dp)
    ) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(CardBg)
                .cornerRadius(14.dp)
                .padding(12.dp)
                // 카드 본문 아무데나 누르면 뒤집힌다. 별도 버튼을 두기엔 2x2가 너무 좁다.
                .clickable(actionRunCallback<FlipAction>()),
        ) {
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                // 뱃지를 누르면 앱이 열린다. 카드 본문(=뒤집기)과 겹치지 않는 유일한 여유 공간이다.
                Text(
                    text = domainEmoji(card.domain) + " " + card.domain,
                    style = TextStyle(color = Accent, fontSize = 11.sp, fontWeight = FontWeight.Medium),
                    modifier = GlanceModifier.clickable(actionRunCallback<OpenAppAction>()),
                )
                Spacer(modifier = GlanceModifier.defaultWeight())
                // "다음"은 글자로 충분하다. 아이콘 리소스를 새로 만들 이유가 없다.
                Text(
                    text = "다음 ▸",
                    style = TextStyle(color = InkSoft, fontSize = 11.sp, fontWeight = FontWeight.Medium),
                    modifier = GlanceModifier
                        .clickable(actionRunCallback<NextAction>())
                        .padding(horizontal = 4.dp, vertical = 2.dp),
                )
            }

            Spacer(modifier = GlanceModifier.height(6.dp))

            if (!flipped) {
                // 앞면: 용어만 크게. 여기서 답이 보이면 퀴즈가 아니다.
                Column(
                    modifier = GlanceModifier.fillMaxSize(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(
                        text = card.term,
                        style = TextStyle(color = Ink, fontSize = 22.sp, fontWeight = FontWeight.Bold),
                    )
                    Spacer(modifier = GlanceModifier.height(6.dp))
                    Text(text = "탭해서 뒤집기", style = TextStyle(color = InkSoft, fontSize = 10.sp))
                }
            } else {
                Column(modifier = GlanceModifier.fillMaxSize()) {
                    Text(
                        text = card.oneLiner,
                        style = TextStyle(color = Ink, fontSize = 13.sp, fontWeight = FontWeight.Bold),
                    )
                    Spacer(modifier = GlanceModifier.height(4.dp))
                    Text(text = card.example, style = TextStyle(color = InkSoft, fontSize = 11.sp))
                }
            }
        }
    }
}

// ── 액션 ────────────────────────────────────────────────────────────────
class FlipAction : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        updateAppWidgetState(context, glanceId) { it[KEY_FLIPPED] = !(it[KEY_FLIPPED] ?: false) }
        CardWidget().update(context, glanceId)
    }
}

class NextAction : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        val size = loadCards(context).size
        updateAppWidgetState(context, glanceId) { prefs ->
            prefs[KEY_INDEX] = nextCardIndex(size, prefs[KEY_INDEX] ?: -1)
            // 카드를 바꿀 땐 반드시 앞면부터. 뒤집힌 채로 다음 장이 오면 답부터 보인다.
            prefs[KEY_FLIPPED] = false
        }
        CardWidget().update(context, glanceId)
    }
}

class OpenAppAction : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        // Capacitor 앱은 https://localhost/ 로 서빙돼서 ?open=deck 같은 웹 쿼리를 인텐트로 넘길 방법이 마땅찮다.
        // 딥링크를 억지로 만들 값어치가 없어서 그냥 앱만 띄운다.
        context.packageManager.getLaunchIntentForPackage(context.packageName)?.let {
            it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(it)
        }
    }
}

class CardWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = CardWidget()
}
