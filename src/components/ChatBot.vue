<template>

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
       <!-- <b-avatar size="md" variant="info" :src="message.photo"></b-avatar> -->
         <img class="chatbox-message__photo" :src="message.photo"> 
      </div>
      <div class="chatbox-message__content">
        <p>{{ message.text }}</p>
      </div>
      <div class="chatbox-message__options">
        <li class="chatbox-conversation__message" :key="option.id" v-for="option in message.options" v-bind:class="'chatbox-conversation__message--'">
          <b-button pill variant="light" @click="selectOption(option.id)">{{option.option}}</b-button> 
      </li>
        </div>
    </li>
    
  </ul>
  <form class="chatbox-footer">
    <!-- <input class="chatbox-message" v-model="message">
    <button type="button" class="chatbox-btn chatbox-btn--send" @click="addMessage()">Send</button>-->
  </form>
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
        message: '',
        conversation: [],
        options: [],
      }}, 
      
  methods: {
    addMessage: function() {   
      console.log("add message triggered");
      var messageDetails = {
        id: this.conversation.length + 1,
        sender: 'Tom',
        text: this.message,
        type: 'to',
        photo: 'https://i.pravatar.cc/30?img=2',
        options: this.options,
      };
      
      if(this.message.length) {
        this.conversation.push(messageDetails);
        // This code is triggering the 'sendMessage' event and passing in the message data.
        Chatbot.trigger('sendMessage', JSON.parse(JSON.stringify(this.conversation[this.conversation.length-1])));
        this.message = '';
        this.options = [];
      }

      

    }, startChatSession: function() {
          // Start a new chat session for a guest user
    this.axios.post('https://us-central1-prototypeftt-cca12.cloudfunctions.net/api/chatbot/newsession', {
            "senderUuid" : "guest",
            "selection" : "",
            }).then(response => (this.updateMessage(response)))

            /*.then(function (response) {
           
            //console.log("api call success " + JSON.stringify(response.data.message));
            console.log("api call success " + response.data.message);
            //this.updateMessage(response.data.message);
            //console.log("this message:"+this.message);
            //this.message = response.data.message;
            Chatbot.trigger('sendMessage', response.data.message);
            //this.conversation.push(response);

            })*/

            .catch(function (error) {
            //this.sendingReply = false;

            console.log("api call failure " + error);

            });
    }, updateMessage: function(response) {
      //this.message=message.data.message;
      //console.log("api call success " + response.data.options.k);
      this.message = response.data.message;
      //this.options = response.data.options;
      for (const [key, value] of Object.entries(response.data.options)) {
        console.log(`${key}: ${value}`);
      var option = {
        id: key,
        option: value,
      };

      this.options.push(option);

      }
      //this.options.push(response.data.options);
        //console.log("this message:"+message)
        //this.addMessage;
        
    }, selectOption: function(option){
      console.log("option selected:" + option);
      this.axios.post('https://us-central1-prototypeftt-cca12.cloudfunctions.net/api/chatbot/selectoption', {
            "senderUuid" : "guest",
            "selection" : option,
            }).then(response => (this.updateMessage(response)))
    }
    

  }, 
  mounted(){


    this.startChatSession();


  },updated: function() {
    var chatConversation = document.getElementById('conversation');
    chatConversation.scrollTop = chatConversation.scrollHeight;
  }, watch : { message:function() {
    this.addMessage();
  }
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
  height: 400px;
  overflow: hidden;
}

.chatbox-header {
  padding: 10px;
  overflow: hidden;
  background: black;
  color: white;
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
  background: white;
  border-radius: 12px;
  display: inline-block;
  margin: 5px 0 0;
}

.chatbox-message__options {
  padding: 5px 12px;

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
  background: black;
  padding: 5px 10px;
}

</style>