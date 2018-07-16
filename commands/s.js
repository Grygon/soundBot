const fs = require('fs');

module.exports = {
    name: 's',
    description: 'Play a sound!',
    execute(message, args) {
        const soundFiles = fs.readdirSync(`./sounds/${message.guild.id}`).filter(f => f.startsWith(args[0] + "."));
        if (soundFiles.length === 0) {
        	message.reply("Don\'t have that sound registered!");
        } else if (soundFiles.length === 1) {
        	console.log("Playing " + args[0] + "...");
        	message.reply("Here you go!");
        } else {
        	throw "Too many sound files for that name exist!";
        }
    },
};