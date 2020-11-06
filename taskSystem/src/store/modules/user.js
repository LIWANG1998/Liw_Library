import { getStore, setStore } from "@/utils/store";
import { common } from "@/api";
import waterMark from "@/utils/watermark.js";
const user = {
  state: {
    userInfo:
      getStore({
        name: "userInfo",
        type:"session",
      }) || [],
    power:
      getStore({
        name: "power",
        type:"session",
      }) || {},
    signature:
      getStore({
        name: "signature",
        type:"session",
      }) || {},
  },
  actions: {
    async GetUserInfo({ commit }) {
      const { data } = await common.getUserInfo()
      commit("SET_USER_INFO", data);
      let power = {};
      const { is_initiate, is_query, is_super_admin, type,watermark} = data;
      power = { is_initiate: is_initiate, is_query: is_query, is_super_admin: is_super_admin,type:type };
      waterMark.set(watermark||"名冠天下");
      commit("SET_USER_POWER", power);
    },
  },
  mutations: {
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({
        name: "userInfo",
        type:"session",
        content: state.userInfo
      });
    },
    SET_USER_POWER: (state, power) => {
      state.power = power;
      setStore({
        name: "power",
        type:"session",
        content: state.power
      });
    },
    SET_SIGNATURE: (state, signature) => {
      state.signature = signature;
      setStore({
        name: "signature",
        type:"session",
        content: state.signature
      });
    }
  }
};
export default user;
