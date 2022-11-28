rm -rf ./organizations
cp -r ../test-network/organizations/ .

mv ./organizations/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp/keystore/* ./organizations/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp/keystore/priv_sk
docker-compose down -v
docker-compose up -d
