const { execSync } = require('child_process');
const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

// 경로 설정
const JS_DIR = path.join(__dirname, 'ring-sig_js');
const CPP_DIR = path.join(__dirname, 'ring-sig_cpp');

async function measurePhase(phase, useJS = true) {
    const start = process.hrtime();
    try {
        switch(phase) {
            case 'witness':
                if (useJS) {
                    console.log("Generating witness using JS...");
                    process.chdir(JS_DIR);  // JS 디렉토리로 이동
                    execSync('node generate_witness.js', { stdio: 'pipe' });
                } else {
                    console.log("Generating witness using C++...");
                    process.chdir(CPP_DIR);  // C++ 디렉토리로 이동
                    execSync('./ring-sig', { stdio: 'pipe' });
                }
                break;
            case 'proof':
                const witnessPath = useJS ? 
                    path.join(JS_DIR, 'witness.wtns') : 
                    path.join(CPP_DIR, 'witness.wtns');
                const zkeyPath = useJS ? 
                    path.join(JS_DIR, 'ring-sig_0001.zkey') : 
                    path.join(CPP_DIR, 'ring-sig_0001.zkey');
                
                if (!fs.existsSync(witnessPath)) {
                    throw new Error(`Witness file not found at ${witnessPath}`);
                }
                
                const { proof, publicSignals } = await snarkjs.groth16.prove(zkeyPath, witnessPath);
                const proofPath = useJS ? 
                    path.join(JS_DIR, 'proof.json') : 
                    path.join(CPP_DIR, 'proof.json');
                    
                fs.writeFileSync(proofPath, JSON.stringify({ proof, publicSignals }, null, 1));
                break;
            case 'verification':
                const vKeyPath = useJS ? 
                    path.join(JS_DIR, 'verification_key.json') : 
                    path.join(CPP_DIR, 'verification_key.json');
                const currentProofPath = useJS ? 
                    path.join(JS_DIR, 'proof.json') : 
                    path.join(CPP_DIR, 'proof.json');
                
                const proofData = JSON.parse(fs.readFileSync(currentProofPath));
                const vKey = JSON.parse(fs.readFileSync(vKeyPath));
                await snarkjs.groth16.verify(vKey, proofData.publicSignals, proofData.proof);
                break;
        }
        // 테스트 후 원래 디렉토리로 복귀
        process.chdir(__dirname);
        
        const [seconds, nanoseconds] = process.hrtime(start);
        return (seconds * 1000) + (nanoseconds / 1000000);
    } catch (error) {
        console.error(`❌ ${phase} (${useJS ? 'JS' : 'C++'}) 실패:`, error.message);
        // 테스트 실패 시에도 원래 디렉토리로 복귀
        process.chdir(__dirname);
        return -1;
    }
}

async function measureTotalTime(useJS = true) {
    const start = process.hrtime();
    try {
        const implementation = useJS ? 'JavaScript' : 'C++';
        console.log(`\nRunning complete ${implementation} process...`);
        
        if (useJS) {
            process.chdir(JS_DIR);
            // zkp.js 대신 generate_witness.js 사용
            execSync('node generate_witness.js', { stdio: 'pipe' });
        } else {
            process.chdir(CPP_DIR);
            execSync('./ring-sig', { stdio: 'pipe' });
        }
        
        // 원래 디렉토리로 복귀
        process.chdir(__dirname);
        
        const [seconds, nanoseconds] = process.hrtime(start);
        return (seconds * 1000) + (nanoseconds / 1000000);
    } catch (error) {
        console.error(`❌ Total process (${useJS ? 'JS' : 'C++'}) failed:`, error.message);
        // 에러 발생 시에도 원래 디렉토리로 복귀
        process.chdir(__dirname);
        return -1;
    }
}

const ITERATIONS = 100;
const results = {
    'witness-js': [],
    'witness-cpp': [],
    'proof-js': [],
    'proof-cpp': [],
    'verification-js': [],
    'verification-cpp': []
};

