


pragma circom 2.0.0;


include "../node_modules/circomlib/circuits/comparators.circom";


template range() {
    signal input age;
    component cmp = LessThan(5); 
    cmp.in[0] <== age;
    cmp.in[1] <== 18;

    signal output out; 
    // 0 is age >= 18;
    // 1 is age < 18;
    0 === cmp.out;
}

component main = range();
