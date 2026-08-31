package io.github.sennaseo.csstudy.widget

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.os.Bundle

// 검증용. adb 로는 위젯을 홈에 꽂는 명령이 없어서, 런처에게 "이거 하나 꽂아줘"라고 부탁하는 화면을 만든다.
// debug 소스셋에만 있으므로 릴리스 APK 에는 안 들어간다.
class PinWidgetActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val mgr = getSystemService(AppWidgetManager::class.java)
        if (mgr.isRequestPinAppWidgetSupported) {
            mgr.requestPinAppWidget(
                ComponentName(this, CardWidgetReceiver::class.java), null, null
            )
        }
        finish()
    }
}
