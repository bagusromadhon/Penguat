import { createClient } from 'redis';

let redis = null;

async function getClient() {
    if (!redis) {
        if (!process.env.REDIS_URL) throw new Error("REDIS_URL not configured");
        redis = createClient({ url: process.env.REDIS_URL });
        redis.on('error', err => console.error('Redis Error:', err));
        await redis.connect();
    }
    return redis;
}

export default async function handler(req, res) {
    try {
        const client = await getClient();
        
        if (req.method === 'POST') {
            const { message } = req.body;
            if (!message || message.trim() === '') return res.status(400).json({ error: 'Message empty' });
            
            // Format time manually to avoid timezone issues on different servers
            const date = new Date();
            const timestamp = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Jakarta',
                dateStyle: 'medium',
                timeStyle: 'short'
            }).format(date);

            const entry = JSON.stringify({ text: message, time: timestamp });
            
            // Push to list and trim to keep only the latest 50 entries
            await client.lPush('depok_curhatan', entry);
            await client.lTrim('depok_curhatan', 0, 49);
            
            return res.status(200).json({ success: true });
        } 
        else if (req.method === 'GET') {
            const messages = await client.lRange('depok_curhatan', 0, 49);
            const parsed = messages.map(m => JSON.parse(m));
            return res.status(200).json(parsed);
        } 
        else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Messages API error:', error);
        return res.status(500).json({ error: 'Failed to process messages', details: error.message });
    }
}
