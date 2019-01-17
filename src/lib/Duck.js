import mongoose from 'mongoose';
import cron from 'node-cron';

import QueueItem from './models/QueueItem';
import QueuedUrl from './models/QueuedUrl';

export default class Duck {
  constructor({
    uri = 'mongodb://localhost/newsfeed',
    refreshInterval = 60000 // 10 minutes
  }) {
    this.mongoose = mongoose.connect(uri);
    this.tasks = {};
    this.refreshInterval = refreshInterval;
    // const item = new QueuedUrl({
    //   url: 'https://www.channelnewsasia.com/',
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
          const { url, priority, interval, depth, maxRandDelayMs } = queuedUrl;
          const { tasks } = this;

          // if task is found, unschedule task
          if (tasks[url]) {
            tasks[url].destroy();
            console.log(`Destroyed task[${url}]`);
          }

          tasks[url] = cron.schedule(interval, () => {
            QueueItem.findOneAndUpdate(
              { url },
              { url, rootUrl: url, priority, depth, maxRandDelayMs },
              { upsert: true, new: true }
            )
              .then(() =>
                console.log(
                  `Inserted url=${url} at date=${new Date().toLocaleString()}`
                )
              )
              .catch(e => console.error(e));
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
    }, this.refreshInterval);
  }
}
