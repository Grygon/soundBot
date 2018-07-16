const Discord = require('discord.js');
const client = new Discord.Client();
const secret = require('./secret.json');
const fs = require('fs');

// Hardcoded (for now) prefix
const prefix = '$';


// Read in all commands from command folder
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

// Setup command cooldown
const cooldowns = new Discord.Collection();

// Verify server is up and running
client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
	// Catch easy failures early
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Process message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Hardcoded hidden exit command. Only for myself, and separated from standard commands due to its nature.
    // No need to have a normal file, with help etc for this.
    if (message.author.id === '122534115307159552' && commandName === "exit") {
        message.reply("Hi admin! Restarting bot...");
        // Wait, otherwise it exits before it finishes sending (for some reason.......)
        setTimeout(function() {
            return process.exit();
        }, 100);
    }


    // Existence check
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;


    // Argument check
    if (command.args && !args.length) {
        return message.reply("You didn\'t provide any arguments!");
    }


    // Server check
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    // DM check
    } else if (command.dmOnly && message.channel.type !== 'DMChannel') {
        // TODO: Implement DM handling
        return message.reply('I can only execute that command inside DMs!');        
    }


    // Cooldown check
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    // Time handling
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    // Check cooldown
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        // If it hasn't expired, don't let it through
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        // Set cooldown
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }


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