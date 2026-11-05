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
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.LocalSize
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.LinearProgressIndicator
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.appWidgetBackground
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
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
// day/night 한 쌍을 받는 팩토리는 glance.color 쪽에 있고, 그게 돌려주는 타입은 glance.unit 쪽이다.
// 이름이 같아서 헷갈리지만 둘 다 있어야 한다.
import androidx.glance.color.ColorProvider
import androidx.glance.unit.ColorProvider
import io.github.sennaseo.csstudy.R
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
// 앱(tailwind.config.js)과 같은 팔레트: 흰 카드 + 잉크 회색 + 도메인색 칩.
// Glance엔 CSS가 없으니 라이트/다크 색을 직접 한 쌍씩 준다.
private fun duo(light: Long, dark: Long) =
    ColorProvider(day = Color(light), night = Color(dark))

private val CardBg = duo(0xFFFFFFFF, 0xFF1F2937)
private val Ink = duo(0xFF111827, 0xFFF9FAFB)      // ink-900 — 용어
private val InkBody = duo(0xFF1F2937, 0xFFE5E7EB)  // ink-700 — 정의
private val InkSoft = duo(0xFF4B5563, 0xFFC7CCD4)  // ink-500 — 비유
private val InkFaint = duo(0xFF6B7280, 0xFF9CA3AF) // ink-400 — 카운터·화살표
private val Track = duo(0xFFE5E7EB, 0xFF374151)    // ink-200 — 진행바 바탕
private val NoteBg = duo(0xFFF3F4F6, 0xFF111827)   // ink-100 — 비유 상자

// 도메인 5색. 진한 색(ink)은 칩 글자·진행바, 옅은 색(soft)은 칩 바탕.
// 칩 하나만 보고도 무슨 분야인지 알게 한다.
data class DomainPalette(val ink: ColorProvider, val soft: ColorProvider)

private val PalBackend = DomainPalette(duo(0xFF15803D, 0xFF86EFAC), duo(0xFFDCFCE7, 0xFF14532D))
private val PalFrontend = DomainPalette(duo(0xFFC2410C, 0xFFFDBA74), duo(0xFFFFEDD5, 0xFF7C2D12))
private val PalDatabase = DomainPalette(duo(0xFF1D4ED8, 0xFF93C5FD), duo(0xFFEFF4FF, 0xFF1E3A8A))
private val PalInfra = DomainPalette(duo(0xFF6D28D9, 0xFFC4B5FD), duo(0xFFEDE9FE, 0xFF4C1D95))
private val PalCS = DomainPalette(duo(0xFFB91C1C, 0xFFFCA5A5), duo(0xFFFEE2E2, 0xFF7F1D1D))

