/*
* 所有关于  定期存款  的相关路由
* */
module.exports = app => {
  const express = require('express')
  const DepositRouter = express.Router()
  const DepositFixed = require('../models/DepositFixed')
  const Account = require('../models/Account')

  // 每提交一次，都是一条记录生成操作明细
  DepositRouter.post('/deposit',async (req,res) => {
    /*根据用户输入的卡号，找到对应 开户表 中对应卡号的所有信息*/
    const number = req.body.number
    const result = await Account.find({number})
    if(result.length === 0){
      return res.send('卡号不存在！')
    }else{
      /*由于增加了存款，所以修改 开户表 中的余额 = 原余额 + 存款金额*/
      const newBalance = parseFloat(result[0].balance) + parseFloat(req.body.money)
      await Account.update({number},{$set:{"balance": newBalance}})
      /*将 卡主、卡号、存款金额、期限、利息、银行类别、余额存入deposit表中*/
      const newModel = await Account.find({number})
      req.body.bankCategory = newModel[0].bankCategory
      req.body.name = newModel[0].name
      req.body.balance = newModel[0].balance
      const model = await DepositFixed.create(req.body)
      /*返回响应数据*/
      res.send(model)
    }
  })



  // 删除指定 id 对应存款记录
  DepositRouter.delete('/deposit/:id',async (req,res) => {
    /*根据ID找到对应存款信息*/
    const ans = await DepositFixed.findById(req.params.id)
    /*获取该条存款信息记录的id号*/
    const userId = await ans._id
    /*将该改用信息记录的del字段设置为true，表示放入回收站*/
    await DepositFixed.updateOne({_id:userId},{$set:{"del": true}})
    // const result = await DepositFixed.findById(userId)
    // console.log(result);
    res.send({
      success: true
    })
  })


  // 获取数据库中所有存款操作的记录
  DepositRouter.get('/deposit',async (req,res) => {
    let modelItems
    if(req.query.radio === '管理员'){
      modelItems = await DepositFixed.find({del: false})
      return res.send(modelItems)
    }else{
      /*获取前台传递过来的当前用户*/
      const name = await req.query.username
      /*根据当前用户找到数据库中所有关于该用户的开户信息*/
      modelItems = await DepositFixed.find({name:name,del:false})
      res.send(modelItems)
    }
  })
  DepositRouter.get('/deposit/pagination/1',async (req,res) => {
    let lists
    if(req.query.radio === '用户'){
      const name = await req.query.username
      lists = await DepositFixed.find({name}).limit(5)
    }else{
      lists = await DepositFixed.find().limit(5)
    }
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/2',async (req,res) => {
    let lists
    if(req.query.radio === '用户'){
      const name = await req.query.username
      lists = await DepositFixed.find({name}).limit(5).skip(5 * 1)
    }else{
      lists = await DepositFixed.find().limit(5).skip(5 * 1)
    }
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/3',async (req,res) => {
    let lists
    if(req.query.radio === '用户'){
      const name = await req.query.username
      lists = await DepositFixed.find({name}).limit(5).skip(5 * 2)
    }else{
      lists = await DepositFixed.find().limit(5).skip(5 * 2)
    }
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/4',async (req,res) => {
    let lists
    if(req.query.radio === '用户'){
      const name = await req.query.username
      lists = await DepositFixed.find({name}).limit(5).skip(5 * 3)
    }else{
      lists = await DepositFixed.find().limit(5).skip(5 * 3)
    }
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/5',async (req,res) => {
    let lists
    if(req.query.radio === '用户'){
      const name = await req.query.username
      lists = await DepositFixed.find({name}).limit(5).skip(5 * 4)
    }else{
      lists = await DepositFixed.find().limit(5).skip(5 * 4)
    }
    res.send(lists)
  })
















  /*查询所有的记录条数*/
  DepositRouter.get('/deposit/pagination',async (req,res) => {
    const lists = await DepositFixed.find()
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/1',async (req,res) => {
    const lists = await DepositFixed.find().limit(5)
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/2',async (req,res) => {
    const lists = await DepositFixed.find().limit(5).skip(5 * 1)
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/3',async (req,res) => {
    const lists = await DepositFixed.find().limit(5).skip(5 * 2)
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/4',async (req,res) => {
    const lists = await DepositFixed.find().limit(5).skip(5 * 3)
    res.send(lists)
  })
  DepositRouter.get('/deposit/pagination/5',async (req,res) => {
    const lists = await DepositFixed.find().limit(5).skip(5 * 4)
    res.send(lists)
  })














  app.use('/bank/admin/api',DepositRouter)
}