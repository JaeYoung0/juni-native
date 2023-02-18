import {NavigationProp, useNavigation} from '@react-navigation/native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {WebViewErrorEvent} from 'react-native-webview/lib/WebViewTypes';
import {RootStackParamList} from '../App';

export default function useWebviewBridge(webview: WebView | null) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const openCreatePracticeDialog = (startTime: string, endTime: string) => {
    if (!webview) return;

    webview.injectJavaScript(`
    window.postMessage({
      source: 'juniNative',
      type: '@open/CreatePracticeDialog',
      payload:${JSON.stringify({startTime, endTime})}
    })
    `);
  };

  const handleWebviewMessage = (event: WebViewMessageEvent) => {
    if (!webview) return;

    if (event.nativeEvent.data === 'openTimer') {
      navigation.navigate('Timer');
    }
  };

  const handleWebviewError = (event: WebViewErrorEvent) => {
    if (!webview) return;

    console.error('WebView error: ', event);
  };

  return {openCreatePracticeDialog, handleWebviewMessage, handleWebviewError};
}
