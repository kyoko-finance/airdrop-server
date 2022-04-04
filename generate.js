const { ethers } = require('ethers');
const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs');
const { format } = require('mathjs');

const dataList = [
    {
        address: '0xA998b62aD18B5a5FcFB615Dd27B8EA9Fa0ac0AA9',
        amount: format(2000 * 1e18, { notation: 'fixed' }),
        index: 1
    },
    {
        address: '0x22Fad004b0cC5DE0B45df49FDFD4aa7b438a5d27',
        amount: format(200 * 1e18, { notation: 'fixed' }),
        index: 1
    },
    {
        address: '0x3D3B6B89b87e1c02C1740850Bda4FB3eE7846279',
        amount: format(200 * 1e18, { notation: 'fixed' }),
        index: 1
    },
    {
        address: '0xA998b62aD18B5a5FcFB615Dd27B8EA9Fa0ac0AA9',
        amount: format(2000 * 1e18, { notation: 'fixed' }),
        index: 2
    },
    {
        address: '0x22Fad004b0cC5DE0B45df49FDFD4aa7b438a5d27',
        amount: format(200 * 1e18, { notation: 'fixed' }),
        index: 2
    },
    {
        address: '0x3D3B6B89b87e1c02C1740850Bda4FB3eE7846279',
        amount: format(200 * 1e18, { notation: 'fixed' }),
        index: 2
    },
    {
        address: '0xA998b62aD18B5a5FcFB615Dd27B8EA9Fa0ac0AA9',
        amount: format(2000 * 1e18, { notation: 'fixed' }),
        index: 3
    },
    {
        address: '0x22Fad004b0cC5DE0B45df49FDFD4aa7b438a5d27',
        amount: format(200 * 1e18, { notation: 'fixed' }),
        index: 3
    },
    {
        address: '0x3D3B6B89b87e1c02C1740850Bda4FB3eE7846279',
        amount: format(200 * 1e18, { notation: 'fixed' }),
        index: 3
    }
];

const leafNodes = dataList.map(node => {
    return ethers.utils.solidityKeccak256(['address', 'uint256', 'uint8'], [node.address, node.amount, node.index])
});

const merkletree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

const root = merkletree.getHexRoot();

console.log("root: ", root);

module.exports = (address, index) => {
    const node = dataList.find(node => {
        return node.address.toLowerCase() === (address || '').toLowerCase() && node.index === +index
    });
    if (!node) return { proof: [], amount: 0 };
    const leaf = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint8'], [node.address, node.amount, node.index]);

    return { proof: merkletree.getHexProof(leaf), amount: node.amount };
}
