import React, {Component} from 'react';
import {Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, Form, Input, SubmitButton} from './styles';
import api from '../../services/api';

export default class Main extends Component {
  state = {
    newUser: '',
    users: [],
  };

  handleAddUser = async () => {
    const {newUser, users} = this.state;
    const response = await api.get(`/users/${newUser}`);
    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };
    this.setState({users: [...users, data], newUser: ''});
    Keyboard.dismiss();
  };

  render() {
    const {newUser} = this.state;
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
          <SubmitButton onPress={this.handleAddUser}>
            <Icon name="add" size={20} color="#fff" />
          </SubmitButton>
        </Form>
      </Container>
    );
  }
}

Main.navigationOptions = {
  title: 'Main',
};
