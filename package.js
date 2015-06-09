Package.describe({
  name: 'selaias:oauth-jawbone',
  version: '1.0.0',
  summary: 'An implementation of the Jawbone OAuth flow.',
  git: 'https://github.com/selaias/oauth-jawbone.git',
  documentation: 'README.md'
});

Npm.depends({'request': "2.53.0"});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  
  api.export('Jawbone');
  
  api.addFiles(['jawbone_configure.html', 'jawbone_configure.js'], 'client');
  api.addFiles('jawbone_server.js', 'server');
  api.addFiles('jawbone_client.js', 'client');

});

