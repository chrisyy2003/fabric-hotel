
import { Wallets }  from 'fabric-network'
import FabricCAServices from 'fabric-ca-client';
import * as utils from './utils.js';
import path from 'path';


export async function enrollAdmin() {
    try {
        // load the network configuration
        const ccp = utils.getccp()
        
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



export async function registerUser(userName) {
    const ccp = utils.getccp();

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
