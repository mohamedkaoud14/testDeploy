const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    label: {
        type: String,
        maxLength: [20,'you can not enter category more than 20 one char'],
        unique: [true,'category must be unique'],
        trim: true,
        lowercase: true,
        required: [true,'category label is required']
    }
});



const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;