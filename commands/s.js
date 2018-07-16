const fs = require('fs');

module.exports = {
    name: 'sound',
    description: 'Play a sound!',
    args: true,
    aliases: ['s'],
    guildOnly: true,
    cooldown: 2,
    execute(message, args) {
    	// TODO: Handle (and differentiate between) files, standard media links, and youtube links. Maybe split off if necessary.

    	// Find matching sound files
        const soundFiles = fs.readdirSync(`./sounds/${message.guild.id}`).filter(f => f.startsWith(args[0] + "."));
        if (soundFiles.length === 1) {
        	// Join the channel if possible
			if (message.member.voiceChannel) {
		      message.member.voiceChannel.join()
		        .then(connection => { // Connection is an instance of VoiceConnection
	        	  // Play found sound file
	        	  console.log("Playing " + args[0] + "...");
	        	  const dispatcher = connection.playFile(soundFiles[0]);
				  message.reply("Playing " + args[0] + "...");
		        });
		    } else {
		      return message.reply('You need to join a voice channel first!');
		    }

        // Failures below
        } else if (soundFiles.length === 0) {
        	message.reply("Don\'t have that sound registered!");
        } else {
        	throw "Too many sound files for that name exist!";
        }
    },
};