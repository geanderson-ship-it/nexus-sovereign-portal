const { ImapFlow } = require('imapflow');
async function run() {
  const client = new ImapFlow({
    host: 'imap.gmail.com', port: 993, secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
    logger: false
  });
  await client.connect();
  const list = await client.list();
  console.log(list.map(b => b.path));
  await client.logout();
}
run().catch(console.error);
