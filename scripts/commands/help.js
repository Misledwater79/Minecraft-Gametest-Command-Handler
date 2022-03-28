import { world } from "mojang-minecraft"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('help')
.setAliases(['h','?','hlp'])
.setDescription('Provides help/list of command')
.setUsage(['<page: int>','[command: CommandName]'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
  return input.setName('command').setType('string').setDescription('command name you need help on!')
})

CommandHandler.register(registration, (interaction) => {
  try {
    const playerInput = interaction.command.getInput('command')?.getValue()
    
    let message = ``
    switch (!!playerInput) {
      case true:
        if(Number(playerInput)) {
          let pageRequest = 1
          if(parseInt(playerInput) > 1){
            pageRequest = pageRequest = parseInt(playerInput)
          }
          const commands = CommandHandler.getAllCommands()
          let commandMap = []
          for(const [key, command] of commands){
            if(command.private) continue
            for(const usage of command.usages){
              commandMap.push([command.name, usage])
            }
            for(const aliase of command.aliases){
              for(const usage of command.usages){
                commandMap.push([aliase, usage])
              }
            }
          }
          commandMap.sort()
          let pages = Math.round(commandMap.length/7.0+0.5)
          if(pageRequest > pages){
            message += `§2--- Showing help page ${pages} of ${pages} (/help <page>) ---\n§f`
            for(let i = 0; i < 7; i++){
              if(i + (pages-1) * 7 == commandMap.length) break;
              message += `${CommandHandler.getPrefix()}${commandMap[i + (pages-1) * 7][0]} ${commandMap[i + (pages-1) * 7][1]}\n`
            }
            break;
          }
          message += `§2--- Showing help page ${pageRequest} of ${pages} (/help <page>) ---\n§f`
          for(let i = 0; i < 7; i++){
            if(i + (pageRequest-1) * 7 == commandMap.length) break;
            message += `${CommandHandler.getPrefix()}${commandMap[i+(pageRequest-1)*7][0]} ${commandMap[i+(pageRequest-1)*7][1]}\n`
          }
          message += `§2Tip: You can use ${CommandHandler.getPrefix()}help <command: CommandName> to get more information about a certain command`
          break;
        }
        const command = CommandHandler.getCommand(playerInput)
        if(!command || command?.private){
          message += `§cUnknown command: ${playerInput}. Please check that the command exists and that you have permission to use it.`
          break;
        }
        
        if(command.aliases.length > 0){
          for(const aliase of command.aliases){
            if(aliase == command.aliases[0]){
              message += `§e${command.name} (also ${aliase}`
              continue
            }
            message += `, ${aliase}`
          }
          message += `)`
        } else {
          message += `§e${command.name}`
        }
        message += `:\n${command.description}.\n§fUsage:\n`
        if(command.usages.length <= 1){
          message += `- ${CommandHandler.getPrefix()}${command.name} ${command.usages ? command.usages : ' '}\n`
        } else {
          for(const usage of command.usages){
            message += `- ${CommandHandler.getPrefix()}${command.name} ${usage}\n`
          }
        }
        break;
      case false:
        const commands = CommandHandler.getAllCommands()
        let commandMap = []
        for(const [key, command] of commands){
          if(command.private) continue
          for(const usage of command.usages){
            commandMap.push([command.name, usage])
          }
          for(const aliase of command.aliases){
            for(const usage of command.usages){
              commandMap.push([aliase, usage])
            }
          }
        }
        commandMap.sort()
        if(commandMap.length < 7){
          message += `§2--- Showing help page 1 of 1 (/help <page>) ---\n§f`
          for(const command of commandMap){
            message += `${CommandHandler.getPrefix()}${command[0]} ${command[1] ? command[1] : ' '}\n`
          }
          message += `§2Tip: You can use +help <command: CommandName> to get more information about a certain command`
          break;
        }
        message += `§2--- Showing help page 1 of ${Math.round(commandMap.length/7.0+0.5)} (/help <page>) ---\n§f`
        for(let i = 0; i < 7; i++){
          message += `${CommandHandler.getPrefix()}${commandMap[i][0]} ${commandMap[i][1]}\n`
        }
        message += `§2Tip: You can use +help <command: CommandName> to get more information about a certain command`
        break;
      default:
        break;
    }
    
     world.getDimension('overworld').runCommand(`tellraw "${interaction.player.nameTag}" ${JSON.stringify({ rawtext: [ { text: message } ] })}`)
  } catch(e) {
    console.warn(`say ${e} ${e.stack}`)
  }
})