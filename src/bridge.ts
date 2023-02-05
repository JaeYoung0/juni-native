import WebView from 'react-native-webview';

export class WebviewBridge {
  private webview: WebView;

  constructor(webview: WebView) {
    this.webview = webview;
  }

  postTimerResult = (startTime: string, endTime: string) => {
    this.webview.postMessage(
      JSON.stringify({
        from: 'JuniNative',
        method: 'postTimerResult',
        payload: {
          startTime,
          endTime,
        },
      }),
    );
  };
}
