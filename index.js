const Discord = require('discord.js');
const client = new Discord.Client();
const secret = require('./secret.js');

client.on('ready', () => {
    console.log('Ready!');
});

console.log('Connecting...');
client.login(secret.token);