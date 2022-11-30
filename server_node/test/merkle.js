const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const leaves = ['a', 'b', 'c'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
let root = tree.getRoot().toString('hex')
// console.log(`root : ${root}`);
// tree.addLeaf('d', true)
// console.log(tree.getRoot().toString('hex'));
console.log(tree.toString());
const leaf = SHA256('a')
console.log((leaf));
const proof = tree.getProof(leaf)
console.log(tree.verify(proof, leaf, root)) // true


//