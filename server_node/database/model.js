import { sequelize } from "./db.js";
import { DataTypes } from 'sequelize';


sequelize.define('Room', {
    // 房间id
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    // 房间名
    name: { type: DataTypes.STRING, allowNull: false},
    // 现价
    current_price: { type: DataTypes.STRING, allowNull: false},
    // 原价
    original_price: { type: DataTypes.STRING, allowNull: false},
    // 居住人数
    livenums: { type: DataTypes.INTEGER, allowNull: false},
    // 图片地址
    image: { type: DataTypes.STRING, allowNull: false},
    // 标签
    tag: { type: DataTypes.STRING, allowNull: false},
    // 描述
    describe: { type: DataTypes.STRING, allowNull: false},
    // 状态: 是否入住
    status: { type: DataTypes.BOOLEAN, allowNull: false},
    
}, {});


sequelize.define('Comments', {
    // 订单id
    orderid: { type: DataTypes.STRING, allowNull: false, primaryKey: true},
    // 评论内容
    comment: { type: DataTypes.STRING, allowNull: false},
    // 评价等级
    garde: { type: DataTypes.INTEGER, allowNull: false},
    // 
    
}, {});