

const snarkjs = require("snarkjs");
const fs = require("fs");

async function main() {
    await factor();
}


async function factor() {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {a: 10, b: 21}, 
        "factor/factor_js/factor.wasm", 
        "factor/factor_0001.zkey"
    );
    const vKey = JSON.parse(fs.readFileSync("factor/verification_key.json"));
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

async function merkle() {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {a: 10, b: 21}, 
        "factor/factor_js/factor.wasm", 
        "factor/factor_0001.zkey"
    );
    const vKey = JSON.parse(fs.readFileSync("factor/verification_key.json"));
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}


main()