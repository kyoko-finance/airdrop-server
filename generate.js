const { ethers } = require('ethers');
const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs');

const dataList = require('./data.json');

const leafNodes = dataList.map(node => {
    return ethers.utils.solidityKeccak256(['address', 'uint256', 'uint8'], [node.address, node.amount, node.index])
});

const merkletree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

module.exports = (address, index) => {
    const node = dataList.find(node => {
        return node.address.toLowerCase() === (address || '').toLowerCase() && node.index === +index
    });
    if (!node) return { proof: [], amount: 0 };
    const leaf = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint8'], [node.address, node.amount, node.index]);

    return { proof: merkletree.getHexProof(leaf), amount: node.amount };
}
