


cd  ./test-network/
# 清理文件
sudo ./network.sh down

# 创建通道，启动ca节点, 使用couchdb数据库
./network.sh up createChannel -ca -s couchdb

# 部署合约 参数分别为:  合约名, 版本, 调用初始化函数, 合约路径
./network.sh deployCC -ccn hotel -ccv 1.0 -cci initLedger -ccl javascript -ccp ../../chaincode/

# 修改权限给explore
sudo chmod -R 755 ./organizations

# 启动区块浏览器
cd ../explorer
./start.sh