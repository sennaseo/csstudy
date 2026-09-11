package io.github.sennaseo.csstudy.widget

import android.content.Context
import android.content.Intent
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.Composable
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.glance.background
import androidx.glance.currentState
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxHeight
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
// day/night 한 쌍을 받는 팩토리는 glance.color 쪽에 있고, 그게 돌려주는 타입은 glance.unit 쪽이다.
// 이름이 같아서 헷갈리지만 둘 다 있어야 한다.
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

// 순환 인덱스. 음수 delta도 안전하게 감싼다.
fun stepIndex(size: Int, current: Int, delta: Int): Int =
    if (size <= 0) 0 else ((current + delta) % size + size) % size
// ponytail: 순차라 도메인 30장이 연달아 나온다. 거슬리면 셔플 순서를 prefs에 문자열로 저장하는 식으로 승격.

// ── 상태 ────────────────────────────────────────────────────────────────
// Glance의 기본 상태 저장소는 위젯 인스턴스(glanceId)마다 파일이 따로 생긴다.
// 그래서 홈에 두 개를 놓으면 서로 다른 카드를 보게 되는 게 공짜로 된다.
val KEY_INDEX = intPreferencesKey("cardIndex")

// ── 색 ──────────────────────────────────────────────────────────────────
// 앱의 "손그림 스케치" 팔레트. Glance엔 CSS가 없으니 라이트/다크 색을 직접 한 쌍씩 준다.
private fun duo(light: Long, dark: Long) =
    ColorProvider(day = Color(light), night = Color(dark))

private val CardBg = duo(0xFFFFFDF8, 0xFF23221E)
private val PaperBg = duo(0xFFFBFAF7, 0xFF1B1A17)
private val Ink = duo(0xFF1B1A17, 0xFFF3F1EA)
private val InkSoft = duo(0xFF56534A, 0xFFB9B4A8)
// 화살표나 "37/120" 처럼, 있는 줄은 알지만 굳이 읽지는 않는 것들. 배경보다 아주 조금만 진하다.
private val InkFaint = duo(0xFFB5B0A4, 0xFF5C5850)

// 도메인 5색. 책장에 꽂힌 책등 색처럼, 왼쪽 띠 한 줄만 보고도 무슨 분야인지 알게 한다.
private val DomainBackend = duo(0xFF2B7A57, 0xFF7FD1A6)
private val DomainFrontend = duo(0xFFD2691E, 0xFFF2A96B)
private val DomainDatabase = duo(0xFF3B5BDB, 0xFF8DA2F0)
private val DomainInfra = duo(0xFF6D4FB3, 0xFFB9A6EA)
private val DomainCS = duo(0xFFB8323F, 0xFFEF8B95)

fun domainColor(domain: String): ColorProvider = when (domain) {
    "백엔드" -> DomainBackend
    "프론트엔드" -> DomainFrontend
    "데이터베이스" -> DomainDatabase
    "인프라" -> DomainInfra
    "CS" -> DomainCS
    else -> DomainDatabase
}

class CardWidget : GlanceAppWidget() {

    // 런처가 주는 크기는 제각각이다. "이 셋 중 가장 가까운 것"으로 골라 그리게 해서,
    // 옷을 S/M/L 세 벌만 만들어 두고 몸에 맞는 걸 입히는 식으로 처리한다.
    override val sizeMode = SizeMode.Responsive(setOf(
        DpSize(250.dp, 110.dp), DpSize(250.dp, 170.dp), DpSize(250.dp, 240.dp)
    ))

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val cards = loadCards(context)
        // 첫 카드는 "그리기 전에" 정해서 저장해 둔다.
        // 그리는 도중에 뽑으면 런처가 다시 그릴 때마다 다른 카드가 나온다.
        updateAppWidgetState(context, id) { prefs ->
            if (prefs[KEY_INDEX] == null) prefs[KEY_INDEX] = Random.nextInt(cards.size)
        }
        provideContent {
            val prefs: Preferences = currentState()
            val index = (prefs[KEY_INDEX] ?: 0).coerceIn(0, cards.size - 1)
            CardBody(cards[index], index, cards.size)
        }
    }
}

