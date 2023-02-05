import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MyWebview from './src/screen/MyWebview';
import Timer from './src/screen/Timer';
import {NavigationContainer} from '@react-navigation/native';

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

export type RootStackParamList = {
  Timer: undefined;
  MyWebview: {
    timer?: {
      startTime: string; // dayjs().utc().format()
      endTime: string; // dayjs().utc().format()
    };
  };
};
const RootStack = createStackNavigator<RootStackParamList>();
function MyStack() {
  return (
    <>
      <RootStack.Navigator
        screenOptions={{headerShown: false, presentation: 'transparentModal'}}>
        <RootStack.Screen name="MyWebview" component={MyWebview} />
        <RootStack.Screen name="Timer" component={Timer} />
      </RootStack.Navigator>
    </>
  );
}
