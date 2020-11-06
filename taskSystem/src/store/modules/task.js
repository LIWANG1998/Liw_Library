import {
  getStore,
  setStore
} from "@/utils/store";
const common = {
  state: {
    pickerUser: {},
    pickerUserType: "",
    pickerUserObj:{},
    taskListQuery: getStore({
      name: "taskListQuery"
    }) || {},
  },
  mutations: {
    SET_PICKER_USER: (state, data) => {
      state.pickerUser = data;
    },
    SET_PICKER_USER_TYPE: (state, data) => {
      state.pickerUserType = data;
    },
    SET_TASK_LIST_QUERY: (state, data) => {
      state.taskListQuery = data;
      setStore({
        type:"session",
        name: "taskListQuery",
        content: state.taskListQuery
      });
    },
  }
};
export default common;
