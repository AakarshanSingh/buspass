import { Types } from 'mongoose';
import Pass from '../models/Pass.js';

export const checkPass = async (req, res) => {
  try {
    const { busId } = req.body;

    const bus_id = Types.ObjectId.createFromHexString(busId.text);

    const pass = await Pass.findOne({ _id: bus_id });

    if (!pass) {
      return res.status(404).json({ err: 'No pass found' });
    }

    res.json({ msg: 'Pass is valid' });
  } catch (error) {
    if (error.message === 'hex string must be 24 characters') {
      return res.status(401).json({ error: 'Invalid ID' });
    }
    res.status(500).json({ error: error.message });
  }
};
