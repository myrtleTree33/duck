#!/usr/bin/env node

import app from 'commander';
import Duck from './lib/Duck';

export default function runMain() {
  app
    .version('0.0.1')
    .option(
      '-u, --uri [uri]',
      'Mongo URI to use',
      'mongodb://localhost/newsfeed'
    )
    .option(
      '-i, --update-interval [mSecs]',
      'The update interval, to retrieve jobs, in ms',
      600000
    )
    .parse(process.argv);

  console.log(`Launching for Mongo URI=${app.uri}`);
  console.log(`Updating with cron every interval=${app.updateInterval}ms`);

  const duck = new Duck({
    uri: app.uri,
    refreshInterval: app.updateInterval
  });
  duck.start();
}

if (require.main === module) {
  runMain();
}
