import React, {useEffect, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {SafeAreaView, Platform} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
import {WebviewBridge} from '../../bridge';

type Props = StackScreenProps<RootStackParamList, 'MyWebview'>;
function MyWebview({navigation, route}: Props) {
  async function openTimer() {
    navigation.navigate('Timer');
  }

  const webviewRef = useRef<WebView | null>(null);
  const params = route.params;

  useEffect(() => {
    if (!webviewRef.current) return;
    if (!params) return;

    if (params.timer) {
      const {startTime, endTime} = params.timer;
      const bridge = new WebviewBridge(webviewRef.current);
      bridge.openCreatePracticeDialog(startTime, endTime);
    }
  }, [params, webviewRef]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        ref={webviewRef}
        injectedJavaScriptBeforeContentLoaded={`window.isJuniNative = true`}
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
