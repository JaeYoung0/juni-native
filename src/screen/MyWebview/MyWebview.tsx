import React, {useCallback, useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {SafeAreaView, Platform} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
import useWebviewBridge from '../../bridge';

type Props = StackScreenProps<RootStackParamList, 'MyWebview'>;
function MyWebview({route}: Props) {
  const [webview, setWebview] = useState<WebView | null>(null);

  const webviewRef = useCallback(
    (el: WebView) => {
      if (!el) return;
      if (webview) return;

      setWebview(el);
    },
    [webview],
  );

  const params = route.params;

  const {openCreatePracticeDialog, handleWebviewMessage, handleWebviewError} =
    useWebviewBridge(webview);

  useEffect(() => {
    if (!webview) return;
    if (!params) return;

    if (params.timer) {
      const {startTime, endTime} = params.timer;
      openCreatePracticeDialog(startTime, endTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webview, params]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        ref={webviewRef}
        injectedJavaScriptBeforeContentLoaded={'window.isJuniNative = true'}
        userAgent={
          Platform.OS === 'android'
            ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
            : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'
        }
        // source={{uri: 'http://172.30.1.100:2001'}}
        source={{uri: 'https://juni.vercel.app/'}}
        sharedCookiesEnabled
        domStorageEnabled
        onError={handleWebviewError}
        onMessage={handleWebviewMessage}
      />
    </SafeAreaView>
  );
}

export default MyWebview;
