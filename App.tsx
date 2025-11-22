/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import {
  NativeModules,
  StatusBar,
  StyleSheet,

} from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AppelInvites from './screens/appel-invites';
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

const { UPIInstalledApps } = NativeModules;
function App() {


  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex:1}}>
        <StatusBar barStyle={'dark-content'} />
        <AppelInvites />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
