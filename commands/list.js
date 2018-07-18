const fs = require('fs');

module.exports = {
    name: 'list',
    description: 'List all available sounds for the server',
    args: false,
    aliases: ['listSounds'],
    guildOnly: true,
    cooldown: 10,
    execute(message, args) {
    	// Same basic format as help, but different directory
        const prefix = '$';
        const data = [];

        const soundFiles = fs.readdirSync(`./sounds/${message.guild.id}`);
        
        if (soundFiles.length === 0) {
			return message.reply(`This server doesn\'t have any sounds yet! Add some using ${prefix}add`);        	
        }

		data.push('All available sounds:');
		data.push(soundFiles.map(f => f.substring(0,f.length - 4)).join(', '));

		return message.reply(data);
    },
};