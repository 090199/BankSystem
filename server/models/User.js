/*
* 所有关于  用户的登录信息
* */
const mongoose = require('mongoose')
const schema = mongoose.Schema({
  username: { type:String },
  email: { type:String },
  password: { type:String },
  radio: {
    type: String,
    default: '用户'
  },
  icon: { String },
  tel: { Number },
},{
  timestamps: true  //时间戳
})
module.exports = mongoose.model('User',schema)