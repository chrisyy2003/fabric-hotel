import express from 'express';
export const router = express.Router();


router.get('/about', (req, res) => {
    res.send('维基主页');
});

router.get('/totalSupply', (req, res) => {
    res.send('维基主页');
});

router.get('/balanceOf', (req, res) => {
    res.send('维基主页');
});

router.get('/tokenlist', (req, res) => {
    res.send('关于此维基');
});

router.get('/transfer', (req, res) => {
    res.send('关于此维基');
});

router.get('/mint', (req, res) => {
    res.send('维基主页');
});

