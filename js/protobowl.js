const node = document.getElementById("history");

const config = {
	attributes: false,
	childList: true,
	subtree: false
}

let observer = new MutationObserver((mutationsList) => {

	for (let mutation of mutationsList) {

		if (mutation.type == "childList") {
			console.log("Bot> Searching...");
			startGuess();
		};

	}

});

function startGuess() {
	guess().then(complete => {
		if (!complete) setTimeout(startGuess, 50);
	});
}

observer.observe(node, config);

function guess() {

	return new Promise((resolve, reject) => {

		let words = $(".active .well").children().not(".unread");

		if (words.length < 3) {

			console.log("Bot> Too early to buzz...");
			resolve(false);
			return;

		}

		let question = words.text();

		let args = {

			"query"			: encodeURI(question),
			"search_type"	: "Question",
			"difficulty"	: "middle_school",
			"question_type"	: "Tossup",
			"limit"			: "false",
			"download"		: "json"

		}
		
		$.get("http://162.243.36.7/projects/protobowl/api.php", args)
		.done(function(data) {

			let response = JSON.parse(data);

			if (response.data.num_tossups_found == 1) {

				console.log("Bot> Found answer!");

				$(".buzzbtn").click();
				$(".guess_input").val(response.data.tossups[0].answer);
				$(".guess_input").trigger( jQuery.Event("keydown", { which: 13, keyCode: 13 }));
				$(".guess-form").submit();

				resolve(true);

				console.log("------------------");

			} else {
				console.log("Bot> Not sure yet...");
				resolve(false);
			}

		})

	});

}