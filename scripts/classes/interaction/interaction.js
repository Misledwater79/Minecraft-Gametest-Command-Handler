import CommandInteraction from './command.js'

class Interaction {
  constructor(command, player, message, args) {
    this.command = new CommandInteraction(command)
    this.player = player
    this.args = args
    this.message = message
  }
}

  
