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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ error: 'Key is required' });

        const client = await getClient();
        const newValue = await client.incrBy(`depok_${key}`, value || 1);
        
        return res.status(200).json({ success: true, [key]: newValue });
    } catch (error) {
        console.error('Redis error:', error);
        return res.status(500).json({ error: 'Failed to update tracking data', details: error.message });
    }
}
