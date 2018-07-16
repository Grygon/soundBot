const fs = require('fs');

module.exports = {
    name: 's',
    description: 'Play a sound!',
    execute(message, args) {
    	// Find matching sound files
        const soundFiles = fs.readdirSync(`./sounds/${message.guild.id}`).filter(f => f.startsWith(args[0] + "."));
        if (soundFiles.length === 1) {
        	// Check to make sure we're in a server
        	if (!message.guild) {
        		message.reply("Can only play sounds in a server!");
        		throw "Can only play sounds in a server!";
        	}

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
		      message.reply('You need to join a voice channel first!');
		      return;
		    }


        // Failures below
        } else if (soundFiles.length === 0) {
        	message.reply("Don\'t have that sound registered!");
        } else {
        	throw "Too many sound files for that name exist!";
        }
    },
};