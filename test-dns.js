const dns = require('dns');

// Use public DNS servers to avoid local resolver refusing SRV queries
dns.setServers(['8.8.8.8', '1.1.1.1']);

dns.resolveSrv('_mongodb._tcp.cluster0.j1z837q.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('resolveSrv error:');
    console.error(err);
    process.exit(1);
  }
  console.log('SRV records:');
  console.log(addresses);
});
