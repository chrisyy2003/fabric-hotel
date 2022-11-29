pragma circom 2.0.0;

template Mult() {
    signal input a;
    signal input b;
    signal output c;
    c <== a * b;
 }


component main = Mult();