async function runFullTest(useJS) {
    const prefix = useJS ? 'js' : 'cpp';
    const implementation = useJS ? 'JavaScript' : 'C++';
    
    try {
        // 1. Witness 생성
        console.log(`\nGenerating witness using ${implementation}...`);
        const witnessTime = await measurePhase('witness', useJS);
        if (witnessTime <= 0) {
            throw new Error(`${implementation} witness 생성 실패`);
        }
        results[`witness-${prefix}`].push(witnessTime);

        // 2. Proof 생성
        console.log(`Generating proof using ${implementation}...`);
        const proofTime = await measurePhase('proof', useJS);
        if (proofTime <= 0) {
            throw new Error(`${implementation} proof 생성 실패`);
        }
        results[`proof-${prefix}`].push(proofTime);

        // 3. Verification
        console.log(`Verifying proof using ${implementation}...`);
        const verificationTime = await measurePhase('verification', useJS);
        if (verificationTime > 0) {
            results[`verification-${prefix}`].push(verificationTime);
        }

        console.log(`✅ ${implementation} 테스트 완료`);
        
    } catch (error) {
        console.error(`❌ ${implementation} 테스트 실패:`, error.message);
        // 실패 시 현재 테스트 iteration을 중단하고 다음으로 넘어감
    }
}

