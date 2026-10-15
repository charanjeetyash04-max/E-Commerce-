const { Queue } = require('bullmq');
const connection = require('../config/queueConnection');

// Queue for the scheduled email batches (newsletter, wishlist reminders).
// The web process only enqueues; apps/api/worker.js consumes.
const emailQueue = new Queue('email', { connection });

module.exports = emailQueue;
