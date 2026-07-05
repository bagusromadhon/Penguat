import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const keys = [
            'hero_clicks', 
            'bubble_overthinking', 
            'bubble_kerjaan', 
            'bubble_tanggungjawab', 
            'rage_clicks',
            'trash_usage',
            'scanner_usage',
            'confetti_clicks'
        ];
        const stats = {};
        
        for (const key of keys) {
            const val = await kv.get(`depok_${key}`);
            stats[key] = val || 0;
        }

        return res.status(200).json(stats);
    } catch (error) {
        console.error('KV error:', error);
        // Fallback to zeros if KV is not configured yet
        return res.status(200).json({
            hero_clicks: 0,
            bubble_overthinking: 0,
            bubble_kerjaan: 0,
            bubble_tanggungjawab: 0,
            rage_clicks: 0,
            trash_usage: 0,
            scanner_usage: 0,
            confetti_clicks: 0,
            _error: 'Vercel KV not configured yet.'
        });
    }
}
