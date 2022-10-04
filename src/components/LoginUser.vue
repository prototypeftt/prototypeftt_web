
<template>

<div class="login-page">

      <transition name="fade">
         <div v-if="!registerActive" class="wallpaper-login"></div>
      </transition>
      <div class="wallpaper-register"></div>
   <h1>{{ msg }}</h1>
      <div class="container">
         <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
               <div v-if="!registerActive" class="card login" v-bind:class="{ error: emptyFields }">
                  <h1>Sign In</h1>
                  <form class="form-group">                     
                     <input v-model="emailLogin" type="email" class="form-control" placeholder="Email" required>
                     <input v-model="passwordLogin" type="password" class="form-control" placeholder="Password" required>
                     <input type="submit" class="btn btn-primary" @click="doLogin">
                     <p>Don't have an account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Sign up here</a>
                     </p>
                  </form>
               </div>

               <div v-else class="card register" v-bind:class="{ error: emptyFields }">
                  <h1>Sign Up</h1>
                  <form class="form-group">
                     <input v-model="nameReg" type="name" class="form-control" placeholder="Name" required>                     
                     <input v-model="emailReg" type="email" class="form-control" placeholder="Email" required>
                     <input v-model="passwordReg" type="password" class="form-control" placeholder="Password" required>
                     <input v-model="confirmReg" type="password" class="form-control" placeholder="Confirm Password" required>
                     <input type="submit" class="btn btn-primary" @click="doRegister">
                     <p>Already have an account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Sign in here</a>
                     </p>
                  </form>
               </div>
            </div>
         </div>

      </div>
   </div>

</template>


<script>
   
  export default {
    name: 'LoginUser',
    data() {
      return{
    name: '',
    password: '',
    loggedIn: false,
    registerActive: false,
    emailLogin: "",
    passwordLogin: "",
    emailReg: "",
    passwordReg: "",
    confirmReg: "",
    emptyFields: false}
  },
    
    methods: {
    doLogin() {
       if (this.emailLogin === "" || this.passwordLogin === "") {
          this.emptyFields = true;
       } else {
         this.loggedIn = this.checkCredentials(this.emailLogin,this.passwordLogin);

         if (this.loggedIn){
            alert("You are now logged in");
            localStorage.loggedIn = true;
            this.$router.push('game');
            window.dispatchEvent(new CustomEvent('loggedIn-localstorage-changed', {
            detail: {
               storage: localStorage.getItem('loggedIn')
            }
            }));

         }else{
            alert("You are not logged in");
         }
          
       }
    },
    
    doRegister() {
       if (this.nameReg === "" || this.emailReg === "" || this.passwordReg === "" || this.confirmReg === "") {
          this.emptyFields = true;
       } else {
         localStorage.name = this.nameReg;
         localStorage.email = this.emailReg;
         localStorage.password = this.passwordReg;
         localStorage.loggedIn = true;
         alert("You are now registered");

         this.loggedIn = this.checkCredentials(this.emailReg,this.passwordReg);
         window.dispatchEvent(new CustomEvent('loggedIn-localstorage-changed', {
            detail: {
               storage: localStorage.getItem('loggedIn')
            }
            }));
         this.$router.push('game');
         
       }
    },

    checkCredentials(emailLogin, passwordLogin){

      var credCheck = false;

      if (localStorage.email === emailLogin && localStorage.password === passwordLogin) {
         credCheck = true;
      } else {
         credCheck = false;
      }

      return credCheck;
    }

 },
  };
  
</script>



<style scoped>
p {
    line-height: 1rem;
 }
 
 .card {
    padding: 20px;
 }
 
 .form-group {
    input {
       margin-bottom: 20px;
    }
 }
 
 .login-page {
    align-items: center;
    display: flex;
    height: 100vh;
 
    .wallpaper-login {
       background: url(https://images.pexels.com/photos/32237/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)
          no-repeat center center;
       background-size: cover;
       height: 100%;
       position: absolute;
       width: 100%;
    }
    
    .fade-enter-active,
    .fade-leave-active {
   transition: opacity .5s;
 }
    .fade-enter,
    .fade-leave-to {
       opacity: 0;
    }
    
    .wallpaper-register {
       background: url(https://images.pexels.com/photos/533671/pexels-photo-533671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)
          no-repeat center center;
       background-size: cover;
       height: 100%;
       position: absolute;
       width: 100%;
       z-index: -1;
    }
 
    h1 {
       margin-bottom: 1.5rem;
    }
 }
 
 .error {
    animation-name: errorShake;
    animation-duration: 0.3s;
 }
 
 @keyframes errorShake {
    0% {
       transform: translateX(-25px);
    }
    25% {
       transform: translateX(25px);
    }
    50% {
       transform: translateX(-25px);
    }
    75% {
       transform: translateX(25px);
    }
    100% {
       transform: translateX(0);
    }
 }

</style>