const { BlockDecoder } = require('fabric-common');
const utils = require('../utils/fabric_utils');


async function getTrxDetailById(id) {
    const channel_id = 'mychannel';
    const network = await utils.getGateway(channel_id, 'admin');
    const contract = network.getContract('qscc');

    let resultByte = await contract.evaluateTransaction('GetTransactionByID', channel_id, id);
    const unSerialization = BlockDecoder.decodeTransaction(resultByte).transactionEnvelope.payload

    const header = unSerialization.header.channel_header;
    const mspid = unSerialization.header.signature_header.creator.mspid;

    const writeset = unSerialization.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[0]
    const writekey = writeset.key
    const writedata = writeset.value.toString()
    const ccname = unSerialization.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name

    return {
        writekey: writekey,
        timestamp: header.timestamp,
        channel_id: header.channel_id,
        trx: header.tx_id,
        ccname: ccname,
        mspid: mspid,
        data: writedata
    }
}

// async function main() {
//     console.log(await getTrxDetailById('2fd5b60742d59d74937f33f53556864d09637fecb0c4bc73cfec681c4befae72'));
// }
// main()




