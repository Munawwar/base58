const base = BigInt(58);
// skip O,0,I and l as they look similar in many fonts
// https://en.wikipedia.org/wiki/Base58
const ALPHABETS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const REVERSE_ALPHABETS = [...ALPHABETS].reduce((acc, char, index) => {
  acc[char] = index;
  return acc;
}, {});

function encode(word) {
  let num = BigInt(`0x${Buffer.from(word).toString('hex')}`);
  
  const encoding = [];
  while (num >= base) {
    encoding.push(num % base);
    num = num / base;
  }
  encoding.push(num);
  encoding.reverse();
  
  const encodedWord = encoding.map(v => ALPHABETS[v]).join('');
  return encodedWord;
}

function decode(encodedWord) {
  const nums = [...encodedWord].map(char => BigInt(REVERSE_ALPHABETS[char])).reverse();

  let num = nums.pop();
  while(nums.length) {
    num = num * base + nums.pop();
  }

  return Buffer.from(num.toString(16), 'hex').toString();
}

module.exports = {
  encode,
  decode,
};

// test
// (() => {
//   // encode
//   const testWord = 'satoshi';
//   const encodedWord = encode(testWord);
//   console.log(testWord, '=>', encodedWord);

//   // decode
//   const decodedWord = decode(encodedWord);
//   console.log(encodedWord, '=>', decodedWord);
// })();
