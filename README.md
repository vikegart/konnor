# konnor
bot for vk - voices to text, mention all and other features

## Getting Started

u need create tokens on some sites and put them to project file


### Installing

Clone repos, then

install [pm2](https://pm2.io/doc/en/runtime/guide/installation/) enviroment globally

```
npm i pm2 -g
```
Go to project foldaer and install all packages

```
npm i
```
add tokens in a file (u can see tokens_example)

```
secret_tokens.js
```

then run konnor.js - this is main file

```
pm2 start konnor.js
```

Done!
