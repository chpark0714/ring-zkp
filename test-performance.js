const { execSync } = require('child_process');
const fs = require('fs');

function measureTime(command, description) {
    //console.log(`\n📝 ${description} 시작...`);
    const start = process.hrtime();
    
    try {
        execSync(command, { stdio: 'inherit' });
        const [seconds, nanoseconds] = process.hrtime(start);
        const milliseconds = (seconds * 1000) + (nanoseconds / 1000000);
        //console.log(`✅ ${description} 완료`);
        //console.log(`⏱️  소요 시간: ${milliseconds.toFixed(2)}ms (${(milliseconds/1000).toFixed(2)}초)`);
        return milliseconds;
    } catch (error) {
        //console.error(`❌ ${description} 실패:`, error.message);
        return -1;
    }
}

const ITERATIONS = 1000;
let jsTimes = [];
let cppTimes = [];

//console.log(`🚀 성능 테스트 시작 (${ITERATIONS}회 반복)\n`);

for (let i = 0; i < ITERATIONS; i++) {
    if (i % 100 === 0) {
        //console.log(`진행률: ${(i/ITERATIONS*100).toFixed(1)}%`);
    }
    
    const jsTime = measureTime('node zkp.js', 'JS');
    if (jsTime > 0) jsTimes.push(jsTime);
    
    const cppTime = measureTime('./ring-sig_cpp/ring-sig', 'C++');
    if (cppTime > 0) cppTimes.push(cppTime);
}

if (jsTimes.length > 0 && cppTimes.length > 0) {
    const jsAvg = jsTimes.reduce((a, b) => a + b) / jsTimes.length;
    const cppAvg = cppTimes.reduce((a, b) => a + b) / cppTimes.length;
    
    // 표준편차 계산
    const jsStdDev = Math.sqrt(jsTimes.reduce((sum, time) => sum + Math.pow(time - jsAvg, 2), 0) / jsTimes.length);
    const cppStdDev = Math.sqrt(cppTimes.reduce((sum, time) => sum + Math.pow(time - cppAvg, 2), 0) / cppTimes.length);
    
    console.log('\n📊 통계 결과');
    console.log('\nJavaScript 결과:');
    console.log(`- 평균: ${jsAvg.toFixed(2)}ms (${(jsAvg/1000).toFixed(2)}초)`);
    console.log(`- 표준편차: ${jsStdDev.toFixed(2)}ms`);
    console.log(`- 최소값: ${Math.min(...jsTimes).toFixed(2)}ms`);
    console.log(`- 최대값: ${Math.max(...jsTimes).toFixed(2)}ms`);
    
    console.log('\nC++ 결과:');
    console.log(`- 평균: ${cppAvg.toFixed(2)}ms (${(cppAvg/1000).toFixed(2)}초)`);
    console.log(`- 표준편차: ${cppStdDev.toFixed(2)}ms`);
    console.log(`- 최소값: ${Math.min(...cppTimes).toFixed(2)}ms`);
    console.log(`- 최대값: ${Math.max(...cppTimes).toFixed(2)}ms`);
} 