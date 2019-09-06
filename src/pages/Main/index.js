import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import {Keyboard, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  Avatar,
} from './styles';
import api from '../../services/api';

function Main({navigation}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    async function getUsers() {
      const u = await AsyncStorage.getItem('users');
      if (u) {
        setUsers(JSON.parse(u));
      }
    }
    getUsers();
  }, [navigation]);
  useEffect(() => {
    AsyncStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  async function handleAddUser() {
    setLoading(true);
    const response = await api.get(`/users/${newUser}`);
    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };
    setUsers([...users, data]);
    setNewUser('');
    setLoading(false);
    Keyboard.dismiss();
  }

  function handleNavigate(user) {
    navigation.navigate('User', {user});
  }

  return (
    <Container>
      <Form>
        <Input
          value={newUser}
          onChangeText={text => setNewUser(text)}
          autoCorrect={false}
          autoCaptalize="none"
          placeholder="Adicionar usuário"
          returnKeyType="send"
          onSubmitEditing={() => handleAddUser()}
        />
        <SubmitButton loading={loading} onPress={() => handleAddUser()}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>
      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({item}) => (
          <User>
            <Avatar source={{uri: item.avatar}} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>
            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver Profile</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

Main.navigationOptions = ({navigation}) => ({
  title: 'Titulo',
});

export default Main;
