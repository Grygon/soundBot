const Discord = require('discord.js');
const client = new Discord.Client();
const secret = require('./secret.js');
const fs = require('fs');

// Hardcoded (for now) prefix
const prefix = '~';


// Read in all commands from command folder
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

// Verify server is up and running
client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
	// Catch easy failures early
	if (!message.content.startsWith(prefix) || message.author.bot()) return;

	// Process message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // If we don't have it registered dynamically, ignore
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    // Otherwise, run it!
	try {
		command.execute(message, args);
	}
	catch (error) {
	    console.error(error);
	    message.reply('I couldn\'t run that!');
	}
})

// Start it up!
console.log('Connecting...');
client.login(secret.token);