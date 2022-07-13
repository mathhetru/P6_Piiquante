const jwt = require('jsonwebtoken'); /* package permettant de créer et vérifier les tokens d'authentification */

module.exports = (req, res, next) => { /* on exporte une function qui sera le middleware */
    try {
        const token = req.headers.authorization.split(' ')[1]; /* on sépare avec un espace le token du headers authorization, du bearer. Et on récupère le token qui est en 2eme */
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); /* on vérifie que le token de l'utilisateur est bien le même que la clé (avec la méthode verify) */
        const userId = decodedToken.userId; /* on récupère le user id du token décodé */
        req.auth = { 
            userId: userId
        };  /* on le rajoute à l'objet request afin que les routes puissent l'exploiter */
        next();
        } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};