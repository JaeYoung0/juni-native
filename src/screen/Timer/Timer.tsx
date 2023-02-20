import React, {useState, useRef} from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import notifee from '@notifee/react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import BackgroundTimer from 'react-native-background-timer';
import styles from './style';

dayjs.extend(utc);

type Props = StackScreenProps<RootStackParamList, 'Timer'>;

function Timer({navigation}: Props) {
  const [currentTime, setCurrentTime] = useState(dayjs().unix());
  const startTimeRef = useRef(dayjs().unix());

  const notificationIdRef = useRef<string>('');

  async function startTimer() {
    startTimeRef.current = dayjs().unix();
    BackgroundTimer.runBackgroundTimer(() => {
      setCurrentTime(dayjs().unix());
    }, 1000);

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
    BackgroundTimer.stopBackgroundTimer();

    // notification 종료
    await notifee.cancelNotification(notificationIdRef.current);

    // 웹뷰에 elaspedTime 전달
    navigation.navigate('MyWebview', {
      timer: {
        startTime: dayjs().subtract(elapsedTime, 'millisecond').utc().format(),
        endTime: dayjs().utc().format(),
      },
    });

    setCurrentTime(dayjs().unix());
  };

  const elapsedTime = (currentTime - startTimeRef.current) * 1000;
  const seconds = elapsedTime / 1000;
  const ss = Math.floor(seconds % 60);
  const mm = Math.floor((seconds % 3600) / 60);
  const hh = Math.floor(seconds / 3600);
  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timer}>{`${format(hh)} : ${format(mm)} : ${format(
        ss,
      )}`}</Text>

      {elapsedTime === 0 && (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.buttonText}>뒤로</Text>
        </TouchableOpacity>
      )}

      {elapsedTime === 0 ? (
        <TouchableOpacity onPress={startTimer}>
          <Text style={styles.buttonText}>시작</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={stopTimer} style={{backgroundColor: '#fff'}}>
          <Text style={styles.stopButton}>종료</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

export default Timer;
