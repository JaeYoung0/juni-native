import WebView from 'react-native-webview';

export class WebviewBridge {
  private webview: WebView;

  constructor(webview: WebView) {
    this.webview = webview;
  }

  openCreatePracticeDialog = (startTime: string, endTime: string) => {
    this.webview.injectJavaScript(`
    window.postMessage({
      type: '@open/CreatePracticeDialog',
      payload:${JSON.stringify({startTime, endTime})}
    })
    `);
  };
}
