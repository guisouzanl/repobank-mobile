import React from 'react';
import PropTypes from 'prop-types';
import { WebPage } from './styles';

function Repository({ navigation }) {
  const repository = navigation.getParam('item');

  return <WebPage source={{ uri: repository.html_url }} />;
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('item').name,
});

export default Repository;
