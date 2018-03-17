import { Meteor } from 'meteor/meteor';

import { Value } from '../imports/coll.js';

Meteor.startup(() => {
  // code to run on server at startup
  Value.remove({});
  Value.insert({val: 0});
});
