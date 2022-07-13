const mongoose = require('mongoose'); /* Mongoose est un package qui facilite les interactions avec la base de données MongoDB. */
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, /* champ email contenant l'objet avec le type, si il est requis et unique */
    password: { type: String, required: true} /* champ password contenant l'objet avec le type et si il est requis*/
}); /* function schema avec les champs email et password */

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema); /* export du model terminé grace à mongoose.model(avec le nom du model, schema du model) */