<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary app>
      <v-list dense>
        <v-list-tile flat to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile flat to="/results">
          <v-list-tile-action>
            <v-icon>book</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Testresultaten</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="!loggedIn" flat to="/login">
          <v-list-tile-action>
            <v-icon>lock</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="admin" flat to="/admin">
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Opties</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark prominent color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat to="/">
          <v-icon>home</v-icon>Home
        </v-btn>
        <v-btn flat to="/results">
          <v-icon>book</v-icon>Testresultaten
        </v-btn>
        <v-btn v-if="!loggedIn" flat to="/login">
          <v-icon>lock</v-icon>Login
        </v-btn>
        <v-btn v-if="admin" flat to="/admin">
          <v-icon>edit</v-icon>Opties
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <a href="https://howtotest.be/" target="_blank">
        <img :src="imageUrl" class="App-Logo align-center" alt="logo" title="logo">
      </a>
    </v-toolbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import * as howtotestapi from "@/services/api/howtotestapi";
import { BASE_URL } from "./services/constants";

export default {
  data: () => ({
    baseUrl: BASE_URL,
    drawer: null,
    admin: false
  }),
  computed: {
    loggedIn() {
      return this.$store.getters["user/isLoggedIn"];
    },
    imageUrl: function() {
      return this.baseUrl + "/images/logo/logo.png";
    }
  },
  methods: {
    checkUser: function() {
      let self = this;
      if (this.loggedIn) {
        howtotestapi
          .isAdmin(self.$store.getters["user/getUser"].email)
          .then(isAdmin => (self.admin = isAdmin.isAdmin))
          .catch(err => console.log(err));
      }
    }
  },
  mounted: function() {
    let self = this;
    this.$root.$on("loggedIn", function() {
      setTimeout(function() {
        self.checkUser();
      }, 100);
    });
  }
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

.App-Logo {
  height: 70%;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
