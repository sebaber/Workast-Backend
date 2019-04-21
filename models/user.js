const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('q').Promise;

const validators = require('validator');

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        avatar: { 
            type: String, 
            required: false,
            validate: {
                validator: avatar => validators.isURL(avatar),
                message: '{VALUE} is not a valid avatar'
            }
        }
    }
);

module.exports = mongoose.model('user', UserSchema);