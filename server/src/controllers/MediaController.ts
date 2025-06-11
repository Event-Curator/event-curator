import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger.js';
import { getDocumentById } from './CacheController.js';

const getEventAttachment = async function (req: Request, res: Response) {

    const eventId = req.params.eventId;
    const attachmentId = req.params.attachmentId;

    let doc = await getDocumentById(eventId);
    if (!doc) {
        res.status(404);
        res.send("document not found");
        return
    }
    console.log(doc);
    console.log(doc.allAttachments());

    let attachment = doc.getAttachment("TEASERMEDIA");
    if (!attachment) {
        res.status(404);
        res.send("attachment not found");
        return
    }

    let blob = await attachment.getData();
    log.debug(`blob attached: ${blob.type} (${blob.size} bytes)`);
    res.status(200);
    res.set({
        'Content-Type': blob.type
    })
    // console.log(blob);
    res.type(blob.type)
    blob.arrayBuffer().then((buf) => {
        res.send(Buffer.from(buf))
    });
    // res.send(blob.data);
}

export { getEventAttachment }