@Composable
private fun CardBody(card: Card, index: Int, total: Int) {
    // 키가 클수록 글자를 더 풀어 준다. 전부 >= 비교라서, 표에 없는 낯선 크기가 와도
    // 어느 문턱도 못 넘고 가장 작은 S 로 안전하게 떨어진다.
    val h = LocalSize.current.height
    val termLines = if (h >= 240.dp) 2 else 1
    val oneLinerLines = if (h >= 240.dp) 3 else 2
    val exampleLines = when {
        h >= 240.dp -> 8
        h >= 170.dp -> 4
        else -> 2
    }

    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(PaperBg)
            .padding(4.dp)
    ) {
        Row(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(CardBg)
                .cornerRadius(16.dp),
        ) {
            // 도메인 책등.
            Box(
                modifier = GlanceModifier
                    .width(5.dp)
                    .fillMaxHeight()
                    .background(domainColor(card.domain)),
            ) {}

            // Box 는 FrameLayout 으로 번역돼서 자식이 겹쳐 쌓인다.
            // 아래층에 좌/우 히트존을 깔고 위층에 글을 얹는데, 위층엔 clickable 을 걸지 않는다.
            // 클릭 없는 뷰는 터치를 삼키지 않으니, 글자 위를 눌러도 손가락이 아래층까지 통과한다.
            Box(
                modifier = GlanceModifier.defaultWeight().fillMaxHeight(),
            ) {
                // [아래층] 왼쪽 절반이 이전, 오른쪽 절반이 다음. 작은 버튼을 조준할 필요가 없다.
                Row(modifier = GlanceModifier.fillMaxSize()) {
                    Box(
                        modifier = GlanceModifier
                            .defaultWeight()
                            .fillMaxHeight()
                            .padding(start = 6.dp)
                            .clickable(actionRunCallback<PrevAction>()),
                        contentAlignment = Alignment.CenterStart,
                    ) {
                        Text(text = "‹", style = TextStyle(color = InkFaint, fontSize = 22.sp))
                    }
                    Box(
                        modifier = GlanceModifier
                            .defaultWeight()
                            .fillMaxHeight()
                            .padding(end = 6.dp)
                            .clickable(actionRunCallback<NextAction>()),
                        contentAlignment = Alignment.CenterEnd,
                    ) {
                        Text(text = "›", style = TextStyle(color = InkFaint, fontSize = 22.sp))
                    }
                }

                // [위층] 내용. 여기나 안쪽 Text 에 clickable 이 붙는 순간 좌/우 넘기기가 죽는다.
                Column(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .padding(horizontal = 20.dp, vertical = 10.dp)
                ) {
                    // 헤더 줄만 예외. 이 띠에서만 터치를 삼켜서 앱으로 들어간다.
                    Row(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .clickable(actionRunCallback<OpenAppAction>()),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = domainEmoji(card.domain) + " " + card.domain,
                            style = TextStyle(
                                color = domainColor(card.domain),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                            ),
                        )
                        Spacer(modifier = GlanceModifier.defaultWeight())
                        Text(
                            text = "${index + 1}/$total ↗",
                            style = TextStyle(color = InkFaint, fontSize = 11.sp),
                        )
                    }

                    Spacer(modifier = GlanceModifier.height(6.dp))
                    Text(
                        text = card.term,
                        style = TextStyle(color = Ink, fontSize = 18.sp, fontWeight = FontWeight.Bold),
                        maxLines = termLines,
                    )
                    Spacer(modifier = GlanceModifier.height(4.dp))
                    Text(
                        text = card.oneLiner,
                        style = TextStyle(color = Ink, fontSize = 15.sp, fontWeight = FontWeight.Medium),
                        maxLines = oneLinerLines,
                    )
                    Spacer(modifier = GlanceModifier.height(6.dp))
                    Text(
                        text = card.example,
                        style = TextStyle(color = InkSoft, fontSize = 14.sp, fontWeight = FontWeight.Normal),
                        maxLines = exampleLines,
                    )
                }
            }
        }
    }
}

// ── 액션 ────────────────────────────────────────────────────────────────
class PrevAction : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        val size = loadCards(context).size
        updateAppWidgetState(context, glanceId) { prefs ->
            prefs[KEY_INDEX] = stepIndex(size, prefs[KEY_INDEX] ?: 0, -1)
        }
        CardWidget().update(context, glanceId)
    }
}

class NextAction : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        val size = loadCards(context).size
        updateAppWidgetState(context, glanceId) { prefs ->
            prefs[KEY_INDEX] = stepIndex(size, prefs[KEY_INDEX] ?: 0, 1)
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
