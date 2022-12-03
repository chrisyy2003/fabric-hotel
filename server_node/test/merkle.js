const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const leaves = ['a', 'b', 'c', 'd'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
let root = tree.getRoot().toString('hex')
console.log(`root : ${root}`);
console.log(tree.toString());
const leaf = SHA256('b')
const proof = tree.getHexProof('18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4')
console.log(proof);
console.log(tree.verify(proof, SHA256('d'), root)) // true

async function main() {
    const circomlib = require('circomlibjs');
    const mimc7 = await circomlib.buildMimc7() ;

    console.log(mimc7.multiHash([1,2]));
    
// mimc7

}

main()


//