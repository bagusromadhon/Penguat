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
        const client = await getClient();
        // Menghapus semua data (keys) di database saat ini
        await client.flushDb();
        
        return res.status(200).json({ success: true, message: 'Database reset successfully' });
    } catch (error) {
        console.error('Redis reset error:', error);
        return res.status(500).json({ error: 'Failed to reset database', details: error.message });
    }
}
