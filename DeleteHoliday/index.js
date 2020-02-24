var MongoClient = require('mongodb').MongoClient;

module.exports = function(context, req) {
  MongoClient.connect(process.env.CosmosDBConnectionString, (err, client) => {
    let send = response(client, context);

    if (err) send(500, err.message);

    let db = client.db('admin');

    let holidayId = parseInt(req.query.id);

    db.collection('holidays').deleteOne({ id: holidayId }, (err, result) => {
      if (err) send(500, err.message);

      send(200, result);
    });
  });
};

function response(client, context) {
  return function(status, body) {
    context.res = {
      status: status,
      body: body
    };

    client.close();
    context.done();
  };
}