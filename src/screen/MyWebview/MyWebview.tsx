import React from 'react';
import {WebView} from 'react-native-webview';
import {SafeAreaView, Platform} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/core';

type ScreenParamList = {
  Timer: {};
};

function MyWebview() {
  const navigation = useNavigation<NavigationProp<ScreenParamList>>();

  async function openTimer() {
    navigation.navigate('Timer', {});
  }

  // 시간 측정하고 웹뷰로 넘기기

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        userAgent={
          Platform.OS === 'android'
            ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
            : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'
        }
        source={{uri: 'http://172.30.1.100:2001'}}
        // source={{uri: 'https://juni.vercel.app/'}}
        sharedCookiesEnabled
        domStorageEnabled
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onMessage={event => {
          console.log('@@event', event.nativeEvent.data);
          if (event.nativeEvent.data === 'openTimer') {
            openTimer();
          }
        }}
      />
    </SafeAreaView>
  );
}

export default MyWebview;
