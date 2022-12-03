

const snarkjs = require("snarkjs");
const fs = require("fs");

async function main() {
    await factor();
    await range();
}


async function factor() {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {a: 2, b: 3}, 
        "factor/factor_js/factor.wasm", 
        "factor/factor_0001.zkey"
    );

    console.log(publicSignals)
    const vKey = JSON.parse(fs.readFileSync("factor/verification_key.json"));
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("factor verification OK");
    } else {
        console.log("Invalid proof");
    }
}

async function range() {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {"age": 18}, 
        "range/range_js/range.wasm", 
        "range/range_0001.zkey"
    );
    const vKey = JSON.parse(fs.readFileSync("range/verification_key.json"));
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("range verification OK");
    } else {
        console.log("Invalid proof");
    }
}


main().then(() => {
    process.exit(0);
})