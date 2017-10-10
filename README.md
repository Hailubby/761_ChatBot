# Wellness Chatbot

<!-- TOC -->

- [Wellness Chatbot](#wellness-chatbot)
    - [Description](#description)
    - [Setup](#setup)
    - [Editing environment](#editing-environment)

<!-- /TOC -->

## Description
An interactive chatbot to help guide people to information on gambling issues to help with their addiction.

## Setup

1. The bot is **ACTIVE** on the a glitch server when viewing please be careful when typing in glich as it autocompiles and the bot will be disabled while compiling.
  - [spagbot](https://glitch.com/edit/#!/join/11b1efd5-8e23-4fd7-a589-83f48cb10c22)
2. Glitch will pull from our master branch when prompted, clearing what's currently active and replacing it with master. However, code can aslo be edited from glitch which is how we have been testing our product live.
3. To make changes to code on glitch you must _copy_ and _paste_ your source code onto the correct place in glitch
4. All important keys are stored in config.json. This is temporarily in source control with development keys but should be replaced with enterprise keys when in production

## Editing environment

Recommended: **VS Code**

Required:

- ESLint extension
- EditorConfig extension (or Mirror the settings in _.editorconfig_)
- Node.js

## Glitch setup

1. Create a glitch project to host the chatbot
2. Click on the project title and browse to advanced options
3. Import the bot from the GitHub repository
4. The bot should now automatically be hosted and running

## Prototype execution

1. Request tester access to 'Spgetti Bot' on Facebook by contacting hwan561@aucklanduni.ac.nz with your Facebook username.
2. Accept the tester request on https://developers.facebook.com/
3. Request access to Glitch server by contacting hwan561@aucklanduni.ac.nz
4. Copy and paste code from the 'PROTOTYPE' branch into their respective Glitch server files. Glitch will auto-compile these changes and connect to Facebook automatically. (Unfortunately Glitch is only able to import from the master branch on GitHub which is why code from the 'PROTOTYPE' branch must be copied/pasted)
5. Visit https://www.facebook.com/Spgetti-Bot-513268699012224/ and click 'send message' to start chatting to the bot. Alternatively, if you have already liked the page, you can search for Spgetti Bot in your contacts list to message.
6. If you send the bot 'goals', it will initiate a conversation with the bot.
7. Respond to the bots messages/questions to carry out the conversation.
8. See the User_Initiated_Messages sheet located in the resources/SPGeTTi_messages.xlsx workbook for a list of conversation initiating keywords which the bot understands and can respond to.

## Adding commands
* You may add your own conversation flows into the excel spread sheets User_Initiated_Messages and Follow_Up_Messages such that it conforms to this template:
  - ID: sequential identifier for the row
  - Key: string which the bot will recognise and response to
  - Bot Response: what the bot will send back to the user
  - Response Type: String
  - Follow Ups: semicolon seperated id numbers of followups from Follow_Up_Messages
  
## Logging
Messages sent to and from the bot are logged on a google sheet [here](https://docs.google.com/spreadsheets/d/1ZvkpfeUgNaZjo5vhcATjtyiMtum0TF5hPHhfI0z6iTE/edit?usp=sharing)
It contains a table of contents of each user and their respective ID as well as an overview page containing specific information that Gayl requested (user and goal count).

