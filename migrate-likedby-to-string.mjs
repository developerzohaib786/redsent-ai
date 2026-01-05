import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function migrateLikedByToString() {
  await mongoose.connect(MONGODB_URI);

  const products = await Product.find({ likedBy: { $exists: true, $not: { $size: 0 } } });

  for (const product of products) {
    if (Array.isArray(product.likedBy)) {
      const newLikedBy = product.likedBy.map(id => id.toString());
      product.likedBy = newLikedBy;
      await product.save();
      console.log(`Migrated product ${product._id}`);
    }
  }

  await mongoose.disconnect();
  console.log('Migration complete!');
}

migrateLikedByToString().catch(console.error);
