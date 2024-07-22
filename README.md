# Battleship

## Overview

Iconic game of ["Battleship"](<https://en.wikipedia.org/wiki/Battleship_(game)>) created using vanilla JavaScript, with a fully responsive layout & enemy bot

### [View Live Demo](https://yash-aryan.github.io/Battleship/)

- This is the work-in-progress GUI version of the game
- The Game is played against a bot.
- Utilized Jest for unit testing certain functions in the exposed interface.
- Utilized Webpack for bundling together all the files used to create this project.
- The output `index.html` & `main.js` are stored in the `dist/` directory.
- All of my files used to create `main.js` are stored in the `src/` directory.

## Features

- ### Intuitive GUI to Setup Ships

  - Player can manually setup their ships using the GUI one-by-one.
  - Player can rotate their ships.
  - Grid cells get highlighted for visual feedback when moving the ship.

- ### Auto-Generating Ship Placements for the Bot

  - A new ship placement for the Bot is auto-generated each time a new game starts.

- ### Smart AI Bot

  - The Bot has 3 phases - explore, orientation, and follow-up. And works by having the game it's notify last hit reports to it.
  - The Bot does not scan the grid, and determines next moves based on it's last shot report (hit, miss, sink).
  - The Bot first explores to find any enemy ship, and then makes sure to sink it, before exploring again for the next ship.

- ### Reset Game / Play Again
  - After the game is over and winner is declared, the Player can choose to "Play Again".
  - This Resets the game, and generates a fresh new ship placement for the Bot.

## Code Overview

- I've put thought into decoupling the code as much as I can, and into following the _Single Responsibility Principle_.
- `index.js` holds the main game logic, and dictates the flow of events. It calls any necessary functions from other modules.
- `dom-handler.js` exports functions that deals with everything DOM manipulation from providing certain DOM elements to creating nodes.
- Other modules export it's respective factory functions:
  - `bot-factory.js` returns factory function to create the AI Object responsible for making moves.
  - `ship-factory.js` allows creating individual ship objects.
  - `gameboard-factory.js` allowing creating individual gameboards that contains several of these ship objects.

## Project Status

- [x] Create basic UI.
- [x] Create basic gameplay loop vs bot.
- [x] Update bot to shoot adjacent cells after hit.
- [x] Create logic for the player to place ships.
- [x] Create logic for the bot to generate new ship placement.
- [ ] Update UI.
