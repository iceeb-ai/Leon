module.exports = {
  command: 'promote',
  info: 'Gives admin authority to replied or mentioned user.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in groups!*' });
    if (!text && !msg.replied) return await msg.reply({ text: '*Please reply or mention any user!*' });
    if (!(await msg.isAdmin(msg.me))) return await msg.reply({ text: '*I am not an admin of this group!*' });
    if (!(await msg.isAdmin(msg.sender))) return await msg.reply({ text: '*You are not an admin of this group!*' });
    if (msg.replied) {
      let isPart = await msg.isParticipant(msg.replied.sender, msg.chat);
      if (!isPart) return await msg.reply({ text: '*@' + msg.replied.sender.split('@')[0] + ' is not a participant of this group.*' });
      await sock.groupParticipantsUpdate(msg.chat, [msg.replied.sender], 'promote');
      return await msg.reply({ text: '*Promoted @' + msg.replied.sender.split('@')[0] + '!*' });
    } else if (msg.mentions) {
      msg.mentions.map(async (user) => {
        let isPart = await msg.isParticipant(user, msg.chat);
        if (!isPart) return await msg.reply({ text: '*@' + user.split('@')[0] + ' is not a participant of this group.*' });
        await sock.groupParticipantsUpdate(msg.chat, [user], 'promote');
      });
      return await msg.reply({ text: '*Promoted:*\n' + msg.mentions.map((user) => '@' + user.split('@')[0]).join('\n') });
    }
  }
};
