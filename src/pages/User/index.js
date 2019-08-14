import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Bio,
  Avatar,
  Name,
  Header,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
  LoadingText,
} from './styles';
import api from '../../services/api';

class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  // eslint-disable-next-line react/state-in-constructor
  state = {
    stars: [],
    refreshing: false,
    page: 1,
    loading: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({
      loading: true,
    });

    const response = await api.get(`/users/${user.login}/starred`);
    this.setState({
      stars: response.data,
      loading: false,
    });
  }

  handleRepository = item => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { item });
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({
      refreshing: true,
    });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: 1,
      },
    });

    this.setState({
      refreshing: false,
      stars: response.data,
    });
  };

  loadMore = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page, stars } = this.state;

    const nextPage = page + 1;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: nextPage,
      },
    });

    this.setState({
      page: nextPage,
      stars: [...stars, ...response.data],
    });
  };

  render() {
    const { stars, refreshing, loading } = this.state;
    const { navigation } = this.props;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <Loading>
            <LoadingText>Carregando favoritos...</LoadingText>
          </Loading>
        ) : (
          <Stars
            data={stars}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleRepository(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};

export default User;
