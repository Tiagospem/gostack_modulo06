import React from 'react';
import {BrowserView} from './styles';

function Pageview({navigation}) {
  const repo = navigation.getParam('repo');
  return <BrowserView source={{uri: repo.html_url}} />;
}
Pageview.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('repo').name,
});

export default Pageview;
