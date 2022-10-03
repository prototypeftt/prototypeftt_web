# FTT Prototype Web Application for Brokers

# Environment Setup

Linux - Debian

Check version of vue installed 

vue --version

vue install
npm install -g @vue/cli
npm i vue@2.6.12

- npm as default package manager Vue 2

vue create prototypeftt_web

After vue project creation

 $ cd prototypeftt_web
 $ npm run serve

http://localhost:8080/

Install bootstrap and bootstrap-vue

npm install bootstrap bootstrap-vue --save


change main.js to include this code:

```
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

```

vue add router

Install firebase

npm install firebase

change main.js to add this code
'''
import firebase from "firebase";
'''
https://stackoverflow.com/questions/70445014/module-not-found-error-package-path-is-not-exported-from-package

# Approach
 
 SPA (Single Page Application)



# Resources

https://bootstrap-vue.org/

https://docs.github.com/en/authentication/connecting-to-github-with-ssh

https://linuxhint.com/install-use-bootstrap-with-vue-js/

https://medium.com/@renatello/things-i-put-in-gitignore-file-for-vue-js-projects-c53cecd8bd08

https://auth0.com/blog/beginner-vuejs-tutorial-with-user-login/

https://vueschool.io/articles/vuejs-tutorials/how-to-use-vue-router-a-complete-tutorial/

https://www.digitalocean.com/community/tutorials/how-to-debug-components-state-and-events-with-vue-js-devtools

https://vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram 

https://commons.wikimedia.org/wiki/File:Rock-paper-scissors.svg

https://www.delftstack.com/howto/javascript/select-a-random-element-from-an-array-in-javascript/

https://bootstrap-vue.org/docs/components/layout

https://learnvue.co/tutorials/vue-firebase-authentication  use next link to utilise firebase code in vue correctly

https://firebase.google.com/docs/auth/web/start