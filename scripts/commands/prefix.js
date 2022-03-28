import { world } from "mojang-minecraft"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('prefix')
.setAliases(['p'])
.setDescription('Find or set the command prefix')
.setUsage(['set <newPrefix: string>'])
.setCancelMessage(true)
.setPrivate(false)
.setRequiredTags(['staff'])
.addGroup(group => {
  return group.setName('set').setAliases(['change']).setDescription('change the prefix').addInput(input => {
    return input.setRequired(true).setType('string').setName('newprefix')
  })
})

CommandHandler.register(registration, (interaction) => {
  const newPrefix = interaction.command.getGroup('set')?.getInput('newprefix')?.getValue()
  
  switch(!!newPrefix) {
    case true:
      CommandHandler.setPrefix(newPrefix)
      world.getDimension('overworld').runCommand(`tellraw ${interaction.player.nameTag} ${JSON.stringify({ rawtext: [ { text: 'prefix has been changed to ' + newPrefix }]})}`)
      break;
    case false:
       world.getDimension('overworld').runCommand(`tellraw ${interaction.player.nameTag} ${JSON.stringify({ rawtext: [ { text: 'the current prefix is ' + CommandHandler.getPrefix() }]})}`)
      break;
    default:
      break;
  }
})
