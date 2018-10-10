import Duck from './lib/Duck';

export default function app() {
  const duck = new Duck({
    url: 'mongodb://localhost/test',
    refreshInterval: 600000
  });
  duck.start();
}

if (require.main === module) {
  app();
}
