import mongoose from 'mongoose';
import cron from 'node-cron';

import CacheItem from './models/CacheItem';
import QueuedUrl from './models/QueuedUrl';

export default class Duck {
  constructor({ uri = 'mongodb://localhost/test', refreshInterval = 600000 }) {
    this.mongoose = mongoose.connect(uri);
    this.tasks = {};
    this.refreshInterval = refreshInterval;
  }

  refresh() {
    (async () => {
      try {
        const queuedUrls = await QueuedUrl.find({});
        console.log(`Found ${queuedUrls.length} tasks to insert.`);
        queuedUrls.forEach(queuedUrl => {
          const { id, url, priority, interval } = queuedUrl;
          // unschedule task if task is not found
          if (this.tasks[id]) {
            this.tasks[id].destroy();
          }
          this.tasks[id] = cron.schedule(interval, () => {
            const cacheItem = new CacheItem({
              url,
              rootUrl: url,
              priority
            });
            cacheItem.save();
            console.log(`Inserted ${url}`);
          });
        });
      } catch (e) {
        console.error(e);
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
