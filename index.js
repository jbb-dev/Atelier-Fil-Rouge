const express = require('express')
const app = express()
const port = 3000
const connection = require('./conf')
const bodyParser = require('body-parser')

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.urlencoded({extended : false}))

app.get('/', (req, res) => {
    res.send('hello home')
})

// 1) Affiche la liste de tous les clients et leurs informations
app.get('/api/clients', (req, res) => {
    connection.query(`SELECT * FROM clients`, (err, results) => {
        if (err) {
            res.send('erreur lors de la récupération des clients')
        } else {
            res.json(results)
        }
    })
  
})

// 2) Affiche les clients reptiliens
app.get('/api/clients/reptilian', (req, res) => {
    connection.query(`SELECT name FROM clients WHERE isReptilian=1`, (err, results) => {
        if (err) {
            res.send(`erreur lors de la récupération des Reptiliens`)
        } else {
            res.send(results)
        }
    })
})

// 3) Affiche les infos d'un client selon son nom
app.get(`/api/clients/:name`, (req, res) => {
    const name = req.params.name
    connection.query(`SELECT * FROM clients WHERE name='${name}'`, (err, results) => {
        if (err) {
            res.send(`erreur lors de la récupération des informations du client ${name}`)
        } else {
            res.send(results)
        }
    })
})


// 4) Affiche les clients dont le nom commence par 'r'
app.get(`/api/r`, (req, res) => {
    // const letter = req.query.letter
    connection.query(`SELECT * FROM clients WHERE name LIKE 'r%' `, (err, results) => {
        if (err) {
            res.send(`erreur lors de la récupération des informations du client`)
        } else {
            res.send(results)
        }
        })
        
})


// 5) Affiche les données clients ordonnées par age >30
app.get(`/api/age`, (req, res) => {
    //  const age = req.params.age
    connection.query(`SELECT * FROM clients WHERE age > 30`, (err, results) => {
        if (err) {
            res.send(`erreur lors de la récupération des informations de l'âge`)
        } else {
            res.send(results)
        }
        })
    })

// 6) Affiche les données clients ordonnées par nom client
app.get(`/api/:ordre`, (req, res) => {
    const ordre = req.params.ordre
   connection.query(`SELECT * FROM clients ORDER BY name ${ordre}`, (err, results) => {
       if (err) {
           res.send(`erreur lors de la récupération des informations en ordre`)
       } else {
           res.send(results)
       }
       })
   })

// 7) Post une nouvelle entité
app.post('/api/clients', (req, res) => {
    const data = req.body

    connection.query(`INSERT INTO clients SET ?`, data , (err, results) => {
        if (err) {
            res.send(`erreur lors de la création du nouveau client ${name}`)
        } else {
            res.json(results)
        }
    })
  
})

// 8) Modification d'un client
app.put('/api/clients/:id', (req, res) => {
    const idClient = req.params.id
    const formData = req.body
    connection.query('UPDATE clients SET ? WHERE id = ?', [formData, idClient], err => {
      if (err) {
        console.log(err)
        res.status(500).send("Erreur lors de la modification du client") }
      else {
        res.status(200).send("Client modifié avec succès")
      }
    })
  })

  
// 9) Modification d'un client TOGGLE 
app.put('/api/reptilian/:id', (req, res) => {
    const idClient = req.params.id
    connection.query(`UPDATE clients SET isReptilian = NOT(isReptilian) WHERE id=${idClient}`, err => {
      if (err) {
        console.log(err)
        res.status(500).send("Erreur lors de la modification du client") }
      else {
        res.status(200).send("Client modifié avec succès")
      }
    })
  })

// 10) Suppression d'un client 
app.delete('/api/clients/:id', (req, res) => {
    const idClient = req.params.id
    connection.query('DELETE FROM clients WHERE id = ?', idClient, err => {
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la suppression d'un client");
      } else {
        res.sendStatus(200);
      }
    })
  })

// 11) Suppression des clients non reptiliens
app.delete('/api/reptilian', (req, res) => {
    connection.query('DELETE FROM clients WHERE isReptilian=0', err => {
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la suppression d'un client");
      } else {
        res.sendStatus(200);
      }
    })
  })

app.listen(port, (err) => {
    if (err) {
        throw new Error('server is running bad')
    }
    console.log('server running well')

})