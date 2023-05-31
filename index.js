const { PrismaClient } = require('@prisma/client')
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const PORT = 3001;

const prisma = new PrismaClient()
const app = express()

var isEmpty = function(obj) {
   return Object.keys(obj).length === 0;
}

const isValidSessiontoken = async (sessiontoken) => {
   const sessiontokenInformation = await prisma.sessions.findFirstOrThrow({
      where: {
         id: sessiontoken
      }
   })

   if(sessiontokenInformation){
      return true; // Sessiontoken exists in database
   }else{
      return false; // Sessiontoken does not exist in database
   }
}

app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log(`Sofeo API Listening on Port ${PORT}`));

app.route('/benutzer')
   .get(async (req, res) => {
      const count = await prisma.benutzer.count()
      const result = await prisma.benutzer.findMany({
         select: {
            id: true,
            loginname: true,
            passwort: false,
            berechtigungen: true,
      }})

      res.status(200)
      res.json({
         count: count,
         data: result
      })
      console.log({
         count: count,
         data: result
      })
   })
   .post(async (req, res) => {
      const {sessiontoken, id, loginname, passwort, berechtigungen} = req.body
      const berechtigungenForm = Array.from(String(berechtigungen), Number)

      if(isValidSessiontoken(sessiontoken)){
         const result = await prisma.benutzer.create({
            data: {
               id: Number(id),
               loginname: loginname,
               passwort: passwort,
               berechtigungen: berechtigungenForm
            }
         })
         console.log(result)
         res.json({
            'status': 200,
            ...result
         })
      }else{
         res.json({
            'status': 404
         })
      }
   })

app.route('/benutzer/:benutzerId')
   .get(async (req, res) => {
      const {benutzerId} = req.params

      const result = await prisma.benutzer.findUnique({
         where: {
            id: Number(benutzerId)
         }
      })
   
      res.status(200)
      res.json(result)
   })
   .put(async (req, res) => {
      const {benutzerId} = req.params
      const {passwort} = req.body

      if(passwort){
         const result = await prisma.benutzer.update({
            where: {
               id: benutzerId
            },
            data: {
               passwort: passwort
            }
         })
      }else {
         // Auf Standard Passwort zurücksetzen
      }
   })

app.route('/helfer')
   .get(async (req, res) => {{
      const {sessiontoken} = req.body
      // Check Sessiontoken
      if(isValidSessiontoken(sessiontoken)){
         // Get all helpers
         const count = await prisma.helfer.count()
         const result = await prisma.helfer.findMany()

         res.status(200)
         res.json({
            count: count,
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   }})
   .post(async (req, res) => {{
      const {sessiontoken, id, vorname, nachname, geburtstag, klasse, rufname, verfuegbareZeiten, gewuenschteAufgaben, berechtigungen} = req.body
      //Check Sessiontoken
      if(isValidSessiontoken(sessiontoken) && vorname && nachname){
         let Zeiten = []
         if(verfuegbareZeiten)
            Zeiten = verfuegbareZeiten
         let Aufgaben = []
         if(gewuenschteAufgaben)
            Aufgaben = gewuenschteAufgaben

         let berechtigungenForm = [0,1,0,0]
         if(berechtigungen)
            berechtigungenForm = Array.from(String(berechtigungen), Number)

         const loginname = vorname.toLowerCase() + '.' + nachname.toLowerCase()

         if(id){
            const result = await prisma.helfer.create({
               data: {
                  id: id,
                  vorname: vorname,
                  nachname: nachname,
                  geburtstag: geburtstag,
                  klasse: klasse,
                  rufname: rufname,
                  verfuegbareZeiten: Zeiten,
                  gewuenschteAufgaben: Aufgaben
               }
            })

            const user = await prisma.benutzer.create({
               data: {
                  id: id,
                  loginname: loginname,
                  passwort: String(geburtstag),
                  berechtigungen: berechtigungenForm
               }
            })
         }else{
            const result = await prisma.helfer.create({
               data: {
                  vorname: vorname,
                  nachname: nachname,
                  geburtstag: geburtstag,
                  klasse: klasse,
                  rufname: rufname,
                  verfuegbareZeiten: Zeiten,
                  gewuenschteAufgaben: Aufgaben
               }
            })

            const user = await prisma.benutzer.create({
               data: {
                  id: id,
                  loginname: loginname,
                  passwort: String(geburtstag),
                  berechtigungen: berechtigungenForm
               }
            })
         }
         res.status(200)
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   }})

app.route('/helfer/:helferId')
   .get(async (req, res) => {
      const {sessiontoken} = req.body
      const {helferId} = req.params
      if(isValidSessiontoken(sessiontoken)){
         const result = await prisma.helfer.findUnique({
            where: {
               id: benutzerId
            }
         })
         res.status(200)
         res.json({
            data: result
         })
      }else{
         res.status(404)
         res.json({
            error: 'Invalid Sessiontoken'
         })
      }
   })
   .put(async (req, res) => {
      const {sessiontoken} = req.body
   })
app.route('/klassen')

app.route('/klassen/:klassenKuerzel')

app.route('/lehrer')

app.get('/', async (req, res) => {
   res.json({
      name: 'Sofeo API',
      version: 'v1.0',
      author: 'Hannah Brandt'
   })
})


app.post('/benutzer/login', async (req, res) => {
   const {loginname, passwort} = req.body
   //passwort base-64 codiert

   const databaseRes = await prisma.benutzer.findFirstOrThrow({
      where: {
         loginname: loginname,
         passwort: passwort
      }
   })

   if(!isEmpty(databaseRes)){
      // Create session token
      const sessiontoken = uuid.v4()

      const createSession = await prisma.sessions.create({
         data: {
            id: sessiontoken,
            benutzer_id: Number(databaseRes.id),
         },
      })

      console.log({sessiontoken: sessiontoken, id: Number(databaseRes.id), berechtigungen: databaseRes.berechtigungen})

      // Send result: {sessiontoken, benutzer_id, berechtigungen}
      res.json({
         sessiontoken: sessiontoken,
         id: Number(databaseRes.id),
         berechtigungen: databaseRes.berechtigungen,
      })
   }else{
      res.status(400)
   }
})

app.get('/benutzer/logout/:sessiontoken', async (req, res) => {
   // Delete sessiontoken
   const {sessiontoken} = req.params

   const result = await prisma.sessions.delete({
      where: {
         id: sessiontoken
      }
   })

   res.status(200)
})

app.put('/benutzer/:id/:passwort', async (req, res) => {
   const {id, passwort} = req.params

   const result = await prisma.benutzer.update({
      where: {
         id: Number(id),
      },
      data: {
         passwort: passwort,
      },
   })

   res.status(200)
   res.json(result)
})