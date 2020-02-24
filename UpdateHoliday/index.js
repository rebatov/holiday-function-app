var MongoClient = require('mongodb').MongoClient;

module.exports = function(context, req) {
  MongoClient.connect(process.env.CosmosDBConnectionString, (err, client) => {
    let send = response(client, context);

    if (err) send(500, err.message);

    let db = client.db('admin');

    let holiday = ({ name, type, country, date } = req.body);
    holiday.id = parseInt(req.query.id);

    db
      .collection('holidays')
      .updateOne(
        { id: holiday.id },
        { $set: { name: holiday.name, type: holiday.type, country: holiday.country,date:holiday.date } },
        (err, holiday) => {
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