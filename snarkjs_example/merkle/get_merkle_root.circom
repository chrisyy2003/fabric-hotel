pragma circom 2.0.0;

include "../circomlib/circuits/mimc.circom"; //引入 mimc hash算法

template GetMerkleRoot(k){
    // k 是Merkle tree 的深度 

    signal input leaf; // 叶子节点 preimage
    signal input paths2_root[k]; // Merkle path
    signal input paths2_root_pos[k]; // Merkle 路径索引

    signal output out;

    // 对Merkle path中前两个元素进行hash运算
    component merkle_root[k];
    merkle_root[0] = MiMC7(91);
    merkle_root[0].x_in <== paths2_root[0] - paths2_root_pos[0]* (paths2_root[0] - leaf);
    merkle_root[0].k <== leaf - paths2_root_pos[0]* (leaf - paths2_root[0]);

    // 对Merkle path中剩下的元素进行hash运算
    for (var v = 1; v < k; v++){
        merkle_root[v] = MiMC7(91);
        merkle_root[v].x_in <== paths2_root[v] - paths2_root_pos[v]* (paths2_root[v] - merkle_root[v-1].out);
        merkle_root[v].k<== merkle_root[v-1].out - paths2_root_pos[v]* (merkle_root[v-1].out - paths2_root[v]);
        
    }

    // 输出计算完成的Merkle tree root
    out <== merkle_root[k-1].out;

}