const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET; // Utilisez la clé secrète depuis les variables d'environnement

const verifyToken = (req, res, next) => {
    // Récupérer le token de l'en-tête Authorization
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(401).json({ message: "Accès refusé, aucun token fourni" });
    }

    // Extraire le token
    const bearerToken = extractBearerToken(bearerHeader);

    if (!bearerToken) {
        return res.status(403).json({ message: "Accès refusé, token invalide ou expiré" });
    }

    // Vérifier le token
    jwt.verify(bearerToken, SECRET, (err, authData) => {
        if (err) {
            // Si le token est invalide ou expiré
            return res.status(403).json({ message: "Accès refusé, token invalide ou expiré" });
        } else {
            // Si le token est valide, stocker les données authentifiées dans req.user
            req.user = authData;
            next(); // Passer au prochain middleware ou à la route
        }
    });

    
};


// Fonction pour extraire le token Bearer
const extractBearerToken = (bearerHeader) => {
    const bearerTokenRegex = /^Bearer\s(.+)$/;
    const matches = bearerHeader.match(bearerTokenRegex);
    if (matches && matches.length === 2) {
        return matches[1];
    }
    return null;
};

module.exports = verifyToken;
