import {
    S3Client,
    PutObjectCommand,
    DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import mime from "mime";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET_NAME;
const cloudfrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;

if (!region || !bucket) {
    throw new Error("AWS S3 configuration is missing");
}

const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const extractS3Key = (url: string): string | null => {
    try {
        // URL 형식인 경우
        if (url.startsWith("http://") || url.startsWith("https://")) {
            const pathname = new URL(url).pathname;
            let key = pathname.startsWith("/") ? pathname.slice(1) : pathname;

            if (!key.includes("/") && fileNameIsImage(key)) {
                key = `uploads/${key}`;
            }

            return key;
        }
        
        // 파일명만 있는 경우
        let key = url.trim();
        if (!key.includes("/") && fileNameIsImage(key)) {
            key = `uploads/${key}`;
        }

        return key;
    } catch (e) {
        // URL 파싱 실패 시 파일명으로 처리
        let key = url.trim();
        if (!key.includes("/") && fileNameIsImage(key)) {
            key = `uploads/${key}`;
        }
        return key;
    }
};

const fileNameIsImage = (name: string): boolean => 
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(name);

export async function uploadToS3(
    fileBuffer: Buffer,
    fileName: string,
    contentType?: string
): Promise<string> {
    if (!fileBuffer) throw new Error("fileBuffer is required");
    if (!fileName) throw new Error("fileName is required");

    const params = {
        Bucket: bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType:
            contentType || mime.getType(fileName) || "application/octet-stream",
    };

    await s3.send(new PutObjectCommand(params));

    return cloudfrontDomain
        ? `https://${cloudfrontDomain}/${fileName}`
        : `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
}

export async function deleteFromS3(imageUrls: string[] = []): Promise<void> {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

    const objects = imageUrls
        .map(extractS3Key)
        .filter((key): key is string => key !== null)
        .map(key => ({ Key: key }));

    const params = {
        Bucket: bucket,
        Delete: { Objects: objects },
    };

    try {
        await s3.send(new DeleteObjectsCommand(params));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error("S3 이미지 삭제 실패: " + errorMessage);
    }
}


