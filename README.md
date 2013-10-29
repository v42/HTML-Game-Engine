HTML GAME ENGINE
================

This is a concept for an engine in HTML using canvas, inspired on Jason Gregory's Engine Architecture, and this is my graduation project (2011). This is entirely made in CoffeeScript.

This is no longer mantained, but feel free to clone, read about and ask me anything you need. I am no longer updating it since the idea here is to keep it as it was on the project's delivery date. I might ocasionally update a thing or two just to make it clearer for the people who tries to understand it. Anyway, feel free to ping me at my Twitter (`@Vitor42`) if you feel like you miss something.

## How to use it

- Clone this repo && `npm install`
- run `coffee app.coffee`
- http://localhost:4242

## Game Variations

- http://localhost:4242/game2
- http://localhost:4242/game3
- http://localhost:4242/game4

## Recomendations

- Use Firefox to run it! I am using really really tiny sprites here for the demos. Firefox has `mozImageSmoothingEnabled = false` option that doesn't try to smooth the canvas, so you will get sharp pixels only at Firefox.
- This engine uses the Game Loop without `requestAnimationFrame`, which I didn't know in that time. If you are going to implement a game loop I strongly suggest you use it. You can calculate your `deltaTime` by using JavaScript native's `Date().getTime()` and subtract it by an old time.
- Canvas is trying to draw things that are not in the visible area. If you are going to use it for real, fix it.
- Sprites have no function to flip themselves while walking. It doesn't look like, because they are symetric.

## LICENSE
This software is under BeerCoffeWare License (Revision 42):
Use this as you want, if we meet someday and feels like this worth it, you can buy me a coffee or a beer! :)
