const supabase = require('../config/supabase');

// Récupérer toutes les candidatures
async function getCandidatures(req, res) {
    try {
        const { data, error } = await supabase
            .from('candidature')
            .select('*');

        if (error) throw error;

        return res.status(200).json({
            success: true,
            data: data || []
        });
    } catch (error) {
        console.error('Erreur getCandidatures:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des candidatures'
        });
    }
}

// Ajouter une nouvelle candidature
async function addCandidature(req, res) {
    try {
        const { nom, prenom, email, telephone, classe, motivation, contribution, disponibilite, heure_par_semaine } = req.body;

        // Validation champs requis
        if (!nom || !prenom || !email || !telephone || !classe || !motivation || !contribution || !disponibilite || heure_par_semaine === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis'
            });
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'email invalide'
            });
        }

        const { data: candidature, error } = await supabase
            .from('candidature')
            .insert({
                nom,
                prenom,
                email,
                telephone,
                classe_annee: classe,
                motivation,
                contribution,
                disponibilites : disponibilite,
                heures_par_semaine: heure_par_semaine
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(409).json({
                    success: false,
                    message: 'Une candidature avec cet email existe déjà'
                });
            }
            throw error;
        }

        return res.status(201).json({
            success: true,
            message: 'Candidature ajoutée avec succès',
            data: candidature
        });

    } catch (error) {
        console.error('Erreur addCandidature:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Erreur serveur'
        });
    }
}

// Compter les candidatures
async function countCandidatures(req, res) {
    try {
        const { count, error } = await supabase
            .from('candidature')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        return res.status(200).json({
            success: true,
            count: count || 0
        });
    } catch (error) {
        console.error('Erreur countCandidatures:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors du comptage des candidatures'
        });
    }
}

module.exports = {
    getCandidatures,
    addCandidature,
    countCandidatures,
};