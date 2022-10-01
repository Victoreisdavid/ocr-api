import Tesseract from "tesseract.js";
import sharp from "sharp";

const scheduler = Tesseract.createScheduler()

/**
 * Cria os workers do tesseract
 */
async function loadWorkers(workers: number): Promise<undefined> {
    for(let i = 0; i < workers; i++) {
        const worker = Tesseract.createWorker()
        await worker.load()
        await worker.loadLanguage("por+eng")
        await worker.initialize("por+eng", Tesseract.OEM.LSTM_ONLY)
        await worker.setParameters({
            user_defined_dpi: "200"
        })
        scheduler.addWorker(worker)
    }
    return undefined
}

/**
 * Faz um OCR na imagem
 * Lembrando que a imagem deve ser um Buffer
 */
async function readText(image: Buffer): Promise<Tesseract.ConfigResult | Tesseract.RecognizeResult | Tesseract.DetectResult> {
    const result = await scheduler.addJob("recognize", image)
    return result
}

/**
 * Prepara a imagem pro tesseract
 */
async function prepareImage(image: Buffer, dimension_scale: number): Promise<Buffer> {
    const data = sharp(image)
    const metadata = await data.metadata()
    const resizedImage = await data.resize(Math.min(metadata.width, 1360), Math.min(metadata.height, 1360)).grayscale().normalise().toBuffer()
    return resizedImage
}

export default {
    scheduler,
    loadWorkers,
    readText,
    prepareImage
}