const fs = require('fs');
const sanitize = require("sanitize-filename");
const download = require('download-file');

module.exports = {
    name: 'addSound',
    description: 'Step-by-step sound registration!',
    args: false,
    aliases: ['newSound','add'],
    guildOnly: true,
    cooldown: 10,
    execute(message, args) {
    	// Using a collector for multiple-step input
    	console.log("Adding new sound!");
		const filter = m => !m.author.bot;
		// Have to nest in a promise so we can get the dm channel we're working with
		// ugh
		message.author.createDM().then((channel) => {
			const collector = channel.createMessageCollector(filter, { time: 300000 });
			var context = 0;

			// Check that server doesn't have too many sounds...
			if(fs.readdirSync(`./sounds/${message.guild.id}`).length >= 50) {
				console.log("Server full!");
				message.channel.send("This server already has 50 custom sounds! Please have an admin delete some!")


				return;
			}

			// Successful, start adding process!
			message.channel.send("Adding new sound via DM...");
			message.author.send("Okay, let's add a new sound! What name do you want?",);
			message.author.send("Cancel at any time by sending \"cancel\"",)
;
			// When a message is sent in the DM channel...
			collector.on('collect', m => {
				// Let us cancel at any time
				if (m.content === "cancel") {
					console.log("New sound cancelled");

					m.channel.send("Okay, cancelling!");
					collector.stop('cancelled');
				} else if (context == 0) {
					// Naming
					name = m.content;

					name = sanitize(name);

					if (fs.readdirSync(`./sounds/${message.guild.id}`).map(f => f.substring(0,f.length - 4)).includes(name)) {
						console.log(`Attempted duplicate registration`);
						m.channel.send("That name is already taken, please select another!");
					} else {
						console.log(`Sound name: ${name}`);

						m.channel.send("Name registered as " + name);
						m.channel.send("Please send a sound file to associate with that name!");
						context = 1;
					}
				} else if (context == 1) {
					// File registration
					files = m.attachments.array();
					if(files.length==1) {
						
						// Manual list of acceptable audio formats.
						// If there's a better solution, use it.
						formats = ['mp3','mp4','wav'];

						if (formats.includes(files[0].filename.substr(files[0].filename.length - 3))) {
							// This is it... saving here
							const options = {
								directory: `./sounds/${message.guild.id}`,
								filename: `${name}.${files[0].filename.substr(files[0].filename.length - 3)}`
							};

							download(files[0].url, options, function(err) {
								// Post-download things
								if (err) throw err;
								m.channel.send(`Successfully received file and registered as ${name}. \n 
Please give it a try in the server with $play ${name} !`)
								message.channel.send(`${message.author} has added a new sound, try it out with $play ${name}!`);
								context = 2;
							});

						} else {

							console.log(files[0].filename.substr(files[0].filename.length - 3));
							m.channel.send("Please send a valid audio file!");
							m.channel.send("Valid types include " + audioTypes);
						}
					} else {
						m.channel.send("Please send one (and only one) attachment!")
					}
				}

			});

			// When we're done, if it hasn't run all the way through let them know.
			collector.on('end', (collected, r) => {
				if (context !== 2 && r !== 'cancelled') {
			   		message.author.send("Timed out, please try again...");
				}
			});

		});




    	/*
		Process map:
		+ User requests sound addition (Outside this environment)
		+ Bot checks for user sound quota (10 per person?)
			- How are we going to handle this??? Skip for now, but is needed
		+ 		- Code in a hard limit of 50 per sever for now, abuse mitigation (That I don't think is needed)
		+ Bot replies with prompt for desired name
		+ User selects name
		- If invalid, request new name
		+ Otherwise, request file
			- 1st implementation: Directly send file (will limit potential size problems) 
			- Eventually add support for direct links and/or youtube?
		- Prompt for active server
		-	Find servers user & SB are in
		-	Give numeric options (1, 2, 3, etc)
		-	Select option -> get server ID -> Place in there
		+ Download file to appropriate folder

		NOTE: 
			Restricting file to specific servers could lead to size issues.
				Opt 1: 
					o Remove server limitations
					+ All available in one place, nice and easy
					+ No dupliation going on
					- All sounds available for everyone
					- No restrictions
				Opt 2:
					o Cross-server aliasing
					+ Could remove some serverside duplication
					- User-based
					- Difficult implementation
					- Minor gains
				Opt 3:
					o Hardlink crawler
					+ As much gains as possible
					+ Automated
					- High processing
					- Minor differences would lead to duplication
    	*/
    },
};