async function runTest() {
    console.log(`🚀 성능 테스트 시작 (${ITERATIONS}회 반복)\n`);
    let successCount = 0;

    for (let i = 0; i < ITERATIONS; i++) {
        console.log(`\n📍 테스트 #${i + 1}`);
        
        try {
            await runFullTest(true);   // JS 테스트
            await runFullTest(false);  // C++ 테스트
            successCount++;
        } catch (error) {
            console.error(`테스트 #${i + 1} 실패:`, error.message);
        }
    }

    console.log(`\n완료된 테스트: ${successCount}/${ITERATIONS}`);

    // 결과 출력
    console.log('\n📊 단계별 성능 통계\n');

    // 각 단계별 통계 및 비교 계산
    const phases = ['witness', 'proof', 'verification'];
    const stats = {};

    for (const phase of phases) {
        const jsData = results[`${phase}-js`];
        const cppData = results[`${phase}-cpp`];

        if (jsData.length > 0) {
            const jsAvg = jsData.reduce((a, b) => a + b) / jsData.length;
            const jsStdDev = Math.sqrt(jsData.reduce((sum, time) => 
                sum + Math.pow(time - jsAvg, 2), 0) / jsData.length);

            console.log(`\n🔹 ${phase.toUpperCase()} - JavaScript:`);
            console.log(`- 평균: ${jsAvg.toFixed(2)}ms (${(jsAvg/1000).toFixed(2)}초)`);
            console.log(`- 표준편차: ${jsStdDev.toFixed(2)}ms`);
            console.log(`- 최소값: ${Math.min(...jsData).toFixed(2)}ms`);
            console.log(`- 최대값: ${Math.max(...jsData).toFixed(2)}ms`);
            console.log(`- 성공한 테스트 수: ${jsData.length}`);

            stats[`${phase}-js`] = jsAvg;
        }

        if (cppData.length > 0) {
            const cppAvg = cppData.reduce((a, b) => a + b) / cppData.length;
            const cppStdDev = Math.sqrt(cppData.reduce((sum, time) => 
                sum + Math.pow(time - cppAvg, 2), 0) / cppData.length);

            console.log(`\n🔸 ${phase.toUpperCase()} - C++:`);
            console.log(`- 평균: ${cppAvg.toFixed(2)}ms (${(cppAvg/1000).toFixed(2)}초)`);
            console.log(`- 표준편차: ${cppStdDev.toFixed(2)}ms`);
            console.log(`- 최소값: ${Math.min(...cppData).toFixed(2)}ms`);
            console.log(`- 최대값: ${Math.max(...cppData).toFixed(2)}ms`);
            console.log(`- 성공한 테스트 수: ${cppData.length}`);

            stats[`${phase}-cpp`] = cppAvg;
        }
    }

    // 각 단계별 성능 비교
    console.log('\n📈 단계별 성능 비교');
    for (const phase of phases) {
        const jsAvg = stats[`${phase}-js`];
        const cppAvg = stats[`${phase}-cpp`];
        
        if (jsAvg && cppAvg) {
            const ratio = jsAvg / cppAvg;
            const faster = cppAvg < jsAvg ? 'C++' : 'JavaScript';
            const slowerRatio = faster === 'C++' ? ratio : 1/ratio;
            
            console.log(`\n${phase.toUpperCase()}:`);
            console.log(`- JavaScript: ${jsAvg.toFixed(2)}ms`);
            console.log(`- C++: ${cppAvg.toFixed(2)}ms`);
            console.log(`- ${faster}가 ${slowerRatio.toFixed(2)}배 더 빠름`);
        }
    }

    // 전체 프로세스 비교
    const jsTotal = phases.reduce((sum, phase) => sum + (stats[`${phase}-js`] || 0), 0);
    const cppTotal = phases.reduce((sum, phase) => sum + (stats[`${phase}-cpp`] || 0), 0);

    console.log('\n📊 전체 프로세스 비교');
    console.log(`- JavaScript 전체: ${jsTotal.toFixed(2)}ms (${(jsTotal/1000).toFixed(2)}초)`);
    console.log(`- C++ 전체: ${cppTotal.toFixed(2)}ms (${(cppTotal/1000).toFixed(2)}초)`);
    
    const totalRatio = jsTotal / cppTotal;
    const fasterTotal = cppTotal < jsTotal ? 'C++' : 'JavaScript';
    const slowerRatioTotal = fasterTotal === 'C++' ? totalRatio : 1/totalRatio;
    
    console.log(`- ${fasterTotal}가 전체적으로 ${slowerRatioTotal.toFixed(2)}배 더 빠름`);

    // 전체 프로세스 시간 측정 추가
    console.log('\n📊 전체 프로세스 시간 측정 (별도 실행)');
    const jsTotalTimes = [];
    const cppTotalTimes = [];

    for (let i = 0; i < ITERATIONS; i++) {
        const jsTime = await measureTotalTime(true);
        if (jsTime > 0) jsTotalTimes.push(jsTime);
        
        const cppTime = await measureTotalTime(false);
        if (cppTime > 0) cppTotalTimes.push(cppTime);
    }

    // 전체 프로세스 통계 출력
    if (jsTotalTimes.length > 0) {
        const jsAvg = jsTotalTimes.reduce((a, b) => a + b) / jsTotalTimes.length;
        const jsStdDev = Math.sqrt(jsTotalTimes.reduce((sum, time) => 
            sum + Math.pow(time - jsAvg, 2), 0) / jsTotalTimes.length);
            
        console.log('\nJavaScript 전체 프로세스:');
        console.log(`- 평균: ${jsAvg.toFixed(2)}ms (${(jsAvg/1000).toFixed(2)}초)`);
        console.log(`- 표준편차: ${jsStdDev.toFixed(2)}ms`);
        console.log(`- 최소값: ${Math.min(...jsTotalTimes).toFixed(2)}ms`);
        console.log(`- 최대값: ${Math.max(...jsTotalTimes).toFixed(2)}ms`);
    }

    if (cppTotalTimes.length > 0) {
        const cppAvg = cppTotalTimes.reduce((a, b) => a + b) / cppTotalTimes.length;
        const cppStdDev = Math.sqrt(cppTotalTimes.reduce((sum, time) => 
            sum + Math.pow(time - cppAvg, 2), 0) / cppTotalTimes.length);
            
        console.log('\nC++ 전체 프로세스:');
        console.log(`- 평균: ${cppAvg.toFixed(2)}ms (${(cppAvg/1000).toFixed(2)}초)`);
        console.log(`- 표준편차: ${cppStdDev.toFixed(2)}ms`);
        console.log(`- 최소값: ${Math.min(...cppTotalTimes).toFixed(2)}ms`);
        console.log(`- 최대값: ${Math.max(...cppTotalTimes).toFixed(2)}ms`);
    }
}

runTest().catch(error => {
    console.error('테스트 실행 중 오류 발생:', error);
    process.exit(1);
}); 