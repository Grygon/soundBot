const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Get information on a sound file',
    args: true,
    aliases: ['metadata'],
    guildOnly: true,
    execute(message, args) {
        const file = args[0];
        const prefix = '$';
        const serverDir = `./sounds/${message.guild.id}`;


        // Existence check
        const files = fs.readdirSync(serverDir);
        if (!files.map(f => f.substring(0,f.length - 4)).includes(file)) {
                        console.log(`Attempted information on non-existent sound`);
                        return message.channel.send(`That sound doesn't exist! Use ${prefix}list to find all existing sounds`);
        }

        // Grab metadata
        var content = JSON.parse(fs.readFileSync(`${serverDir}/${file}.json`, 'utf8'));

        console.log("Setting up info data...");
        console.log(content);
        
        message.guild.fetchMember(content.user).then(user => {
            // Format (using a pushed-data method for extendability)
            var data = [];
            data.push(`Information on the sound ${file}\n`);
            data.push(`Added by ${user.displayName} on ${formatDate(content.time)}\n`);

            return message.channel.send(data);
        });
    },
};


// Thanks to https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}