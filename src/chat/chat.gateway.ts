import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';

@WebSocketGateway(3001, {cors: '*'})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server;
  
  @SubscribeMessage('getChatrooms')
  chatsUpdate(@MessageBody() message) {
    this.chatService.getChats(message.userLogin).then((result) => {
      this.server.emit('chatroomsUpdate', {chats: result, userLogin: message.userLogin});
    }).catch(err => {
      this.server.emit('error', err);
    });
  }

  @SubscribeMessage('getChatMessages')
  getMessages(@MessageBody() message) {
    let chatId = message.chatid;
      this.chatService.getMessages(message.chatid).then((result) => {
        this.server.emit('messagesUpdate', {messages: result, chatId: chatId});
      }).catch(err => {
        this.server.emit('error', err);
      });
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() message){
    let chatId = message.chatid;
    this.chatService.sendMessage(message.fromLogin, message.chatid , message.body).then(() => {
      
      this.chatService.getMessages(message.chatid).then((result) => {
        this.server.emit('messagesUpdate', {messages: result, chatId: chatId});
      }).catch(err => {
        this.server.emit('error', err);
      });

    }).catch(err => {
      this.server.emit('error', err);
    });
  }

}
