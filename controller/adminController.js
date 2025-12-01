const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

secret = "secret"
// Connexion Admin
async function adminLogin(req, res) {
    try {
        const { email, mot_de_passe } = req.body;

        // 1. Validation des champs
        if (!email || !mot_de_passe) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe sont requis'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'email invalide'
            });
        }

        // 2. Récupération de l'admin
        const { data: admin, error } = await supabase
            .from('admin_d')
            .select('id, email, mot_de_passe')
            .eq('email', email)
            .single();

        // Erreur Supabase (ex: problème réseau, table inexistante, etc.)
        if (error) {
            console.error('Erreur Supabase lors de la recherche admin:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur serveur, veuillez réessayer'
            });
        }

        // Admin non trouvé → on ne dit PAS "email inexistant" pour éviter l'enumération
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 3. Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // 4. Génération du token JWT
        const token = jwt.sign(
            { adminId: admin.id, email: admin.email }, // payload clair
            secret,
            { expiresIn: '24h' } // 1h → trop court pour un admin, 24h c'est mieux (ou refresh token)
        );

        return res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            token,
            admin: {
                id: admin.id,
                email: admin.email
            }
        });

    } catch (err) {
        console.error('Erreur inattendue dans adminLogin:', err);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
}


// Création d'un admin (à protéger en prod !)
async function createAdmin(req, res) {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe sont requis'
            });
        }

        if (mot_de_passe.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Le mot de passe doit faire au moins 8 caractères'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'email invalide'
            });
        }

        // Vérifier si l'email existe déjà
        const { data: existingAdmin } = await supabase
            .from('admin_d')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 12); // 12 rounds recommandé

        // Insertion
        const { data, error } = await supabase
            .from('admin_d')
            .insert({
                email: email.toLowerCase().trim(),
                mot_de_passe: hashedPassword
            })
            .select('id, email, created_at')
            .single();

        if (error) {
            console.error('Erreur insertion admin:', error);
            if (error.code === '23505') { // clé unique violée
                return res.status(409).json({
                    success: false,
                    message: 'Cet email existe déjà'
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de la création de l\'admin'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Admin créé avec succès',
            admin: data
        });

    } catch (err) {
        console.error('Erreur inattendue dans createAdmin:', err);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
}



module.exports = { 
    adminLogin, 
    createAdmin,
};