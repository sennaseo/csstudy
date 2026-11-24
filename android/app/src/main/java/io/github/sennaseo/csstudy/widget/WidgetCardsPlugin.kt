package io.github.sennaseo.csstudy.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.getcapacitor.JSArray
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

// 앱(웹뷰) → 위젯 다리.
// 웹의 "위젯 단어 고르기" 화면이 WidgetCards.setSelected({ ids }) 를 부르면,
// 고른 카드 id 를 위젯이 읽는 SharedPreferences 에 적고 홈 화면 위젯을 다시 그리게 한다.
// (웹 쪽 짝: src/utils/widgetCards.ts)
@CapacitorPlugin(name = "WidgetCards")
class WidgetCardsPlugin : Plugin() {

    @PluginMethod
    fun setSelected(call: PluginCall) {
        val arr = call.getArray("ids", JSArray()) ?: JSArray()
        val ids = HashSet<String>()
        for (i in 0 until arr.length()) {
            val id = arr.optString(i)
            if (id.isNotEmpty()) ids.add(id)
        }

        val app = context.applicationContext
        // commit(): 바로 아래에서 위젯을 다시 그리므로, 디스크에 적힌 뒤에 넘어가야 한다.
        app.getSharedPreferences(WIDGET_PREFS, Context.MODE_PRIVATE)
            .edit()
            .putStringSet(WIDGET_KEY_IDS, ids)
            .commit()

        // 홈에 놓인 위젯들에게 "다시 그려" 방송을 보낸다 (시스템이 주기적으로 보내는 것과 같은 방송).
        val mgr = AppWidgetManager.getInstance(app)
        val widgetIds = mgr.getAppWidgetIds(ComponentName(app, CardWidgetReceiver::class.java))
        if (widgetIds.isNotEmpty()) {
            app.sendBroadcast(
                Intent(app, CardWidgetReceiver::class.java)
                    .setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE)
                    .putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds)
            )
        }
        call.resolve()
    }
}
