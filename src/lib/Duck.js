import mongoose from 'mongoose';
import cron from 'node-cron';

import QueueItem from './models/QueueItem';
import QueuedUrl from './models/QueuedUrl';

export default class Duck {
  constructor({ uri = 'mongodb://localhost/test', refreshInterval = 60000 }) {
    this.mongoose = mongoose.connect(uri);
    this.tasks = {};
    this.refreshInterval = refreshInterval;
    // const item = new QueuedUrl({
    //   url: 'www.lego.com',
    //   priority: 1,
    //   interval: '0 */4 * * *'
    // });
    // item.save({});
  }

  refresh() {
    (async () => {
      try {
        const queuedUrls = await QueuedUrl.find({});
        console.log(
          `Found ${
            queuedUrls.length
          } tasks to insert at ${new Date().toLocaleString()}`
        );
        queuedUrls.forEach(queuedUrl => {
          const { id, url, priority, interval } = queuedUrl;
          // unschedule task if task is not found
          if (this.tasks[id]) {
            this.tasks[id].destroy();
          }
          this.tasks[id] = cron.schedule(interval, () => {
            const queueItem = new QueueItem({
              url,
              rootUrl: url,
              priority
            });
            queueItem
              .save()
              .then()
              .catch(e => e); // ignore errors
            console.log(`Inserted ${url} at ${new Date().toLocaleString()}`);
          });
        });
      } catch (e) {
        console.error('--- Caught error ---');
        console.error(e);
        console.error('--------------------');
      }
    })();
  }

  start() {
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, this.refreshInterval); // 10 minutes
  }
}
