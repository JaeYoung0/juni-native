/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, Platform} from 'react-native';
import notifee from '@notifee/react-native';
import {WebView} from 'react-native-webview';

function App(): JSX.Element {
  async function openTimer() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: '스톱워치',
      body: '열심히 합시다',

      android: {
        channelId,
        showChronometer: true,

        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

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

export default App;
