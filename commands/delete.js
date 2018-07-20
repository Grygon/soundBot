const fs = require('fs');

module.exports = {
    name: 'delete',
    description: 'Delete a sound command. Requires "Manage Messages" permissions or to be the original person who added the sound',
    args: false,
    aliases: ['del','rm'],
    guildOnly: true,
    execute(message, args) {
        const prefix = '$';
        const sound = args[0];
        const serverDir = `./sounds/${message.guild.id}`;

        // Check that it exists
        const soundFiles = fs.readdirSync(serverDir);
        if (!soundFiles.map(f => f.substring(0,f.length - 4)).includes(sound)) {
                        console.log(`Attempted non-existant deletion`);
                        return message.channel.send(`That sound doesn't exist! Use ${prefix}list to find all existing sounds`);
        } 

        // Find original adder
        fs.readFile(`${serverDir}/${sound}.json`, function(err, file) {
            if (err) throw err;

            const content = JSON.parse(file);
            const user = content.user;
        });

        // Permissions check
        // For now, assume that people who can manage messages are also allowed to delete sound commands
        // Author is always allowed to delete their own files
        if(message.member.hasPermission("MANAGE_MESSAGES") || (message.author.id === user)) {

            // Delete all matches (yes all, so it's compatible with metadata)
            const matches = soundFiles.filter(f => f.startsWith(`${sound}.`))
            for (i = 0;i < matches.length;i++) {
                fs.unlink(`${serverDir}/${matches[i]}`, (err) => {
                    if (err) { 
                        message.reply("Something went wrong!");
                        throw err;
                    }
                    console.log(`Successfully deleted ${matches[i]}`);
                });
            }
            return message.reply(`${sound} has been deleted`);  

         } else {

            console.log(`Attempted to delete without permissions`);
            return message.reply("Sorry, you don't have permissions to do that!");
        }
    },
};