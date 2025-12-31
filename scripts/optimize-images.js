/**
 * 이미지 최적화 스크립트
 * JPG/PNG 이미지를 WebP와 AVIF로 변환합니다.
 * 
 * 사용법: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// 변환할 이미지 파일 찾기
function findImageFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...findImageFiles(fullPath));
        } else {
            const ext = path.extname(item).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                files.push(fullPath);
            }
        }
    }

    return files;
}

// 이미지 최적화 함수
async function optimizeImage(inputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    const baseName = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);

    console.log(`\n처리 중: ${path.basename(inputPath)}`);

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // WebP 변환
        const webpPath = path.join(dir, `${baseName}.webp`);
        await image
            .webp({ 
                quality: 85,
                effort: 6 
            })
            .toFile(webpPath);
        
        const webpStats = fs.statSync(webpPath);
        const originalStats = fs.statSync(inputPath);
        const webpReduction = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
        
        console.log(`  ✓ WebP 생성: ${(webpStats.size / 1024).toFixed(2)} KB (${webpReduction}% 감소)`);

        // AVIF 변환 (더 나은 압축률)
        const avifPath = path.join(dir, `${baseName}.avif`);
        await image
            .avif({ 
                quality: 75,
                effort: 4 
            })
            .toFile(avifPath);
        
        const avifStats = fs.statSync(avifPath);
        const avifReduction = ((1 - avifStats.size / originalStats.size) * 100).toFixed(1);
        
        console.log(`  ✓ AVIF 생성: ${(avifStats.size / 1024).toFixed(2)} KB (${avifReduction}% 감소)`);

        return {
            original: originalStats.size,
            webp: webpStats.size,
            avif: avifStats.size,
        };
    } catch (error) {
        console.error(`  ✗ 오류: ${error.message}`);
        return null;
    }
}

// 메인 실행 함수
async function main() {
    console.log('🖼️  이미지 최적화 시작...\n');
    console.log(`대상 디렉토리: ${PUBLIC_DIR}\n`);

    if (!fs.existsSync(PUBLIC_DIR)) {
        console.error(`오류: ${PUBLIC_DIR} 디렉토리를 찾을 수 없습니다.`);
        process.exit(1);
    }

    const imageFiles = findImageFiles(PUBLIC_DIR);

    if (imageFiles.length === 0) {
        console.log('변환할 이미지 파일을 찾을 수 없습니다.');
        return;
    }

    console.log(`발견된 이미지: ${imageFiles.length}개\n`);

    const results = [];
    for (const file of imageFiles) {
        const result = await optimizeImage(file);
        if (result) {
            results.push(result);
        }
    }

    // 결과 요약
    if (results.length > 0) {
        const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
        const totalWebp = results.reduce((sum, r) => sum + r.webp, 0);
        const totalAvif = results.reduce((sum, r) => sum + r.avif, 0);

        console.log('\n' + '='.repeat(50));
        console.log('📊 최적화 결과 요약');
        console.log('='.repeat(50));
        console.log(`원본 총 크기: ${(totalOriginal / 1024).toFixed(2)} KB`);
        console.log(`WebP 총 크기: ${(totalWebp / 1024).toFixed(2)} KB (${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}% 감소)`);
        console.log(`AVIF 총 크기: ${(totalAvif / 1024).toFixed(2)} KB (${((1 - totalAvif / totalOriginal) * 100).toFixed(1)}% 감소)`);
        console.log('='.repeat(50));
        console.log('\n✅ 최적화 완료!');
        console.log('\n💡 Next.js Image 컴포넌트가 자동으로 최적 포맷을 선택합니다.');
        console.log('   - AVIF를 지원하는 브라우저: AVIF 사용');
        console.log('   - WebP를 지원하는 브라우저: WebP 사용');
        console.log('   - 그 외: 원본 포맷 사용');
    }
}

// 스크립트 실행
main().catch(error => {
    console.error('오류 발생:', error);
    process.exit(1);
});

