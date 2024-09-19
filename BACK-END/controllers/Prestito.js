import { format } from 'date-fns';
import Prestito from "../models/Prestito.js";
import Libro from "../models/Libro.js";
import Utente from '../models/Utente.js';
import { Op } from 'sequelize';


export const allLoans = async (req, res) => {
  try {

      const loans = await Prestito.findAll({
          include: [
              {
                  model: Libro,
                  as: 'libro',
                  attributes: ['titolo']
              },
              {
                  model: Utente,
                  as: 'utente',
                  attributes: ['email']
              }
          ]
      });


      // Formattazione data
      const formattedLoans = loans.map(loan => {
          const data_prestito = new Date(loan.data_prestito);
          const data_restituzione = loan.data_restituzione ? new Date(loan.data_restituzione) : null;

          return {
              ...loan.toJSON(),
              data_prestito: isNaN(data_prestito.getTime()) ? 'Invalid Date' : format(data_prestito, 'yyyy-MM-dd'), 
              data_restituzione: data_restituzione && !isNaN(data_restituzione.getTime()) ? format(data_restituzione, 'yyyy-MM-dd') : null ,
          };
      });

      res.status(200).json(formattedLoans);
  } catch (error) {
      res.status(500).json({ error: 'Errore nel recupero dei prestiti' });
  }
};
//------------------------------------------------------------------

export const getAvailableBooks = async (req, res) => {
  try {
    const availableBooks = await Libro.findAll({
      where: {
        id: {
          [Op.notIn]: await Prestito.findAll({
            attributes: ['libroId'],
            where: {
              data_restituzione: {
                [Op.is]: null 
              }
            },
            raw: true //  pulizia metadati
          }).then(prestiti => prestiti.map(prestito => prestito.libroId))
        }
      }
    });

    res.status(200).json(availableBooks);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei libri disponibili' });
  }
};

//------------------------------------------------------------------

export const getLoanById = async (req, res) => {
    const { id } = req.params;
    try {
      // recupero del prestito includendo anche libro e utente 
        const loan = await Prestito.findByPk(id, {
            include: [
                {
                    model: Libro,
                    as: 'libro', 
                    attributes: ['titolo'] 
                },
                {
                    model: Utente,
                    as: 'utente',
                    attributes: ['email'] 
                }
            ]
        });

        if (!loan) {
            return res.status(404).json({ error: 'Prestito non trovato' });
        }

        const formattedLoan = {
            ...loan.toJSON(), 
            data_prestito: format(new Date(loan.data_prestito), 'yyyy-MM-dd'), 
            data_restituzione: loan.data_restituzione ? format(new Date(loan.data_restituzione), 'yyyy-MM-dd') : null 
        };

        res.status(200).json(formattedLoan);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero del prestito' });
    }
};
//------------------------------------------------------------------
// utilizzo un filtro basato sulla ricerca del prestito in base alla mail dell'utente che voglio 
export const getLoanByEmail = async (req, res) => {
  const { email } = req.query; 

  try {
    const loans = await Prestito.findAll({
      include: [
        {
          model: Libro,
          as: 'libro',
          attributes: ['titolo']
        },
        {
          model: Utente,
          as: 'utente',
          attributes: ['email'],
          where: email ? { email: { [Op.like]: `%${email}%` } } : {}, 
        }
      ]
    });

    const formattedLoans = loans.map(loan => {
      const data_prestito = new Date(loan.data_prestito);
      const data_restituzione = loan.data_restituzione ? new Date(loan.data_restituzione) : null;

      return {
        ...loan.toJSON(),
        data_prestito: isNaN(data_prestito.getTime()) ? 'Invalid Date' : format(data_prestito, 'yyyy-MM-dd'),
        data_restituzione: data_restituzione && !isNaN(data_restituzione.getTime()) ? format(data_restituzione, 'yyyy-MM-dd') : null,
      };
    });

    res.json(formattedLoans);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei prestiti' });
  }
};

//------------------------------------------------------------------

  export const postLoan = async (req, res) => {
    const { data_prestito, data_restituzione, libroId, utenteId } = req.body;
  
    const libro = await Libro.findByPk(libroId);
    const utente = await Utente.findByPk(utenteId);
      
      if (!libro) {
        return res.status(404).json({ error: 'Libro non trovato' });
      }
      
      if (!utente) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
 

  
      // Verifico se il libro è già stato prestato (controllo aggiuntivo)
      const prestitoAttivo = await Prestito.findOne({
        where: {
          libroId: libroId,
          data_restituzione: null
        }
      });
  
      if (prestitoAttivo) {
        return res.status(400).json({ error: 'Il libro è già stato prestato e non può essere prestato di nuovo' });
      }
     try {
      const nuovoPrestito = await Prestito.create({
        data_prestito,
        data_restituzione: data_restituzione || null,
        libroId,
        utenteId
      });
  
      res.status(201).json(nuovoPrestito);
    } catch (error) {
      res.status(500).json({ error: 'Errore nella creazione del prestito' });
    }
  };

//------------------------------------------------------------------
  
export const updateLoan = async (req, res) => {
  const { id } = req.params; 
  const { data_prestito, data_restituzione, libroId, utenteId } = req.body;

  const libro = await Libro.findByPk(libroId);
  const utente = await Utente.findByPk(utenteId);

  if (!libro) {
    return res.status(404).json({ error: 'Libro non trovato' });
  }
  
  if (!utente) {
    return res.status(404).json({ error: 'Utente non trovato' });
  }

  try {
    const loan = await Prestito.findByPk(id); 
    if (!loan) {
      return res.status(404).json({ error: 'Prestito non trovato' });
    }

    loan.data_prestito = data_prestito;
    loan.data_restituzione = data_restituzione;
    loan.libroId = libroId;
    loan.utenteId = utenteId;

    await loan.save(); 
    res.status(200).json(loan); 
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento del prestito' });
  }
};

//------------------------------------------------------------------


export const deleteLoan = async (req, res) => {
  const { id } = req.params;

  try {
    const loan = await Prestito.findByPk(id);
    if (!loan) {
      return res.status(404).json({ error: 'Prestito non trovato' });
    }
// impedisco di eliminare il prestito se la data di restituzione è null e quindi ancora attivo 
    if (loan.data_restituzione === null) {
      return res.status(400).json({ error: 'Non puoi eliminare il prestito finché è attivo.' });
    }

    await loan.destroy();
    res.status(200).json({ message: 'Prestito cancellato con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la cancellazione del prestito' });
  }
};

