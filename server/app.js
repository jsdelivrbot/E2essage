const express = require('express');
const bodyParser = require('body-parser');
const Messages = require("./collections/messages");

const app = express();
app.use(bodyParser.json());


app.route('/get').get((request, response) => {
	Messages.get((array, error) => {
		if (error){
			response.send(error);
		} else {
			response.json(array);
		}
	});
});

app.route('/add').post((request, response) => {
	const message = request.body.message;
	Messages.insert(message, (status) => {
		response.send(status);
	});
});

const serverInfo = app.listen(3000);
console.log(`Server running at https://localhost:${serverInfo.address().port}/`);
