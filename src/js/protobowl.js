console.log("Bot> Hello");
console.log("Bot> I'm listening for questions to start now");
console.log("Bot> If you want me to stop, type in 'stopBot()'");

const node = document.getElementById("history");

const config = {
	attributes: false,
	childList: true,
	subtree: false
}

// listens for when the question starts and starts the bot
let observer = new MutationObserver((mutationsList) => {

	for (let mutation of mutationsList) {

		// picking up only additions to the DOM
		if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
			console.log("Bot> Searching...");
			startGuess();
		};

	}

});

// synchronous wrapper to make sure bot doesn't crash anything
function startGuess() {

	guess().then(complete => {
		if (!complete) setTimeout(startGuess, 50);
		else return;
	});

}

// starts the listener
observer.observe(node, config);

function guess() {

	return new Promise((resolve, reject) => {

		// gets all words of the question displayed on screen
		let words = $(".active .well").children().not(".unread");

		// prevents the bot from hitching
		if (words.length < 3) {

			console.log("Bot> Too early to buzz...");
			resolve(false);
			return;

		}
		
		let question = words.text();

		// replace curly quotes bc QuizDB doesn't use them
		question = question.replace('“','"').replace('”','"').replace('‘',"'").replace('’',"'");

		// config settings for the QuizDB API
		// TODO: allow customization here
		let args = {

			"query"			: encodeURI(question),
			"search_type"	: "Question",
			"difficulty"	: "middle_school",
			"question_type"	: "Tossup",
			"limit"			: "false",
			"download"		: "json"

		}
		
		// quick PHP wrapper to bypass Cross-Origin block in Chrome
		$.get("http://162.243.36.7/projects/protobowl/api.php", args)
		.done(function(data) {

			let response = JSON.parse(data);

			// if bot is 100% sure, BUZZ
			if (response.data.num_tossups_found == 1) {

				// replaces in this order: brackets, quotes, parentheses
				let answer = response.data.tossups[0].answer.replace(/ *\[[^\]]*]/, "").replace(/"(.*?(\s)*?)*?"/, "").replace(/ *\[[^)]*\ */g, "");

				console.log("Bot> Found answer: " + answer);

				// buzz in
				$(".buzzbtn").click();
				$(".guess_input").val(answer);
				$(".guess_form").submit();

				// press "next" with a small delay so it'll work
				let e = $.Event("keydown", {keyCode: 78, which: 78});
				setTimeout(() => { $("body").trigger(e) }, 50);

				resolve(true);

			} else {
				console.log("Bot> Not sure yet...");
				resolve(false);
			}

		});

	});
}

function stopBot() {

	console.log("Bot> Bye");
	observer.disconnect();

}