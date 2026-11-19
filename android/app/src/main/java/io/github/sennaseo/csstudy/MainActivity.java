package io.github.sennaseo.csstudy;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import io.github.sennaseo.csstudy.widget.WidgetCardsPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // 앱에서 고른 "위젯에 띄울 단어"를 위젯 쪽 저장소로 넘겨 주는 플러그인.
        // super.onCreate 가 브리지를 만들기 전에 등록해야 웹에서 보인다.
        registerPlugin(WidgetCardsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
