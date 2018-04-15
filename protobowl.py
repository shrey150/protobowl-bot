import requests
import json
import re
import time
import os

from selenium import webdriver
from selenium.common.exceptions import StaleElementReferenceException, ElementNotVisibleException
from selenium.webdriver.common.keys import Keys

browser = webdriver.Chrome("chromedriver.exe")

print_msgs = False

def get_question(room, username):

	browser.get("http://www.protobowl.com/" + room)

	time.sleep(0.1)

	username_input = browser.find_element_by_xpath('//*[@id="username"]')
	username_input.send_keys(Keys.CONTROL + "a")
	username_input.send_keys(username)

	global question_id
	question_id = browser.find_element_by_xpath('//*[@id="history"]/div[1]').get_attribute("class")

	while True:

		question = ""
		i = 0

		div = browser.find_element_by_xpath('//*[@id="history"]/div[1]/div[1]/div[1]')
		
		for span in div.find_elements_by_xpath('.//*'):
			try:
				if not span.text:
					break

				question += " "
				question += span.text
				i += 1
			except StaleElementReferenceException as e:
				debug("Lost element!")
				continue

		if i > 1:
			debug("Searching...")
			question = question.replace('“','"').replace('”','"')
			search(question)

		question_id = browser.find_element_by_xpath('//*[@id="history"]/div[1]').get_attribute("class")
		debug("---------------------")

def search(question):

	args = {

		"search[query]"						: question,
		"search[filters][search_type][]"	: "Question",
		"search[filters][difficulty][]"		: "middle_school",
		"search[filters][question_type][]"	: "Tossup",
		"search[limit]"						: "false",
		"download"							: "json"

	}

	r = requests.get("https://www.quizdb.org/api/search", params=args)

	data = r.json()

	answers = len(data["data"]["tossups"])

	if answers == 1:

		debug("Found answer!")

		answer = data["data"]["tossups"][0]["answer"]

		formatted_answer = re.sub("[\(\[].*?[\)\]]", "", answer)

		button = browser.find_element_by_xpath("/html/body/div[3]/div/div[1]/div[1]/div/div/div/button[5]")
		textbox = browser.find_element_by_xpath("/html/body/div[3]/div/div[1]/div[1]/div/div/form[2]/div/input")

		try:

			global question_id

			last_id = question_id

			question_id = browser.find_element_by_xpath('//*[@id="history"]/div[1]').get_attribute("class")

			if question_id != last_id:
				debug("Mismatch!")
				return

			button.click()

			time.sleep(0.1)

			textbox.send_keys(formatted_answer)
			textbox.send_keys(Keys.ENTER)

			debug("Buzzed in!")

		except ElementNotVisibleException as e:
			debug("Could not buzz!")
			return


def main():

	global print_msgs
	cls()

	print("PROTOBOWL BOT")
	print("")
	print("")

	room = input("Choose a Protobowl room:	")
	username = input("Choose a username:	")
	debug_prompt = input("Print debugging messages? (Y/N)	")

	if debug_prompt.upper() == "Y":
		print_msgs = True
	elif debug_prompt.upper() == "N":
		print_msgs = False
	else:
		print("Invalid input, try again")
		main()


	get_question(room, username)

def debug(string):
	if print_msgs:
		print(string)

def cls():
    os.system('cls' if os.name=='nt' else 'clear')

main()