const fabric = require('../fabric_sdk_node/gateway')
const { BlockDecoder } = require('fabric-common');
const { json } = require('express');
const utils = require('../utils/utils');

const router = express.Router();

router.get('/getAllorder', async (req, res, next) => {
    try {
        const network = await fabric.gateway('mychannel')
        const contract = network.getContract('hotel');
 
        let result = await contract.evaluateTransaction('getAllorder');
        res.send(JSON.parse(result))
    } catch (err) {
        next(err)
    }
})

router.get('/orderList', async (req, res, next) => {
    const user = req.user.user

    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('hotel');

    let orderlist = await contract.evaluateTransaction('getAllorder')

    // get house info 
    let userlist = []

    let p = []
    let rlist = JSON.parse(orderlist.toString())

    let created = 0 // 待付款
    let paid = 0 // 带入住
    let evaluate = 0 // 待评价


    for await (let el of rlist){
        let order = el.value
        if (order.user === user) {
            if (order.status == '待付款'){
                created += 1
            }else if(order.status == '已支付'){
                evaluate += 1
                paid += 1
            }else if(order.status == '已评论'){

            }
            console.log(order.status)
            const backaddr = 'http://127.0.0.1:8000/addons/booking/house/detail?id=' + order.houseid
            let house = await axios.get(backaddr)
            order.house = house.data.data
            userlist.push(order)

        }
    }
    res.json({
        code: 200,
        data: userlist,
        created,
        paid,
        evaluate
        
    })
})

router.get('/payOrder', async (req, res, next) => {
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('hotel');

    const orderid = req.query.id
    const type = req.query.type
    const user = req.user.user

    console.log(orderid, type, user)
    // async payOrder(ctx, orderno, type, user){
    await contract.submitTransaction('payOrder', orderid, type, user)

    res.json({
        code: 200
    })
})

router.get('/addOrder', async (req, res, next) => {
    try {

        const network = await fabric.gateway('mychannel')
        const contract = network.getContract('hotel');

        const params = req.query
        const user = req.user.user

        console.log(req.query);

        // exports.addOrder = async function(ctx, houseid, user, price, arg)
        let orderno = await contract.submitTransaction('addOrder', params.id, user, params.price, '{}')

        res.json({
            code: 200,
            data: orderno.toString()
        })


    } catch (err) {
        next(err)
    }
})

router.get('/getOrder', async (req, res, next) => {
    try {
        const id = req.query.id
        if (!id) {
            res.status(400).send('empty!')
            return
        }
        const network = await fabric.gateway('mychannel')
        const contract = network.getContract('hotel');

        result = await contract.evaluateTransaction('getOrder', id);
        const trx = JSON.parse(result.toString()).value.trx

        //   console.log(trx)
        res.send((await getTrxDetailById(trx)))
    } catch (err) {
        next(err)
    }
})

router.get('/addComment', async (req, res, next) => {
    
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('hotel');

    const grade = req.query.grade
    const comment = req.query.comment
    const id = req.query.orderid

    // async addComment(ctx, orderno, grade, comment)
    let r = await contract.submitTransaction('addComment', id, grade, comment);

    res.json({
        code : 200,
        msg: r.toString(),
    })
    console.log(r.toString());
    

})

router.get('/getAllComment', async (req, res, next) => {
    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('hotel');
    let result = await contract.evaluateTransaction('getAllComment');

    let comments = []
    JSON.parse(result.toString()).forEach(element => {
        comments.push(element.value)
    })
    
    res.json({
        code: 200,
        msg: '',
        data: comments
    })
})

router.get('/detail', async (req, res, next) => {
    let id = req.query.id

    const network = await fabric.gateway('mychannel')
    const contract = network.getContract('hotel');

    let result = await contract.evaluateTransaction('getOrder', id);
    const order = JSON.parse(result.toString()).value

    const backaddr = 'http://127.0.0.1:8000/addons/booking/house/detail?id=' + order.houseid



    axios.get(backaddr).then((r) => {

        order.house = r.data.data
        

        res.json({
            code: 200,
            data: order
        })

    })
    
})



