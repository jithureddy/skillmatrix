module.exports = {
  greetings: ['Hey ','Hello ','Hi '],
  pleasantries: ['I am good, thank you.','Never been better, shall we get started?', 'How can I help you?'],
  defaultreplies: ["I'm sorry I didn't understand."],
  intermediatereps: ["I am working on it, can you give me a moment mcname.","Sure thing, mcname"],
  cookie: {
    secret: process.env.COOKIE_SECRET_KEY,
  },
  session: {
    secure: true
  },
  db: {
    provider: "mongodb",
    connection: "mongodb://localhost:27017/mc_todo",
  },
  ws: {
    url: process.env.WS_URL
  },
  events: {
  
  },
  bot: {
    appId:'0094abe2-a47e-4b7b-a1dc-16f5e7a11eb7',
    appPass: 'wQZP57ZjLRR3RPkX8O5pLS1'
  },
  log: "debug"
};
