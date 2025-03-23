import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  contact:{type:String, required : true ,}
});

export default mongoose.models.School || mongoose.model('School', schoolSchema);