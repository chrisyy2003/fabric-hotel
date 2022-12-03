


# compile
circom range.circom --r1cs --wasm --sym 

# compute the witness
node range_js/generate_witness.js range_js/range.wasm input.json witness.wtns

# zk 
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v -e="some textttt"

snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

# setup
snarkjs groth16 setup range.r1cs pot12_final.ptau range_0000.zkey

snarkjs zkey contribute range_0000.zkey range_0001.zkey --name="1st Contributor Name" -v -e="tttt"

snarkjs zkey export verificationkey range_0001.zkey verification_key.json

# gen proof
snarkjs groth16 prove range_0001.zkey witness.wtns proof.json public.json

# verify
snarkjs groth16 verify verification_key.json public.json proof.json

