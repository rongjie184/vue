
const getters = {
  userName:state=>state.user.userName,
  role:state=>state.user.role,
  lastTime:state=>state.user.lastTime,
  navList:state=>state.user.navList,
  reSign:state=>state.user.reSign,
  urlArr:state=>state.user.urlArr,
  aliveUrl:state=>state.user.aliveUrl,
}
export default getters
