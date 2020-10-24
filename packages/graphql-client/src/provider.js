import React from 'react';
import PropTypes from 'prop-types';
import GraphQLContext from './context';

const GraphQLProvider = ({ client, children }) => {
  return (
    <GraphQLContext.Provider value={{ client }}>
      {children}
    </GraphQLContext.Provider>
  );
};

GraphQLProvider.propTypes = {
  client: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default GraphQLProvider;
