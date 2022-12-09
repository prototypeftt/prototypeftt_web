<template>
  <div class="logout">
    <h1>Chatbot Demo</h1>
    <div class="chatbox" id="maintel-chat">
  <div class="chatbox-header">
    <div class="chatbox-agent">
      <span>FTT Chatbot</span>
    </div>
    <div class="chatbox-close">
      <span>x</span>
    </div>
  </div>
  <ul class="chatbox-conversation" id="conversation">
    <li class="chatbox-conversation__message" :key="message.id" v-for="message in conversation" v-bind:class="'chatbox-conversation__message--' + message.type">
      <div class="chatbox-message__sender">
        <span>{{ message.sender }}</span>
        <img class="chatbox-message__photo" :src="message.photo">
      </div>
      <div class="chatbox-message__content">
        <p>{{ message.text }}</p>
      </div>
    </li>
  </ul>
  <form class="chatbox-footer">
    <input class="chatbox-message" v-model="message">
    <button type="button" class="chatbox-btn chatbox-btn--send" @click="addMessage()">Send</button>
  </form>
</div>
  </div>
  
</template>

<script>

//import { getAuth } from "firebase/auth";

//const auth = getAuth();
//console.log("logging out" + auth.currentUser.email);


// Event handling code, allowing the ability to bind to specific events.
var Chatbot = {
    events: {},
    on: function(event, callback) {
        var handlers = this.events[event] || [];
        handlers.push(callback);
        this.events[event] = handlers;
    },
    trigger: function(event, data) {
        var handlers = this.events[event];
        if (!handlers || handlers.length < 1)
            return;
        [].forEach.call(handlers, function(handler){
            handler(data);
        });
    }
};

export default {
  name: 'ChatBot',
  props: {

  },   data: () => {
      return {
        message: 'Hello Vue!',
        conversation: [],
      }}, 
      
  methods: {
    addMessage: function() {   
      console.log("add message triggered");
      var messageDetails = {
        id: this.conversation.length + 1,
        sender: 'Tom',
        text: this.message,
        type: 'to',
        photo: 'https://i.pravatar.cc/30?img=2'
      };
      
      if(this.message.length) {
        this.conversation.push(messageDetails);
        // This code is triggering the 'sendMessage' event and passing in the message data.
        Chatbot.trigger('sendMessage', JSON.parse(JSON.stringify(this.conversation[this.conversation.length-1])));
        this.message = '';
      }
    }
    

  }, mounted(){
    


  },updated: function() {
    var chatConversation = document.getElementById('conversation');
    chatConversation.scrollTop = chatConversation.scrollHeight;
  }
};

</script>
<style>

* {
  box-sizing: border-box;
  font-family: sans-serif;
}

.chatbox {
  background: #ccc;
  position: absolute;
  bottom: 0;
  right: 5px;
  border-radius: 5px 5px 0 0;
  width: 260px;
  height: 300px;
  overflow: hidden;
}

.chatbox-header {
  padding: 10px;
  overflow: hidden;
  background: #666;
}

.chatbox-agent {
  float: left;
  font-weight: bold;
}

.chatbox-close {
  float: right;
}

.chatbox-conversation {
  list-style: none;
  margin: 0;
  padding: 5px 10px;
  background: #ccc;
  overflow: auto;
  position: absolute;
  top: 38px;
  bottom: 31px;
}

.chatbox-conversation__message {
  margin: 0 0 10px;
  display: inline-block;
  width: 100%;
}

.chatbox-conversation__message--from > .chatbox-message__content {
  float: left;
  clear: both;
}

.chatbox-conversation__message--to > .chatbox-message__content {
  float: right;
  clear: both;
}

.chatbox-conversation__message--from > .chatbox-message__sender > .chatbox-message__photo {
  margin-right: 6px;
}

.chatbox-conversation__message--to > .chatbox-message__sender > .chatbox-message__photo {
  margin-left: 6px;
}

.chatbox-message__sender {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}

.chatbox-conversation__message--to > .chatbox-message__sender {
  float: right;
}

.chatbox-conversation__message--from > .chatbox-message__sender {
  float: left;
  flex-direction: row-reverse;
}

.chatbox-message__content {
  padding: 5px 12px;
  background: #5e6e6e;
  border-radius: 12px;
  display: inline-block;
  margin: 5px 0 0;
}

.chatbox-message__photo {
  border-radius: 100%;
  border-width: 2px;
  border-color: black;
  border-style: solid;
  overflow: hidden;
}

.chatbox-message__content > p {
  margin: 0;
}

.chatbox-footer {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background: #666;
  padding: 5px 10px;
}

</style>