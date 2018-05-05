var express = require('express');
var graphQLHTTP = require('express-graphql');
var compression = require('compression');
var proxy = require('express-http-proxy');

const GRAPHQL_PORT = 5000;
let graphQLServer;

function startGraphQLServer() {

  const graphQLApp = express();
  graphQLApp.use(compression({filter: shouldCompress}));
  graphQLApp.use('/graphql', proxy(`http://localhost:${GRAPHQL_PORT}`));
  graphQLApp.use(express.static('./build'));
  graphQLApp.get('/', express.static('./build/index.html'));
  graphQLApp.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
  }));
  graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {
    console.log(
      `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
    );
  });
}

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

startGraphQLServer()
