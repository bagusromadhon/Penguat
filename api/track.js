import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ error: 'Key is required' });

        // Increment the key by the given value (default 1)
        // Ensure the KV database is connected in Vercel otherwise this will fail gracefully due to the try-catch
        const newValue = await kv.incrby(`depok_${key}`, value || 1);
        
        return res.status(200).json({ success: true, [key]: newValue });
    } catch (error) {
        console.error('KV error:', error);
        // Fail silently so the frontend doesn't break if KV isn't setup yet
        return res.status(500).json({ error: 'Failed to update tracking data', details: error.message });
    }
}
