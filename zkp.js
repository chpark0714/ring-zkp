const snarkjs = require("snarkjs");
const fs = require("fs");

async function run() {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {
            pks: ["10", "20", "30"],
            c: ["5", "21", "52"],
            s: ["6", "11", "20"],
            q: ["0", "0", "1"]
        },
        "ring-sig_js/ring-sig.wasm",
        "ring-sig_js/ring-sig_0001.zkey"
    );

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("ring-sig_js/verification_key.json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

run().then(() => {
    process.exit(0);
});