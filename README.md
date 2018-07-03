# protobowl-bot

![t pose](http://i.imgur.com/4ZTiJU4.jpg)

Have you ever wanted to be good at Protobowl, but keep getting owned by middle-schoolers who memorized all the questions and buzz 2 words in? Well, now you can, with no skill and a couple scripts!

## How do I use it?
There are now two versions, the older Python version and the new JavaScript version. Here's a breakdown:
* Python version:
    * more customizable setting-wise (done via the CLI)
    * more prone to crashes (due to Selenium)
    * more of a pain to get working (more on that later)
* JavaScript version:
    * much easier to use (copy-paste `protobowl.min.js` into your F12 console)
    * less customizability/missing features (that'll change with updates)
    * potentially unstable (ie. could crash your browser)

Do with that what you will.

## I still wanna use Python.

Keep in mind this is a brief overview that skips over the specifics. Get ready to follow some instructions:
1. Make sure you're using Python 3.x (2.x seems to cause issues).
2. Install `requests` and `selenium` with pip.
3. Download a [WebDriver](https://www.seleniumhq.org/download/) for your web browser of choice and place it in the directory with `protobowl.py`. I've provided the Chrome one with this repo, but there are versions for other browsers too.

## But how does it work?
All of the questions played in `msquizbowl` can be found on [QuizDB](https://www.quizdb.org). QuizDB also internally uses an API to provide question set downloads that I used to get JSON data (with the answers) by reverse searching questions from Protobowl. For the Python version, I used Selenium to interact with the browser, and for the JavaScript version I used the jQuery events and handlers supported by the site.

---
A closing note:
```
anyone that wants to use this has to figure out how to run this. I'm not gonna help little kids try to be the coolest kid on their team. If you can get this working then it's fair game for you to use it imo have fun
```

With great power comes great responsibility.
