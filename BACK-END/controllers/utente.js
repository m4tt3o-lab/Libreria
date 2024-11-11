import Utente from "../models/Utente.js";
import { Op } from "sequelize";
import Prestito from "../models/Prestito.js";

export const allUsers = async (req, res) => {
  try {
    const users = await Utente.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero degli utenti' });
  }
};

//------------------------------------------------------------------


export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Utente.findByPk(id); 
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.status(200).json(user); 
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero degli utenti' });
  }
};

//------------------------------------------------------------------

export const getUtentiByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const whereClause = {};

    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` }; 
    }

    const utenti = await Utente.findAll({ where: whereClause });
    res.json(utenti);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
}

//------------------------------------------------------------------


export const postUser = async (req, res) => {
  const { nome, cognome, email } = req.body;

  try {
    const nuovoUtente = await Utente.create({ nome, cognome, email });
    res.status(201).json(nuovoUtente);
  } catch (error) {
    res.status(500).json({ error: 'Errore nella creazione del utente' });
  }
};

//------------------------------------------------------------------

export const updateUtente = async (req, res) => {
  const { id } = req.params;
  const { nome, cognome, email } = req.body;
  try {
    const user = await Utente.findByPk(id); 
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    user.nome = nome;
    user.cognome = cognome;
    user.email = email;

    await user.save(); 
    res.status(200).json(user); 
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento del utente' });
  }
};
//------------------------------------------------------------------

export const deleteUtente = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Utente.findByPk(id); 
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

// non posso cancellare l'utente se ha uno o più prestiti attivi
    const prestitoAttivo = await Prestito.findOne({
      where: {
        utenteId: id,
        data_restituzione: null  
      }
    });

    if (prestitoAttivo) {
      return res.status(400).json({ error: 'Non puoi eliminare il libro finché è in prestito ad un utente.' });
    }
    await user.destroy(); 
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: 'Errore nella cancellazione del utente' });
  }
};