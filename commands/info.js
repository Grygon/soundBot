const fs = require('fs');

module.exports = {
    name: 'info',
    description: 'Get information on a sound file',
    args: true,
    aliases: ['metadata'],
    guildOnly: true,
    execute(message, args) {
        const file = args[0];
        const prefix = '$';


        // Existence check
        const files = fs.readdirSync(serverDir);
        if (!files.map(f => f.substring(0,f.length - 4)).includes(file)) {
                        console.log(`Attempted information on non-existent sound`);
                        return message.channel.send(`That sound doesn't exist! Use ${prefix}list to find all existing sounds`);
        }

        // Grab metadata
        fs.readFile(`${serverDir}/${sound}.json`, function(err, file) {
            if (err) throw err;

            const content = JSON.parse(file);
        });

        // Format (using a pushed-data method for extendability)
        const data = [];
        data.push(`Information on the sound ${file}\n`);
        data.push(`Added by ${content.user} at ${(new Date(content.time)).toString()}\n`);

        return message.channel.send(data);
    },
};