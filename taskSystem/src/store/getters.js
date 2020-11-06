const getters = {
  userInfo: state => state.user.userInfo,
  power: state => state.user.power,
  rootPath: state => state.common.rootPath,
  uploadUrl: state => state.common.uploadUrl,
  pickerUser: state => state.task.pickerUser,
  pickerUserType: state => state.task.pickerUserType,
  taskListQuery: state => state.task.taskListQuery,
  signature: state => state.user.signature
};
export default getters;
