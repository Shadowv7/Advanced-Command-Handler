/** @module functions/getThing */

const client = require('../main.js');
/**
 * Let you get a {thing} into your Client, or the {text}.
 * @param {'command'|'channel'|'guild'|'member'|'user'|'role'|'emote'|'message'} dataType - The type of data to search
 * @param {String|Object} text - Text or Message where to look for the dataType.
 * @return {Promise<Command|GuildChannel|TextChannel|Guild|GuildMember|User|Role|Emoji|Message|boolean>}
 */
module.exports = async (dataType, text) => {
	const message = text.hasOwnProperty('content') && text.content instanceof String ? text : null;
	
	switch (dataType) {
		case 'command':
			return client.commands.find((c) => c.name === text
					|| c.aliases && c.aliases.includes(text))
				|| false;
		case 'channel':
			return message.guild.channels.cache.get(text)
				|| message.mentions.channels.first()
				|| message.guild.channels.cache.find((c) => {
					return c.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1;
				})
				|| false;
		case 'guild':
			return client.guilds.cache..get(text)
				|| client.guilds.cache.find((g) => g.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'member':
			return message.guild.members.cache.get(text)
				|| message.mentions.members.first()
				|| message.guild.members.cache.find((m) => (m.displayName.toLowerCase().includes(text.toLowerCase())
					|| m.user.username.toLowerCase().includes(text.toLowerCase()))
					&& text.length > 1)
				|| false;
		case 'user':
			return client.users.cache.get(text)
				|| client.users.cache.find((u) => u.username.toLowerCase() === text.toLowerCase())
				|| message.mentions.users.first()
				|| false;
		case 'role':
			return message.guild.roles.cache.get(text)
				|| message.mentions.roles.first()
				|| message.guild.roles.cache.find((r) => r.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'emote':
			return client.emojis.cache.get(text)
				|| client.emojis.cache.find((e) => e.name.toLowerCase().includes(text.toLowerCase()) && text.length > 1)
				|| false;
		case 'message':
			
			if (text.length < 7) return false;
			const m = await message.channel.messages.fetch(text);
			if (m) return m;
			
			const url = message.replace('https://discordapp.com/channels/', '').split('/');
			if (message.startsWith('https') && client.channels.has(url[1])) {
				return (await client.channels.get(url[1]).messages.fetch(url[2])) || false;
			}
			
			for (const channel of client.channels) {
				const m = await channel[1].message.fetch(text);
				if (m) return m;
			}
			return false;
	}
};
