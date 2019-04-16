const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");

app.get("/", (req, res) => {

	const args = req.query;

	const url = 
		`https://www.quizdb.org/api/search?search[query]=${args.query}&` +
		`search[filters][difficulty][]=${args.difficulty}&` +
		`search[filters][search_type][]=${args.search_type}&` +
		`search[filters][question_type][]=${args.question_type}&` +
		`search[limit]=${args.limit}&` +
		`download=${args.download}`
	;

	axios.get(url)
	.then(rs => res.json(rs.data))
	.catch(err => res.send("error"));

});

app.listen(port, () => console.log(`protobowl-bot-server running on port ${port}`));