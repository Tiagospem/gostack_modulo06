import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';
import api from '../../services/api';
import {
  Header,
  Container,
  Avatar,
  Bio,
  Name,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  ActivityBox,
} from '../User/styles';

function User({navigation}) {
  const per_page = 10;
  const [user, setUser] = useState({});
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  async function loadData(usr, pg, refresh = false) {
    setRefreshing(refresh);
    const response = await api.get(`/users/${usr.login}/starred`, {
      params: {
        per_page,
        page: pg,
      },
    });
    setLoading(false);
    setRefreshing(false);
    if (response.data.length > 0) {
      setStars(!refresh ? [...stars, ...response.data] : [...response.data]);
      setPage(pg);
    }
  }

  async function loadMore() {
    setLoading(true);
    loadData(user, page + 1, false);
  }

  useEffect(() => {
    const getUser = navigation.getParam('user');
    setUser(getUser);
    loadData(getUser, 1, false);
  }, []);

  function renderFooter() {
    if (!loading) {
      return null;
    }
    return (
      <ActivityBox>
        <ActivityIndicator size={30} color="#7159c1" />
      </ActivityBox>
    );
  }

  function handleNavigate(repo) {
    navigation.navigate('Pageview', {repo});
  }

  return (
    <Container>
      <Header>
        <Avatar source={{uri: user.avatar}} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      <Stars
        data={stars}
        onRefresh={() => loadData(user, 1, true)}
        ListFooterComponent={renderFooter()}
        refreshing={refreshing}
        onEndReachedThreshold={0.2}
        onEndReached={() => loadMore()}
        keyExtractor={star => String(star.id)}
        renderItem={({item}) => (
          <Starred onPress={() => handleNavigate(item)}>
            <OwnerAvatar source={{uri: item.owner.avatar_url}} />
            <Info>
              <Title>{item.name}</Title>
              <Author>{item.owner.login}</Author>
            </Info>
          </Starred>
        )}
      />
    </Container>
  );
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

User.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('user').name,
});

export default User;
