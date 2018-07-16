const fs = require('fs');

module.exports = {
    name: 'addSound',
    description: 'Step-by-step sound registration!',
    args: false,
    aliases: ['newSound','add'],
    dmOnly: true,
    cooldown: 10,
    execute(message, args) {
    	/*
		Process map:
		User requests sound addition
		Bot checks for user sound quota (10 per person?)
		Bot replies with prompt for desired name
		User selects name
		If invalid, request new name
		Otherwise, request file
			- 1st implementation: Directly send file (will limit potential size problems) 
			- Eventually add support for direct links and/or youtube?
		Prompt for active server
			Find servers user & SB are in
			Give numeric options (1, 2, 3, etc)
			Select option -> get server ID -> Place in there
		Download file to appropriate folder

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