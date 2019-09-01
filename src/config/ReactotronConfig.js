import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  console.tron = Reactotron.configure({host: '192.168.0.105'})
    .useReactNative()
    .connect();
}
