import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import common from "./modules/common";
import task from "./modules/task";
import getters from "./getters";

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    user,
    common,
    task
  },
  getters
});

export default store;
