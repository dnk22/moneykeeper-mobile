export const logBoxIgnore = [
  "Module RNCColorPicker requires main queue setup since it overrides `init` but doesn't implement `requiresMainQueueSetup`. In a future release React Native will default to initializing all native modules on a background thread unless explicitly opted-out of.",
  "[🍉] The reader you're trying to run (unnamed) can't be performed yet, because there are 1 other readers/writers in the queue. Current reader: unnamed. If everything is working fine, you can safely ignore this message (queueing is working as expected). But if your readers/writers are not running, it's because the current reader is stuck. Remember that if you're calling a reader/writer from another reader/writer, you must use callReader()/callWriter(). See docs for more details.",
];

export const CREATE_MODE = 'create';
