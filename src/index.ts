import fastify from "fastify";
import multipart from "@fastify/multipart";
import config from "../config.json";
import ocr from "./ocr";
import { fileTypeFromBuffer } from "file-type";

const app = fastify()

app.register(multipart, {
    limits: {
        fileSize: 26214400,
        fields: 0,
        files: 4
    }
})

app.post("/", async (req, res) => {
    const files = req.files()
    const results = []
    const promises = []
    const filenames = []
    for await (const file of files) {
        let buffer = await file.toBuffer()
        const mime: { mime: string } = await fileTypeFromBuffer(buffer)
        if(!mime || !config.validMimes.includes(mime.mime)) {
            return res.status(400).type("application/json").send({
                error: `Invalid mime type for ${file.filename}: ${mime?.mime || "unknown"}`
            })
            break;
        }
        filenames.push(file.filename)
        buffer = await ocr.prepareImage(buffer, 0.8)
        const data = ocr.readText(buffer)
        promises.push(data)
    }
    const resolvePromises = await Promise.all(promises)
    let index = 0;
    for (const result of resolvePromises) {
        results.push({
            filename: filenames[index],
            text: result.data.text
        })
        index += 1
    }
    return res.status(200).type("application/json").send({
        results
    })
})

console.log("Iniciando...")
ocr.loadWorkers(config.ocr_workers).then(() => {
    app.listen({
        host: "0.0.0.0",
        port: process.env.PORT ? Number(process.env.PORT) : 3030
    }, (err, addres) => {
        if(!err) {
            console.log("Servidor iniciado")
        }
    })
})