# PawnPusher

![pwa-install](/docs/game-pic.png)

## Disclaimer

I have found a board game that I liked and have "reproduced" it in code :D.
This is to be considered just a personal project and there is no intention to monetize/commercialize this game. <br>
I intentionally didn't add any license for this repo to avoid potential issues related with the board game IP. <br>
If the owner of the IP finds this repo in violation of their rules I'm more than happy to take this repo down.

## How to install - Docker

- Install Docker
- Build the image using the follow command in terminal `docker build -t pawnpusher .`
- Spin up a container using the image just created `docker run -p 4173:4173 pawnpusher`
- Enjoy the game

This game has also a PWA configuration so if you want, the first time you run in through docker, you can install it directly in your Desktop and keep playing it without the fuss of docker.
Just click on the install button on the right side of your browser search bar.

![pwa-install](/docs/pwa-install.png)

## How to install - node

- Install node v20
- Install yarn
- In your terminal navigate to the game folder
- Run `yarn install`
- Run `yarn build`
- Run `yarn preview`
