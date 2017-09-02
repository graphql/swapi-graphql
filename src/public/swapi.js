/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

(function() {
  'use strict';
  /* global GraphiQL: true */
  /* global React: true */
  /* global ReactDOM: true */
  /* global Schema: true */

  const GRAPHIQL_VERSION = '0.8.1';
  const PROTOCOL = getProtocol();
  const LEGAL_PARAMETER_NAMES = ['query', 'variables', 'operationName'];

  let parameters = extractURLParameters();

  function getProtocol() {
    // For ease of testing on the local filesystem, request over the network
    // instead of trying to load (broken) links like
    // "file://cdn.jsdelivr.net/..." etc.
    if (window.location.protocol === 'file:') {
      return 'https:';
    }
    return '';
  }

  function loadStyles(sheet) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = PROTOCOL + sheet;
    document.head.appendChild(link);
  }

  function loadScript(path, done) {
    // IE-compatible asynchronous loading.
    const script = document.createElement('script');
    let loaded = false;
    script.onload = script.onreadystatechange = function() {
      if (!loaded) {
        if (
          !this.readyState ||
          this.readyState === 'loaded' ||
          this.readyState === 'complete'
        ) {
          loaded = true;
          done(path, script);
        }
      }
    };

    if (path.indexOf('/') === 0) {
      script.src = PROTOCOL + path;
    } else {
      script.src = path;
    }
    document.head.appendChild(script);
  }

  function fetcher({ query, variables, operationName }) {
    if (typeof Schema !== 'undefined') {
      return Schema.execute(query, variables, operationName);
    }

    // No schema yet, load it.
    return new Promise((resolve, reject) => {
      loadScript('schema.js', () => {
        if (typeof Schema !== 'undefined') {
          resolve(Schema.schema);
        } else {
          reject(new Error('schema.js did not define Schema object'));
        }
      });
    });
  }

  function onEditQuery(query) {
    updateURL({ query });
  }

  function onEditVariables(variables) {
    updateURL({ variables });
  }

  function onEditOperationName(operationName) {
    updateURL({ operationName });
  }

  function updateURL(newParameters) {
    parameters = {
      ...parameters,
      ...newParameters,
    };
    const queryString =
      '?' +
      Object.keys(parameters)
        .map(
          key =>
            encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]),
        )
        .join('&');
    history.replaceState(null, null, queryString);
  }

  function extractURLParameters() {
    const extractedParameters = {};
    window.location.search
      .slice(1)
      .split('&')
      .forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && LEGAL_PARAMETER_NAMES.indexOf(key) !== -1) {
          extractedParameters[key] = decodeURIComponent(value);
        }
      });
    return extractedParameters;
  }

  function renderGraphiQL() {
    const { query, variables, operationName } = parameters;
    ReactDOM.render(
      React.createElement(GraphiQL, {
        fetcher,
        onEditQuery,
        onEditVariables,
        onEditOperationName,
        query,
        variables,
        operationName,
      }),
      document.body,
    );
  }

  function loadAssets(done) {
    const styles = [
      '//cdn.jsdelivr.net/graphiql/' + GRAPHIQL_VERSION + '/graphiql.css',
    ];
    styles.forEach(loadStyles);

    const scripts = {
      graphiql:
        '//cdn.jsdelivr.net/graphiql/' + GRAPHIQL_VERSION + '/graphiql.min.js',
      react: '//cdn.jsdelivr.net/react/15.3.2/react.min.js',
      'react-dom': '//cdn.jsdelivr.net/react/15.3.2/react-dom.min.js',
    };

    function loaded(key) {
      delete scripts[key];
      if (!Object.keys(scripts).length) {
        done();
      }
    }

    // Ensure react-dom loads after react, and graphiql after react-dom.
    loadScript(scripts.react, () => {
      loaded('react');
      loadScript(scripts['react-dom'], () => {
        loaded('react-dom');
        loadScript(scripts.graphiql, () => loaded('graphiql'));
      });
    });
  }

  loadAssets(renderGraphiQL);
})();
