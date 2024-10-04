import Libro from "../models/Libro.js";
import Prestito from "../models/Prestito.js";
import { Op } from "sequelize";

export const allBooks = async (req, res) => {
  try {
    const books = await Libro.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei libri' });
  }
};


export const getLibroById = async (req, res) => {
  const { id } = req.params;
  try {
    const libro = await Libro.findByPk(id); // Cerco l'id
    if (!libro) {
      return res.status(404).json({ error: 'Libro non trovato' });
    }
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero del libro' });
  }
};

//------------------------------------------------------------------

export const getLibriByFilter = async (req, res) => {
  try {
    const { titolo, autore, annoPubblicazione, genere } = req.query;

    const whereClause = {};

    if (titolo) {
      whereClause.titolo = { [Op.like]: `%${titolo}%` };
    }
    if (autore) {
      whereClause.autore = { [Op.like]: `%${autore}%` };
    }
    if (annoPubblicazione) {
      whereClause.annoPubblicazione = annoPubblicazione;
    }
    if (genere) {
      whereClause.genere = genere;
    }


    const libri = await Libro.findAll({
      where: whereClause,
      
    });

    res.json(libri);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei libri' });
  }
};

//------------------------------------------------------------------


export const postBook = async (req, res) => {
  const { titolo, autore, annoPubblicazione, genere } = req.body;
  try {
    const nuovoLibro = await Libro.create({ titolo, autore, annoPubblicazione, genere });
    res.status(201).json(nuovoLibro);
  } catch (error) {
    res.status(500).json({ error: 'Errore nella creazione del libro' });
  }
};

//------------------------------------------------------------------

export const updateLibro = async (req, res) => {
  const { id } = req.params;
  const { titolo, autore, annoPubblicazione, genere } = req.body;
  
  try {
    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro non trovato' });
    }
 
    libro.titolo = titolo;
    libro.autore = autore;
    libro.annoPubblicazione = annoPubblicazione;
    libro.genere = genere;
    
    await libro.save(); 

    res.status(200).json(libro);
    
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento del libro' });
  }
};


//------------------------------------------------------------------

export const deleteLibro = async (req, res) => {
  const { id } = req.params;
  
  try {
    const libro = await Libro.findByPk(id); 
    if (!libro) {
      return res.status(404).json({ error: 'Libro non trovato' });
    }

    // Controllo se esiste un prestito attivo associato al libro
    const prestitoAttivo = await Prestito.findOne({
      where: {
        libroId: id,
        data_restituzione: null  
      }
    });

    if (prestitoAttivo) {
      return res.status(400).json({ error: 'Non puoi eliminare il libro finché è in prestito ad un utente.' });
    }

    await libro.destroy(); 
    res.status(204).send(); 

  } catch (error) {
    res.status(500).json({ error: 'Errore nella cancellazione del libro' });
  }
};