import express from 'express';
import { BlockDecoder } from 'fabric-common';
import * as utils from '../utils/utils.js';

export const router = express.Router();

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


let r = await getTrxDetailById('19017494fdc4ec94d84dc8213c71aefe071bbf95374738cb240e6a1a4662aad9');
console.log(r);



