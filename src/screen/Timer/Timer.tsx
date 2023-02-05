import React, {useState, useRef} from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import notifee from '@notifee/react-native';

const intervalTimer = (update: (time: number) => void, interval = 1000) => {
  let counter = 1;
  let timeoutId = 0;
  const startTime = Date.now();

  function main() {
    const mainThreadTime = Date.now(); // 이벤트루프 다녀오고나서 콜스택에 올라오고 실제로 실행된 시각
    const nextTime = startTime + counter * interval; // 오차없이 실행되어야할 시각
    const deviation = mainThreadTime - nextTime; // 이벤트루프 다녀오느라 걸린 시간
    const compensatedInterval = interval - deviation; // 보정
    timeoutId = setTimeout(main, compensatedInterval);

    counter += 1;
    update(mainThreadTime - startTime - deviation);
  }

  setTimeout(main, interval);

  return () => clearTimeout(timeoutId);
};

function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const notificationIdRef = useRef<string>('');

  const timerController = useRef<{clear: () => void}>({
    clear: () => 0,
  });

  async function startTimer() {
    timerController.current.clear = intervalTimer(time => setElapsedTime(time));

    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    const notificationId = await notifee.displayNotification({
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

    notificationIdRef.current = notificationId;
  }

  const stopTimer = async () => {
    timerController.current.clear();
    setElapsedTime(0);

    // notification 종료
    await notifee.cancelNotification(notificationIdRef.current);

    // 웹뷰에 elaspedTime 전달
  };
  const seconds = elapsedTime / 1000;
  const ss = Math.floor(seconds % 60);
  const mm = Math.floor((seconds % 3600) / 60);
  const hh = Math.floor(seconds / 3600);
  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
      <TouchableOpacity onPress={startTimer}>
        <Text>시작</Text>
      </TouchableOpacity>

      <Text>{`${format(hh)} : ${format(mm)} : ${format(ss)}`}</Text>

      <TouchableOpacity onPress={stopTimer}>
        <Text>종료</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default Timer;
