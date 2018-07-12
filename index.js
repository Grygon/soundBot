const Discord = require('discord.js');
const client = new Discord.Client();
const secret = require('./secret.json');

const prefix = '~';

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
	if (message.author.bot) return;
	console.log(message.content);
	if (message.content.startsWith('${prefix}ping')) {
		message.channel.send('Pong!');
	}
})

console.log('Connecting...');
client.login(secret.token);
