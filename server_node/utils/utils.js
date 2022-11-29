import { Gateway, Wallets }  from 'fabric-network'
import { fileURLToPath } from 'url'
import {registerUser} from './register.js'
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function getccp() {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'fabric_network','test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    return ccp;
}

export async function getWallet() {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
}


export async function getUserWallet(name) {
    const wallet = await getWallet();
   
    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(name);
    if (!identity) {
        throw `找不到用户 ${name} 的wallet`
    }
    return identity;
}


export async function getGateway(channelName, userName) {
    const ccp = getccp();
    const wallet = await getWallet();
    try {
        const userWallet = await getUserWallet(userName);
    }catch (error) {
        await registerUser(userName)
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
    
    return await gateway.getNetwork(channelName);
}

// let network = await getGateway('mychannel', 'admin');
// let contract = network.getContract('hotel');


