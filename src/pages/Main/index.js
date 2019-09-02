import React, {Component} from 'react';
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

export default class Main extends Component {
  static navigationOptions = {
    title: 'Main',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    console.tron.log(this.props);
    const users = await AsyncStorage.getItem('users');
    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  async componentDidUpdate(_, prevState) {
    if (prevState.users !== this.state.users) {
      AsyncStorage.setItem('users', JSON.stringify(this.state.users));
    }
  }

  handleAddUser = async () => {
    await this.setState({loading: true});
    const {newUser, users} = this.state;
    const response = await api.get(`/users/${newUser}`);
    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };
    await this.setState({users: [...users, data], newUser: '', loading: false});
    Keyboard.dismiss();
  };

  handleNavigate = user => {
    const {navigation} = this.props;
    navigation.navigate('User', {user});
  };

  render() {
    const {newUser, users, loading} = this.state;
    return (
      <Container>
        <Form>
          <Input
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            autoCorrect={false}
            autoCaptalize="none"
            placeholder="Adicionar usuário"
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
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
              <ProfileButton onPress={() => {}}>
                <ProfileButtonText onPress={() => this.handleNavigate(item)}>
                  Ver Profile
                </ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