fun domainPalette(domain: String): DomainPalette = when (domain) {
    "백엔드" -> PalBackend
    "프론트엔드" -> PalFrontend
    "데이터베이스" -> PalDatabase
    "인프라" -> PalInfra
    "CS" -> PalCS
    else -> PalDatabase
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
    val large = h >= 240.dp
    val medium = h >= 170.dp
    val termLines = if (large) 2 else 1
    val oneLinerLines = if (large) 3 else 2
    // S 에선 비유 상자를 아예 뺀다. 한 줄짜리 상자는 잘린 글만 보여서 오히려 지저분하다.
    val exampleLines = when {
        large -> 5
        medium -> 2
        else -> 0
    }
    val pal = domainPalette(card.domain)

    // 카드가 위젯 칸 전체를 채운다. appWidgetBackground 를 달아야 안드로이드 12+ 런처가
    // 이걸 "위젯 배경"으로 알고 모서리를 시스템 반경에 맞춰 깎아 준다.
    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .appWidgetBackground()
            .background(CardBg)
            .cornerRadius(24.dp),
    ) {
        // Box 는 FrameLayout 으로 번역돼서 자식이 겹쳐 쌓인다.
        // 아래층에 좌/우 히트존을 깔고 위층에 글을 얹는데, 위층엔 clickable 을 걸지 않는다.
        // 클릭 없는 뷰는 터치를 삼키지 않으니, 글자 위를 눌러도 손가락이 아래층까지 통과한다.

        // [아래층] 왼쪽 절반이 이전, 오른쪽 절반이 다음. 작은 버튼을 조준할 필요가 없다.
        Row(modifier = GlanceModifier.fillMaxSize()) {
            Box(
                modifier = GlanceModifier
                    .defaultWeight()
                    .fillMaxHeight()
                    .padding(start = 5.dp)
                    .clickable(actionRunCallback<PrevAction>()),
                contentAlignment = Alignment.CenterStart,
            ) {
                Text(text = "‹", style = TextStyle(color = InkFaint, fontSize = 20.sp, fontWeight = FontWeight.Bold))
            }
            Box(
                modifier = GlanceModifier
                    .defaultWeight()
                    .fillMaxHeight()
                    .padding(end = 5.dp)
                    .clickable(actionRunCallback<NextAction>()),
                contentAlignment = Alignment.CenterEnd,
            ) {
                Text(text = "›", style = TextStyle(color = InkFaint, fontSize = 20.sp, fontWeight = FontWeight.Bold))
            }
        }

        // [위층] 내용. 여기나 안쪽 Text 에 clickable 이 붙는 순간 좌/우 넘기기가 죽는다.
        Column(modifier = GlanceModifier.fillMaxSize()) {
            // 글 묶음이 남는 높이를 전부 먹는다. 글이 넘치면 여기서 잘리고,
            // 아래 진행바는 항상 제자리에 남는다.
            Column(
                modifier = GlanceModifier
                    .defaultWeight()
                    .fillMaxWidth()
                    .padding(start = 20.dp, end = 20.dp, top = 12.dp),
            ) {
                // 헤더 줄만 예외. 이 띠에서만 터치를 삼켜서 앱으로 들어간다.
                Row(
                    modifier = GlanceModifier
                        .fillMaxWidth()
                        .clickable(actionRunCallback<OpenAppAction>()),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    // 도메인 칩 — 옅은 바탕에 진한 글자. 앱의 태그 칩과 같은 모양.
                    Box(
                        modifier = GlanceModifier
                            .background(pal.soft)
                            .cornerRadius(12.dp)
                            .padding(horizontal = 9.dp, vertical = 3.dp),
                    ) {
                        Text(
                            text = domainEmoji(card.domain) + " " + card.domain,
                            style = TextStyle(color = pal.ink, fontSize = 12.sp, fontWeight = FontWeight.Bold),
                        )
                    }
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    Text(
                        text = "${index + 1} / $total",
                        style = TextStyle(color = InkFaint, fontSize = 11.sp, fontWeight = FontWeight.Medium),
                    )
                    Spacer(modifier = GlanceModifier.width(6.dp))
                    // 마스코트 먼지요정. 앱에서 보던 얼굴이 홈 화면에도 있으면 "그 앱"이라는 게 바로 보이고,
                    // 헤더를 누르면 앱이 열린다는 단서도 된다.
                    Image(
                        provider = ImageProvider(R.drawable.widget_mascot),
                        contentDescription = "앱 열기",
                        modifier = GlanceModifier.size(if (medium) 28.dp else 22.dp),
                    )
                }

                Spacer(modifier = GlanceModifier.height(if (medium) 8.dp else 4.dp))
                Text(
                    text = card.term,
                    style = TextStyle(
                        color = Ink,
                        fontSize = if (medium) 21.sp else 18.sp,
                        fontWeight = FontWeight.Bold,
                    ),
                    maxLines = termLines,
                )
                Spacer(modifier = GlanceModifier.height(2.dp))
                Text(
                    text = card.oneLiner,
                    style = TextStyle(color = InkBody, fontSize = 14.sp, fontWeight = FontWeight.Medium),
                    maxLines = oneLinerLines,
                )

                if (exampleLines > 0) {
                    Spacer(modifier = GlanceModifier.height(8.dp))
                    // 비유는 회색 쪽지 상자에. 정의(사실)와 비유(이해를 돕는 말)를 눈으로 갈라 준다.
                    Box(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .background(NoteBg)
                            .cornerRadius(12.dp)
                            .padding(horizontal = 10.dp, vertical = 7.dp),
                    ) {
                        Text(
                            text = "💡 " + card.example,
                            style = TextStyle(color = InkSoft, fontSize = 13.sp, fontWeight = FontWeight.Normal),
                            maxLines = exampleLines,
                        )
                    }
                }
            }

            // 바닥: 120장 중 어디쯤인지 도메인색 진행바로. 숫자를 안 읽어도 감이 온다.
            Box(
                modifier = GlanceModifier
                    .fillMaxWidth()
                    .padding(start = 20.dp, end = 20.dp, top = 6.dp, bottom = 10.dp),
            ) {
                LinearProgressIndicator(
                    progress = (index + 1).toFloat() / total.coerceAtLeast(1),
                    modifier = GlanceModifier.fillMaxWidth().height(3.dp),
                    color = pal.ink,
                    backgroundColor = Track,
                )
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
