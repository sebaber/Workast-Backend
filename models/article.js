const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('q').Promise;

const validators = require('validator');

const ArticleSchema = new Schema(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
        tags: [{ type: String, uppercase: true, required: true }],
        userId : {
        	type: Schema.Types.ObjectId,
        	ref: "user",
        	required: true
        }
    }
);

module.exports = mongoose.model('article', ArticleSchema);