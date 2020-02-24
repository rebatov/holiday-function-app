var MongoClient = require('mongodb').MongoClient;

module.exports = function(context, req) {
  MongoClient.connect(process.env.CosmosDBConnectionString, (err, client) => {
    let send = response(client, context);

    if (err) send(500, err.message);

    let db = client.db('admin');

    let holiday = ({ id, name, type, country } = req.body);

    db.collection('holidays').insertOne(
      {
        id: holiday.id,
        name: holiday.name,
        type: holiday.type,
        country: holiday.country,
        date: holiday.date,
      },
      (err, holidays) => {
        if (err) send(500, err.message);

        send(200, holiday);
      }
    );
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