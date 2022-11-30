const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');


function getccp () {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'fabric_network','test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    return ccp;
}

async function getWallet () {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
}


async function getUserWallet (name) {
    const wallet = await getWallet();
    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(name);
    if (!identity) {
        throw `找不到用户 ${name} 的wallet`
    }
    return identity;
}


async function getGateway(channelName, userName) {
    const ccp = getccp();
    const wallet = await getWallet();
    try {
        const userWallet = await getUserWallet(userName);
    }catch (error) {
        await registerUser(userName);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
    
    return await gateway.getNetwork(channelName);
}

async function enrollAdmin () {
    try {
        // load the network configuration
        const ccp = getccp()
        
        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return identity;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}



async function registerUser(userName) {
    const ccp = common.getccp();

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Check to see if we've already enrolled the user.
    const wallet =  await utils.getWallet();
    const userIdentity = await wallet.get(userName);
    if (userIdentity) {
        console.log(`An identity for the user ${userName} already exists in the wallet`);
        // 如果已经注册了就直接返回用户证书
        return userIdentity;
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        await enrollAdmin();

    }

    // build a user object for authenticating with the CA
    const provider =  wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({
        affiliation: 'org1.department1',
        enrollmentID: userName,
        role: 'client'
    }, adminUser);

    const enrollment = await ca.enroll({
        enrollmentID: userName,
        enrollmentSecret: secret
    });

    // 生成证书
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };
    await wallet.put(userName, x509Identity);
    console.log(`Successfully registered and enrolled admin user ${userName} and imported it into the wallet`);
}


module.exports = {
    getccp,
    getWallet,
    getWallet,
    getGateway,
}

